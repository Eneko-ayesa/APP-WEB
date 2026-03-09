require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { CloudAdapter, ConfigurationBotFrameworkAuthentication, TurnContext } = require('botbuilder');

const PATH_DB = './usuarios.json';

// 1. VALIDACIÓN ESTRICTA
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.TENANT_ID) {
    console.error("❌ ERROR: Faltan variables de entorno en .env");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// --- FUNCIONES DE BASE DE DATOS ---

function cargarUsuarios() {
    try {
        if (fs.existsSync(PATH_DB)) {
            const data = fs.readFileSync(PATH_DB, 'utf8');
            // Convertimos el array del JSON en un objeto de referencias para el bot
            const array = JSON.parse(data);
            const obj = {};
            array.forEach(u => {
                obj[u.conversationId] = u.reference;
            });
            return obj;
        }
    } catch (error) {
        console.error("Error cargando la base de datos:", error);
    }
    return {};
}

function guardarUsuarios(referencias) {
    try {
        // Convertimos el objeto de referencias a un array plano para guardar en JSON
        const arrayParaGuardar = Object.keys(referencias).map(id => ({
            conversationId: id,
            reference: referencias[id]
        }));
        fs.writeFileSync(PATH_DB, JSON.stringify(arrayParaGuardar, null, 2));
    } catch (error) {
        console.error("Error guardando en la base de datos:", error);
    }
}

// 2. CONFIGURACIÓN DEL ADAPTER
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({
    MicrosoftAppId: process.env.CLIENT_ID,
    MicrosoftAppPassword: process.env.CLIENT_SECRET,
    MicrosoftAppTenantId: process.env.TENANT_ID,
    MicrosoftAppType: 'SingleTenant'
});

const adapter = new CloudAdapter(botFrameworkAuthentication);

// 3. CARGAR REFERENCIAS DESDE EL ARCHIVO AL ARRANCAR
// Esto es lo que permite que el bot "recuerde" a los usuarios tras reiniciar
let conversationReferences = cargarUsuarios();

// 4. ENDPOINT PARA RECIBIR MENSAJES DE TEAMS
app.post('/api/messages', (req, res) => {
    adapter.process(req, res, async (context) => {
        try {
            if (context.activity.type === 'message') {
                const reference = TurnContext.getConversationReference(context.activity);
                
                // Guardamos/Actualizamos la referencia
                conversationReferences[reference.conversation.id] = reference;
                guardarUsuarios(conversationReferences);

                console.log(`✅ Chat vinculado y guardado: ${reference.conversation.id}`);
                await context.sendActivity("¡Vínculo guardado en la base de datos! Ya puedes enviar tarjetas desde el panel.");
            }
        } catch (error) {
            console.error("Error procesando el mensaje desde Teams:", error);
        }
    });
});

// 5. ENDPOINT PARA ENVIAR LA TARJETA (Desde Animaciones.js)
app.post('/api/enviar-teams', async (req, res) => {
    try {
        const { tarjeta } = req.body;

        if (!tarjeta) {
            return res.status(400).json({ error: 'Falta el JSON de la tarjeta' });
        }

        const ids = Object.keys(conversationReferences);

        if (ids.length === 0) {
            return res.status(400).json({ 
                error: 'La base de datos está vacía. El bot necesita que alguien le escriba primero en Teams.' 
            });
        }

        console.log(`Enviando tarjeta a ${ids.length} chats conocidos...`);

        for (const conversationId of ids) {
            const reference = conversationReferences[conversationId];
            
            await adapter.continueConversationAsync(
                process.env.CLIENT_ID,
                reference,
                async (turnContext) => {
                    await turnContext.sendActivity({
                        attachments: [{
                            contentType: 'application/vnd.microsoft.card.adaptive',
                            content: tarjeta
                        }]
                    });
                }
            );
        }

        res.status(200).json({ mensaje: `Tarjeta enviada a ${ids.length} usuarios.` });
    } catch (error) {
        console.error("Error interno al enviar tarjeta:", error);
        res.status(500).json({ error: 'Error al enviar la tarjeta a Teams.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor con base de datos iniciado en el puerto ${PORT}`);
    console.log(`Usuarios recordados actualmente: ${Object.keys(conversationReferences).length}`);
});
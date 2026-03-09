require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { CloudAdapter, ConfigurationBotFrameworkAuthentication, TurnContext } = require('botbuilder');

// 1. VALIDACIÓN ESTRICTA: Detener si falta algo en el .env
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.TENANT_ID) {
    console.error("❌ ERROR: Faltan variables de entorno en .env");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 2. CONFIGURACIÓN DEL ADAPTER PARA MICROSOFT TEAMS
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({
    MicrosoftAppId: process.env.CLIENT_ID,
    MicrosoftAppPassword: process.env.CLIENT_SECRET,
    MicrosoftAppTenantId: process.env.TENANT_ID,
    MicrosoftAppType: 'SingleTenant'
});

const adapter = new CloudAdapter(botFrameworkAuthentication);

// 3. ALMACÉN TEMPORAL DE CONVERSACIONES
// Aquí guardaremos "quién ha hablado con el bot" para poder responderle después.
const conversationReferences = {};

// 4. ENDPOINT PARA RECIBIR MENSAJES DE TEAMS (Tu conexión con ngrok)
app.post('/api/messages', (req, res) => {
    adapter.process(req, res, async (context) => {
        try {
            if (context.activity.type === 'message') {
                // ¡CLAVE! Extraemos y guardamos la referencia de esta conversación
                const reference = TurnContext.getConversationReference(context.activity);
                conversationReferences[reference.conversation.id] = reference;

                // Respondemos para confirmar que el vínculo está hecho
                await context.sendActivity("¡Bot activo y chat vinculado! Ya puedes enviarme tarjetas desde tu panel web.");
            }
        } catch (error) {
            console.error("Error procesando el mensaje desde Teams:", error);
        }
    });
});

// 5. ENDPOINT PARA ENVIAR LA TARJETA DESDE TU FORMULARIO (Llamado por Animaciones.js)
app.post('/api/enviar-teams', async (req, res) => {
    try {
        const { tarjeta, destinatarios } = req.body;

        if (!tarjeta) {
            return res.status(400).json({ error: 'Falta el JSON de la tarjeta adaptativa' });
        }

        if (Object.keys(conversationReferences).length === 0) {
            return res.status(400).json({ error: 'No hay chats vinculados. Debes escribirle "hola" al bot en Teams primero.' });
        }

        // Recorremos todos los chats que el bot tiene guardados y enviamos la tarjeta
        // (En esta versión de prueba, lo enviará a todos los que hayan hablado con el bot)
        for (const conversationId of Object.keys(conversationReferences)) {
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

        res.status(200).json({ mensaje: 'Tarjeta enviada a Teams correctamente' });
    } catch (error) {
        console.error("Error interno al enviar tarjeta proactiva:", error);
        res.status(500).json({ error: 'Error al enviar la tarjeta a Teams.' });
    }
});

// 6. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
    console.log(`Conexión con ngrok esperada en: /api/messages`);
});
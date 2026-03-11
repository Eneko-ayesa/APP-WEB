require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { CloudAdapter, ConfigurationBotFrameworkAuthentication, TurnContext } = require('botbuilder');
// Librerías de Microsoft Graph
const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");

const PATH_DB = './usuarios.json';

// 1. VALIDACIÓN ESTRICTA
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.TENANT_ID || !process.env.EMAIL_USER) {
    console.error("❌ ERROR: Faltan variables de entorno en .env (asegúrate de incluir EMAIL_USER)");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// --- 2. CONFIGURACIÓN DE MICROSOFT GRAPH (PARA OUTLOOK) ---
const credential = new ClientSecretCredential(process.env.TENANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET);
const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ["https://graph.microsoft.com/.default"] });
const graphClient = Client.initWithMiddleware({ authProvider });

// --- 3. FUNCIONES DE BASE DE DATOS (TEAMS) ---
function cargarUsuarios() {
    try {
        if (fs.existsSync(PATH_DB)) {
            const data = fs.readFileSync(PATH_DB, 'utf8');
            const array = JSON.parse(data);
            const obj = {};
            array.forEach(u => obj[u.conversationId] = u.reference);
            return obj;
        }
    } catch (error) { console.error("Error BD:", error); }
    return {};
}

function guardarUsuarios(referencias) {
    const arrayParaGuardar = Object.keys(referencias).map(id => ({ conversationId: id, reference: referencias[id] }));
    fs.writeFileSync(PATH_DB, JSON.stringify(arrayParaGuardar, null, 2));
}

// --- 4. ADAPTER (TEAMS) ---
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({
    MicrosoftAppId: process.env.CLIENT_ID,
    MicrosoftAppPassword: process.env.CLIENT_SECRET,
    MicrosoftAppTenantId: process.env.TENANT_ID,
    MicrosoftAppType: 'SingleTenant'
});
const adapter = new CloudAdapter(botFrameworkAuthentication);
let conversationReferences = cargarUsuarios();

// --- 5. ENDPOINTS ---
app.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, async (context) => {
        // 1. Detectar si el evento es de "Actualización de Conversación" (alguien instaló el bot)
        if (context.activity.type === 'conversationUpdate') {
            const membersAdded = context.activity.membersAdded;
            
            if (membersAdded) {
                for (let member of membersAdded) {
                    // Ignorar al propio bot, solo queremos guardar a los humanos
                    if (member.id !== context.activity.recipient.id) {
                        
                        // Extraemos la referencia mágica para poder hablarle luego
                        const referencia = TurnContext.getConversationReference(context.activity);
                        
                        // En Teams, el identificador único de Azure es aadObjectId
                        const azureId = referencia.user.aadObjectId;

                        if (azureId) {
                            // Guardamos en la memoria RAM
                            conversationReferences[azureId] = referencia;
                            
                            // Y lo guardamos en tu archivo usuarios.json
                            fs.writeFileSync(PATH_DB, JSON.stringify(conversationReferences, null, 2));
                            console.log(`✅ Nuevo usuario registrado automáticamente: ${azureId}`);
                        }
                    }
                }
            }
        }
        if (context.activity.type === 'message') {
            const reference = TurnContext.getConversationReference(context.activity);
            conversationReferences[reference.conversation.id] = reference;
            guardarUsuarios(conversationReferences);
            await context.sendActivity("¡Vinculado!");
        }
    });
});

// Función auxiliar para crear pausas de tiempo en el código
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función auxiliar para dividir una lista grande en grupos (lotes) más pequeños
function dividirEnLotes(array, tamaño) {
    const lotes = [];
    for (let i = 0; i < array.length; i += tamaño) {
        lotes.push(array.slice(i, i + tamaño));
    }
    return lotes;
}

app.post('/api/enviar-teams', async (req, res) => {
    try {
        const { tarjeta, destinatarios } = req.body;
        
        if (!destinatarios || destinatarios.length === 0) {
            return res.status(400).json({ error: "No hay destinatarios seleccionados." });
        }

        let targetUserIds = new Set(); 

        // 1. Fase de desglose de destinatarios
        for (const email of destinatarios) {
            const groupSearch = await graphClient.api(`/groups`)
                .filter(`mail eq '${email}'`)
                .select('id').get();

            if (groupSearch.value && groupSearch.value.length > 0) {
                const groupId = groupSearch.value[0].id;
                const members = await graphClient.api(`/groups/${groupId}/members`).select('id').get();
                members.value.forEach(m => {
                    if (m['@odata.type'] === '#microsoft.graph.user') targetUserIds.add(m.id);
                });
                continue; 
            }

            const userSearch = await graphClient.api(`/users`)
                .filter(`mail eq '${email}' or userPrincipalName eq '${email}'`)
                .select('id').get();

            if (userSearch.value && userSearch.value.length > 0) {
                targetUserIds.add(userSearch.value[0].id);
            }
        }

        // 2. Preparamos las referencias
        const referenciasValidas = [];
        for (const id of Object.keys(conversationReferences)) {
            const referencia = conversationReferences[id];
            if (referencia.user && referencia.user.aadObjectId && targetUserIds.has(referencia.user.aadObjectId)) {
                referenciasValidas.push(referencia);
            }
        }

        // 3. RESPUESTA INMEDIATA
        res.status(202).json({ 
            mensaje: `Procesando envío masivo. Detectados ${targetUserIds.size} usuarios totales. Iniciando entrega...` 
        });

        // 4. PROCESO ASÍNCRONO CON REPORTE DETALLADO
        (async () => {
            try {
                const TAMANO_LOTE = 20; 
                const ESPERA_ENTRE_LOTES = 2000; 
                let exitos = 0;
                let fallos = 0;

                const lotes = [];
                for (let i = 0; i < referenciasValidas.length; i += TAMANO_LOTE) {
                    lotes.push(referenciasValidas.slice(i, i + TAMANO_LOTE));
                }

                console.log(`\n🚀 PROCESANDO LISTA: ${targetUserIds.size} usuarios totales.`);
                console.log(`Usuarios localizados con Bot instalado: ${referenciasValidas.length}`);
                console.log(`🚫 Usuarios que NO tienen el bot: ${targetUserIds.size - referenciasValidas.length}\n`);

                for (let i = 0; i < lotes.length; i++) {
                    const loteActual = lotes[i];
                    
                    const promesasEnvio = loteActual.map(referencia => {
                        return adapter.continueConversationAsync(process.env.CLIENT_ID, referencia, async (ctx) => {
                            await ctx.sendActivity({ 
                                attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: tarjeta }] 
                            });
                            exitos++;
                        }).catch(err => {
                            fallos++;
                            // No mostramos cada error individual para no saturar la consola
                        });
                    });

                    await Promise.all(promesasEnvio);
                    
                    console.log(`Lote ${i + 1}/${lotes.length} | Éxitos: ${exitos} | Fallos: ${fallos}`);

                    if (i < lotes.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, ESPERA_ENTRE_LOTES));
                    }
                }
                
                console.log(`\nREPORTE FINAL DE ENVÍO:`);
                console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                console.log(`✅ Entregas confirmadas: ${exitos}`);
                console.log(`❌ Errores (Bot no activo): ${fallos}`);
                console.log(`📈 Efectividad: ${((exitos / (exitos + fallos)) * 100).toFixed(1)}%`);
                console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

            } catch (errAsync) {
                console.error("❌ Error en el proceso de fondo:", errAsync);
            }
        })();

        return;

    } catch (error) {
        console.error("Error al preparar envío:", error.message);
        if (!res.headersSent) res.status(500).json({ error: 'Error interno.' });
    }
});

app.get('/api/buscar-usuarios', async (req, res) => {
    const query = req.query.q;
    try {
        // 1. Hacemos una búsqueda MUY simple por nombre para que Microsoft NO devuelva error.
        // Quitamos el ConsistencyLevel y los "or/and" complicados.
        const [users, groups] = await Promise.all([
            graphClient.api('/users')
                .filter(`startswith(displayName, '${query}')`)
                .select('displayName,mail,userPrincipalName')
                .top(10)
                .get(),
            
            graphClient.api('/groups')
                .filter(`startswith(displayName, '${query}')`)
                .select('displayName,mail,mailEnabled')
                .top(50) // Pedimos hasta 50 grupos para asegurar que el tuyo no se quede fuera
                .get()
        ]);

        // 2. Combinamos resultados y filtramos las Listas de Distribución aquí en local
        const resultados = [
            // Mapeamos los usuarios
            ...users.value.map(u => ({ 
                name: u.displayName, 
                // Si el usuario no tiene 'mail', cogemos su userPrincipalName
                mail: u.mail || u.userPrincipalName, 
                tipo: "👤 Usuario" 
            })),
            
            // Mapeamos los grupos, pero filtramos con JavaScript SÓLO los que tienen correo habilitado
            ...groups.value
                .filter(g => g.mailEnabled === true) // <--- Esta es la clave para que salgan
                .map(g => ({ 
                    name: g.displayName, 
                    mail: g.mail || "Sin correo", 
                    tipo: "👥 Grupo LD" 
                }))
        ];
        
        res.json(resultados);
    } catch (error) {
        console.error("Error Graph API Búsqueda:", error.message);
        res.status(500).json({ error: 'Error al buscar en el directorio' });
    }
});

// Ruta para obtener los grupos y mostrarlos en el frontend
app.get('/api/grupos', async (req, res) => {
    try {
        // Pedimos los grupos de Office 365 / Listas de distribución
        const grupos = await graphClient.api('/groups')
            // Filtramos para traer los más relevantes (opcional, puedes quitar el filter si quieres todos)
            .filter("mailEnabled eq true") 
            .select('id,displayName,mail') // Traemos solo lo importante
            .get();

        res.status(200).json(grupos.value);
    } catch (error) {
        console.error("Error al obtener grupos:", error.message);
        res.status(500).json({ error: 'Fallo al obtener las listas de distribución.' });
    }
});
// =======================================================
// RUTA PARA OBTENER LOS MIEMBROS DE UN GRUPO (PARA EL EXPLORADOR)
// =======================================================
app.get('/api/miembros-grupo', async (req, res) => {
    try {
        // Cogemos el ID que nos envía el frontend (ej: ?id=5c9fa30c...)
        const groupId = req.query.id; 
        
        if (!groupId) {
            return res.status(400).json({ error: "Falta el ID del grupo." });
        }

        // Le pedimos a Microsoft Graph los miembros de ese grupo
        const miembros = await graphClient.api(`/groups/${groupId}/members`)
            .select('displayName,mail,userPrincipalName,jobTitle')
            .top(999) // Trae hasta 999 personas
            .get();
            
        // Devolvemos el array de personas al frontend
        res.status(200).json(miembros.value);
        
    } catch (error) {
        console.error("Error al obtener los miembros del grupo:", error.message);
        res.status(500).json({ error: "Fallo interno al cargar los miembros." });
    }
});
// Ruta para obtener los miembros de un grupo específico
app.get('/api/grupos/:id/miembros', async (req, res) => {
    try {
        const groupId = req.params.id;
        
        // Pedimos a Graph API los miembros del grupo seleccionado
        const miembros = await graphClient.api(`/groups/${groupId}/members`)
            .select('displayName,mail,jobTitle')
            .top(999) // Trae hasta 999 miembros (puedes ajustarlo si necesitas más)
            .get();
            
        res.status(200).json(miembros.value);
    } catch (error) {
        console.error("Error al obtener miembros:", error.message);
        res.status(500).json({ error: "Fallo al cargar los miembros del grupo." });
    }
});


app.post('/api/enviar-teams-grupo', async (req, res) => {
    try {
        // Asumo que envías la 'tarjeta' (Adaptive Card) igual que en tu endpoint normal de Teams
        const { groupId, tarjeta } = req.body; 

        // 1. Obtener los miembros del grupo seleccionado usando Graph API
        const miembros = await graphClient.api(`/groups/${groupId}/members`)
            .select('id,userPrincipalName')
            .get();

        // Extraemos un array solo con los IDs de Azure de esa gente
        const idsMiembros = miembros.value.map(usuario => usuario.id);
        let enviados = 0;

        // 2. Recorremos los usuarios que tu bot ya conoce (tu base de datos usuarios.json)
        for (const id of Object.keys(conversationReferences)) {
            const referencia = conversationReferences[id];

            // En Teams, la referencia del bot guarda el ID de Azure del usuario en 'referencia.user.aadObjectId'
            // Comprobamos si el usuario de esta conversación está dentro de la lista de miembros del grupo
            if (referencia.user && idsMiembros.includes(referencia.user.aadObjectId)) {
                
                // ¡Bingo! Está en la lista. Le enviamos la tarjeta usando tu Bot Framework
                await adapter.continueConversationAsync(process.env.CLIENT_ID, referencia, async (ctx) => {
                    await ctx.sendActivity({ 
                        attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: tarjeta }] 
                    });
                });
                enviados++;
            }
        }

        res.status(200).json({ mensaje: `Enviado a ${enviados} integrantes de la lista por Teams.` });

    } catch (error) {
        console.error("Error al enviar a grupo por Teams:", error.message);
        res.status(500).json({ error: 'Fallo al procesar o enviar a los integrantes del grupo.' });
    }
});
// --- Iniciacion ---
app.listen(3000, () => {
    console.log('🚀 Servidor activo en puerto 3000');
});
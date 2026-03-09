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
app.post('/api/messages', (req, res) => {
    adapter.process(req, res, async (context) => {
        if (context.activity.type === 'message') {
            const reference = TurnContext.getConversationReference(context.activity);
            conversationReferences[reference.conversation.id] = reference;
            guardarUsuarios(conversationReferences);
            await context.sendActivity("¡Vinculado!");
        }
    });
});

app.post('/api/enviar-teams', async (req, res) => {
    const { tarjeta } = req.body;
    for (const id of Object.keys(conversationReferences)) {
        await adapter.continueConversationAsync(process.env.CLIENT_ID, conversationReferences[id], async (ctx) => {
            await ctx.sendActivity({ attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: tarjeta }] });
        });
    }
    res.status(200).json({ mensaje: 'Enviado a Teams' });
});

// NUEVO ENDPOINT PARA OUTLOOK VÍA GRAPH API
app.post('/api/enviar-outlook', async (req, res) => {
    try {
        const { destinatarios, htmlCuerpo, asunto } = req.body;

        const sendMail = {
            message: {
                subject: asunto || "Nuevo Comunicado",
                body: { contentType: "HTML", content: htmlCuerpo },
                toRecipients: destinatarios.map(email => ({ emailAddress: { address: email } }))
            }
        };

        // Envía el correo usando la identidad de la App
        await graphClient.api(`/users/${process.env.EMAIL_USER}/sendMail`).post(sendMail);
        
        res.status(200).json({ mensaje: 'Correo enviado por Microsoft Graph' });
    } catch (error) {
        console.error("Error Graph API:", error.message);
        res.status(500).json({ error: 'Fallo al enviar correo. Verifica permisos de Mail.Send en Azure.' });
    }
});

app.get('/api/buscar-usuarios', async (req, res) => {
    const query = req.query.q;
    try {
        // Buscamos tanto en 'users' como en 'groups'
        const [users, groups] = await Promise.all([
            graphClient.api('/users').filter(`startswith(displayName, '${query}')`).select('displayName,mail').top(5).get(),
            graphClient.api('/groups').filter(`startswith(displayName, '${query}')`).select('displayName,mail').top(5).get()
        ]);

        // Combinamos resultados
        const resultados = [
            ...users.value.map(u => ({ name: u.displayName, mail: u.mail || "Sin email", tipo: "👤 Usuario" })),
            ...groups.value.map(g => ({ name: g.displayName, mail: g.mail || "Grupo", tipo: "👥 Grupo" }))
        ];
        
        res.json(resultados);
    } catch (error) {
        console.error("Error Graph API:", error);
        res.status(500).json({ error: 'Error al buscar' });
    }
});
// --- Iniciacion ---
app.listen(3000, () => {
    console.log('🚀 Servidor activo en puerto 3000');
});
require('dotenv').config(); // Siempre al principio
const express = require('express');
const path = require('path');
const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");

const app = express();
app.use(express.json());

// Sirve tus archivos HTML/JS/CSS desde la carpeta actual
app.use(express.static(path.join(__dirname, '.')));

// Configuración de autenticación con Azure
const credential = new ClientSecretCredential(
    process.env.TENANT_ID,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
});

const client = Client.initWithMiddleware({ authProvider });

/**
 * Función interna que realiza la magia en Microsoft Graph
 */
async function enviarAMicrosoftGraph(email, tarjeta) {
    // 1. Obtener el ID del usuario por su email
    const user = await client.api(`/users/${email}`).get();
    const userId = user.id;

    // 2. Crear o recuperar el chat 1:1 entre la App y el Usuario
    const chat = await client.api('/chats').post({
        chatType: 'oneOnOne',
        members: [
            {
                '@odata.type': '#microsoft.graph.aadUserConversationMember',
                roles: ['owner'],
                'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${userId}')`
            },
            {
                '@odata.type': '#microsoft.graph.aadUserConversationMember',
                roles: ['owner'],
                'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${process.env.CLIENT_ID}')`
            }
        ]
    });

    // 3. Enviar la tarjeta adaptativa al chat creado
    const message = {
        body: {
            contentType: 'html',
            content: '<attachment id="74d20c7f34ad4991b4d8f5ee54749596"></attachment>'
        },
        attachments: [
            {
                id: '74d20c7f34ad4991b4d8f5ee54749596',
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: JSON.stringify(tarjeta)
            }
        ]
    };

    return await client.api(`/chats/${chat.id}/messages`).post(message);
}

// Ruta principal para el envío masivo
app.post('/api/enviar-teams', async (req, res) => {
    const { destinatarios, tarjeta } = req.body;

    if (!destinatarios || !tarjeta) {
        return res.status(400).send({ error: "Faltan datos (emails o tarjeta)" });
    }

    // Ejecutar en segundo plano para no bloquear la web
    console.log(`Iniciando envío masivo a ${destinatarios.length} personas...`);
    
    // Procesar envíos
    for (const email of destinatarios) {
        try {
            await enviarAMicrosoftGraph(email.trim(), tarjeta);
            console.log(`✅ Enviado con éxito a: ${email}`);
        } catch (err) {
            console.error(`❌ Error con ${email}:`, err.message);
        }
        // Delay de 1.2 segundos para respetar límites de la API de Microsoft
        await new Promise(resolve => setTimeout(resolve, 1200));
    }

    res.send({ status: "Proceso de envío finalizado" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("-----------------------------------------");
    console.log(`Servidor de Ayesa listo en: http://localhost:${PORT}`);
    console.log("-----------------------------------------");
});
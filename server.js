const express = require('express');
const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");

const app = express();
app.use(express.json());

// Estos datos los sacas de Entra ID y se quedan SEGUROS en el servidor
const credential = new ClientSecretCredential(
    "TU_TENANT_ID",
    "TU_CLIENT_ID",
    "TU_CLIENT_SECRET"
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
});

const client = Client.initWithMiddleware({ authProvider });

// La ruta que recibe la orden desde tu HTML
app.post('/api/enviar-teams', async (req, res) => {
    const { destinatarios, tarjeta } = req.body;

    // Bucle para enviar a los 2.000 (con un pequeño delay para no saturar)
    for (const email of destinatarios) {
        try {
            // Lógica de envío que te pasé antes (User ID -> Chat -> Message)
            await enviarAMicrosoftGraph(email.trim(), tarjeta);
            console.log(`Enviado a ${email}`);
            
            // Pausa de 1.5 segundos entre envíos para evitar bloqueos
            await new Promise(resolve => setTimeout(resolve, 1500)); 
        } catch (err) {
            console.error(`Error con ${email}:`, err);
        }
    }
    res.send({ status: "Proceso finalizado" });
});

app.listen(3000, () => console.log("Servidor de Ayesa listo en puerto 3000"));
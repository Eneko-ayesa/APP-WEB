require('dotenv').config();
global.enviosActivos = {};
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '.')));

// --- 2. CONFIGURACIÓN DE MICROSOFT GRAPH (PARA OUTLOOK) ---
const credential = new ClientSecretCredential(process.env.TENANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET);
const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ["https://graph.microsoft.com/.default"] });
const client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider: authProvider
});
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


app.get('/api/buscar-usuarios', async (req, res) => {
    const busqueda = req.query.q;
    
    if (!busqueda || busqueda.length < 3) {
        return res.json([]);
    }

    try {
        // 1. Buscamos USUARIOS que coincidan con el texto
        const responseUsuarios = await client.api('/users')
            .filter(`startsWith(displayName, '${busqueda}') or startsWith(mail, '${busqueda}')`)
            .select('id,displayName,mail,userPrincipalName')
            .top(5)
            .get();

        // 2. Buscamos GRUPOS que coincidan con el texto y contamos sus miembros
        const responseGrupos = await client.api('/groups')
                    .header('ConsistencyLevel', 'eventual') 
                    .query({ $count: true })
                    .filter(`startsWith(displayName, '${busqueda}') or startsWith(mail, '${busqueda}')`)
                    .expand('members($count=true)') 
                    .top(5)
                    .get();

        // 3. Formateamos los usuarios
        const usuarios = responseUsuarios.value.map(u => ({
            id: u.id,
            nombre: u.displayName,
            correo: u.mail || u.userPrincipalName,
            tipo: 'usuario'
        }));
        // 4. Formateamos los grupos (¡CORREGIDO!)
       const grupos = responseGrupos.value.map(g => {
            // A veces Microsoft lo manda en odata.count, a veces dentro del array members
            const numeroMiembros = g['members@odata.count'] || (g.members ? g.members.length : 0);
            
            return {
                id: g.id,
                nombre: g.displayName,
                correo: g.mail || "Sin correo",
                cantidadUsuarios: numeroMiembros,
                tipo: 'grupo'
            };
        });

        // 5. Unimos ambas listas y las enviamos al navegador
        res.status(200).json([...usuarios, ...grupos]);
    } catch (error) {
        // 🛑 ESTO ES LO QUE TE CHIVARÁ EL ERROR REAL SI ALGO FALLA
        console.error("❌ Error en /api/buscar-usuarios:", error.message);
        
        // Enviamos el error detallado al navegador en lugar de un objeto vacío
        res.status(500).json({ 
            error: 'No se pudo consultar Microsoft Graph', 
            detalle: error.message 
        });
    }
});

// Ruta para obtener los grupos y mostrarlos en el frontend
// Ruta para cargar el menú desplegable de grupos al iniciar la página
app.get('/api/grupos', async (req, res) => {
    try {
        const grupos = await client.api('/groups')
            .header('ConsistencyLevel', 'eventual') 
            .query({ $count: true }) // 👈 Obligatorio para Graph
            .select('id,displayName,mail')
            .expand('members($count=true)') // 👈 ¡La magia para contar!
            .top(999) 
            .get();

        // Formateamos los datos y sacamos el número
        const gruposFormateados = grupos.value.map(g => {
            const numeroMiembros = g['members@odata.count'] || (g.members ? g.members.length : 0);
            
            return {
                id: g.id,
                displayName: g.displayName,
                correo: g.mail || "Sin correo",
                cantidadUsuarios: numeroMiembros // 👈 Aquí mandamos el número a la web
            };
        });

        res.status(200).json(gruposFormateados);
    } catch (error) {
        console.error("Error al obtener grupos del desplegable:", error.message);
        res.status(500).json({ error: 'Fallo al obtener las listas de distribución.' });
    }
});
// =======================================================
// RUTAS PARA OBTENER LOS MIEMBROS DE UN GRUPO (EXPLORADOR)
// =======================================================

// 1. Ruta usada por la búsqueda principal (?id=...)
app.get('/api/miembros-grupo', async (req, res) => {
    const groupId = req.query.id;
    if (!groupId) return res.status(400).json({ error: 'ID de grupo requerido' });

    console.log(`\n🕵️‍♂️ [DEBUG] Frontend pide los miembros del grupo: ${groupId}`);

    try {
        const miembros = await client.api(`/groups/${groupId}/members`)
            .top(999) 
            .get();

        console.log(`✅ [DEBUG] Graph API encontró ${miembros.value.length} miembros en este grupo.`);

        const resultado = miembros.value.map(m => ({
            ...m, 
            nombre: m.displayName || 'Usuario',
            correo: m.mail || m.userPrincipalName || 'Sin correo',
            cargo: m.jobTitle || 'Miembro',
            tipo: 'usuario'
        }));

        // CHIVATO: Imprime en consola el primer usuario
        if (resultado.length > 0) {
            console.log("🧐 [DEBUG] Muestra del primer usuario que se envía a Animaciones.js:");
            console.log(JSON.stringify(resultado[0], null, 2));
        } else {
            console.log("⚠️ [DEBUG] El grupo está vacío, no hay miembros que mostrar.");
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error("❌ [DEBUG] Error al obtener los miembros del grupo:", error.message);
        res.status(500).json({ error: 'Fallo al obtener los miembros.' });
    }
});

// 2. Ruta usada por el panel lateral de Miembros (/:id/miembros)
app.get('/api/grupos/:id/miembros', async (req, res) => {
    try {
        const groupId = req.params.id; 
        console.log(`\n🕵️‍♂️ [DEBUG] Frontend pide los miembros del grupo: ${groupId}`);
        
        const miembros = await client.api(`/groups/${groupId}/members`)
            .top(999) 
            .get();
            
            
        const resultado = miembros.value.map(m => ({
            ...m, 
            nombre: m.displayName || 'Usuario',
            correo: m.mail || m.userPrincipalName || 'Sin correo',
            cargo: m.jobTitle || 'Miembro',
            tipo: 'usuario'
        }));

        res.status(200).json(resultado);
    } catch (error) {
        console.error("❌ [DEBUG] Error fatal al obtener miembros:", error.message);
        res.status(500).json({ error: "Fallo al cargar los miembros del grupo." });
    }
});

// ── FUNCIÓN PARA AVISAR AL USUARIO AL TERMINAR EL LOTE ──
async function enviarNotificacionFin(destinatario, exitos, fallos, tiempo) {
    try {
        const client = Client.initWithMiddleware({ authProvider });
        const mensaje = {
            message: {
                subject: "✅ Tu envío masivo ha finalizado",
                body: {
                    contentType: "HTML",
                    content: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #0a7c15;">¡Tu entrega se ha completado!</h2>
                            <p>El envío de tu tarjeta adaptativa acaba de terminar en el servidor.</p>
                            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <strong>📊 Resumen del envío:</strong><br><br>
                                ✅ Entregas confirmadas: <b>${exitos}</b><br>
                                ❌ Errores irrecuperables: <b>${fallos}</b><br>
                                ⏱️ Tiempo total: <b>${tiempo} minutos</b>
                            </div>
                            <p>Puedes consultar el historial completo en Yako Broadcasting System.</p>
                        </div>
                    `
                },
                toRecipients: [{ emailAddress: { address: destinatario } }]
            }
        };
        // Usa la misma cuenta central que ya usas para enviar a Outlook
        await client.api(`/users/${process.env.EMAIL_USER}/sendMail`).post(mensaje);
        console.log(`📧 Notificación de fin enviada a ${destinatario}`);
    } catch (error) {
        console.error("Error al enviar la notificación de fin al usuario:", error);
    }
}

app.get('/api/estado-envio/:jobId', (req, res) => {
    const job = global.enviosActivos[req.params.jobId];
    if (!job) {
        return res.status(404).json({ error: "Envío no encontrado" });
    }
    res.json(job);
});

// ====================================================================
// ── ALMACÉN GLOBAL DE ENVÍOS EN SEGUNDO PLANO ──
// ====================================================================
global.enviosActivos = {};

// ── RUTA PARA CONSULTAR EL ESTADO DEL ENVÍO DESDE LA WEB ──
app.get('/api/estado-envio/:jobId', (req, res) => {
    const job = global.enviosActivos[req.params.jobId];
    if (!job) {
        return res.status(404).json({ error: "Envío no encontrado" });
    }
    res.json(job);
});

// ====================================================================
// 🚀 RUTA MAESTRA PARA ENVIAR POR TEAMS (GRUPOS E INDIVIDUALES)
// ====================================================================
app.post('/api/enviar-grupo-teams', async (req, res) => {
    try {
        const { tarjeta, destinatarios } = req.body;
        
        // ====================================================================
        // PANEL DE PRUEBAS
        // ====================================================================
        const MODO_SIMULACION = false; // true = No envía nada, solo muestra logs.
        const MODO_BOMBARDEO  = false;  // true = Envía tarjetas masivas al primer destinatario.
        const CANTIDAD_BOMBARDEO = 2000; // Número de tarjetas a enviar en modo bombardeo
        // ====================================================================
        
        if (!destinatarios) {
            return res.status(400).json({ error: "No hay destinatarios seleccionados." });
        }

        // 1. Transformamos el string
        const listaCorreos = typeof destinatarios === 'string' 
            ? destinatarios.split(',').map(e => e.trim()).filter(e => e !== "")
            : destinatarios;

        if (listaCorreos.length === 0) {
            return res.status(400).json({ error: "La lista de destinatarios está vacía." });
        }

        let targetUserIds = new Set(); 

        // 2. Fase de desglose de destinatarios
        for (const email of listaCorreos) {
            const groupSearch = await client.api(`/groups`)
                .filter(`mail eq '${email}'`)
                .select('id').get();

            if (groupSearch.value && groupSearch.value.length > 0) {
                const groupId = groupSearch.value[0].id;
                const members = await client.api(`/groups/${groupId}/members`).select('id').get();
                members.value.forEach(m => {
                    if (m['@odata.type'] === '#microsoft.graph.user') targetUserIds.add(m.id);
                });
                continue; 
            }

            const userSearch = await client.api(`/users`)
                .filter(`mail eq '${email}' or userPrincipalName eq '${email}'`)
                .select('id').get();

            if (userSearch.value && userSearch.value.length > 0) {
                targetUserIds.add(userSearch.value[0].id);
            }
        }

        // 3. Preparamos las referencias
        const referenciasValidas = [];
        for (const id of Object.keys(conversationReferences)) {
            const referencia = conversationReferences[id];
            if (referencia.user && referencia.user.aadObjectId && targetUserIds.has(referencia.user.aadObjectId)) {
                referenciasValidas.push(referencia);
            }
        }

        if (referenciasValidas.length === 0) {
            return res.status(404).json({ error: "Ninguno de los destinatarios tiene el bot instalado." });
        }

        if (MODO_BOMBARDEO) {
            const usuarioObjetivo = referenciasValidas[0]; 
            referenciasValidas.length = 0; 
            
            for (let i = 0; i < CANTIDAD_BOMBARDEO; i++) {
                referenciasValidas.push(usuarioObjetivo);
            }
            console.log(` MODO BOMBARDEO ACTIVO: Se generaron ${CANTIDAD_BOMBARDEO} envíos.`);
        }

        // 🌟 CREACIÓN DEL RASTREO (JOB ID) 🌟
        const jobId = "JOB_" + Date.now();
        global.enviosActivos[jobId] = {
            estado: "Enviando...",
            exitos: 0,
            fallos: 0,
            total: referenciasValidas.length,
            usuariosFallidos: []
        };

        // 4. RESPUESTA INMEDIATA AL FRONTEND CON EL JOBID
        if (MODO_SIMULACION) {
            res.status(202).json({ mensaje: `[SIMULACIÓN] Detectados ${targetUserIds.size} usuarios.`, jobId: jobId });
        } else if (MODO_BOMBARDEO) {
            res.status(202).json({ mensaje: `[MODO TEST] Enviando ${CANTIDAD_BOMBARDEO} tarjetas...`, jobId: jobId });
        } else {
            res.status(202).json({ mensaje: `Procesando envío masivo a ${referenciasValidas.length} usuarios.`, jobId: jobId });
        }

        // --- FUNCIÓN DE AUTO-REINTENTO INTELIGENTE ---
        const enviarConReintentos = async (referencia, tarjeta, maxIntentos = 5) => {
            if (MODO_BOMBARDEO) {
                const latenciaRed = Math.floor(Math.random() * 200) + 100;
                await new Promise(r => setTimeout(r, latenciaRed));
                if (Math.random() < 0.01) throw new Error("Simulación de error");
                return true;
            }

            for (let intento = 1; intento <= maxIntentos; intento++) {
                try {
                    await adapter.continueConversationAsync(process.env.CLIENT_ID, referencia, async (ctx) => {
                        await ctx.sendActivity({ 
                            attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: tarjeta }] 
                        });
                    });
                    return true;
                } catch (error) {
                    if (intento === maxIntentos) throw error; 
                    await new Promise(r => setTimeout(r, 2000 * intento));
                }
            }
        };

        // 5. PROCESO ASÍNCRONO EN SEGUNDO PLANO
        (async () => {
            try {
                const TAMANO_LOTE = 15;        
                const ESPERA_ENTRE_LOTES = 500; 

                let exitos = 0;
                let fallos = 0;

                const lotes = [];
                for (let i = 0; i < referenciasValidas.length; i += TAMANO_LOTE) {
                    lotes.push(referenciasValidas.slice(i, i + TAMANO_LOTE));
                }

                console.log(`\n🚀 INICIANDO ENTREGA TEAMS: ${referenciasValidas.length} tarjetas en ${lotes.length} lotes.`);
                const startTime = Date.now();

                for (let i = 0; i < lotes.length; i++) {
                    const loteActual = lotes[i];
                    
                    const promesasEnvio = loteActual.map(referencia => {
                        const nombreFallo = referencia.user ? referencia.user.name : "Usuario desconocido";
                        
                        if (MODO_SIMULACION) {
                            exitos++;
                            global.enviosActivos[jobId].exitos++; // Actualiza Tracker
                            return Promise.resolve();
                        }
                        
                        return enviarConReintentos(referencia, tarjeta)
                            .then(() => {
                                exitos++;
                                global.enviosActivos[jobId].exitos++; 
                            })
                            .catch((err) => {
                                fallos++;
                                global.enviosActivos[jobId].fallos++; 
                                // 🌟 AHORA GUARDAMOS EL NOMBRE Y EL MOTIVO DEL ERROR
                                global.enviosActivos[jobId].usuariosFallidos.push({
                                    usuario: nombreFallo,
                                    motivo: err.message || "Error desconocido o tiempo de espera agotado"
                                });
                            });
                    });

                    await Promise.all(promesasEnvio);
                    
                    const tiempoActual = Date.now();
                    const milisegundosTranscurridos = tiempoActual - startTime;
                    const velocidadPorLote = milisegundosTranscurridos / (i + 1);
                    const etaMilisegundos = velocidadPorLote * (lotes.length - (i + 1));
                    
                    process.stdout.write(`\rLote ${i + 1}/${lotes.length} |  Llevamos: ${(milisegundosTranscurridos / 1000).toFixed(1)}s | Faltan: ~${(etaMilisegundos / 1000).toFixed(1)}s para terminar...`);

                    if (i < lotes.length - 1) await new Promise(resolve => setTimeout(resolve, ESPERA_ENTRE_LOTES));
                }
                
                const minutosTranscurridos = ((Date.now() - startTime) / 60000).toFixed(2);

                console.log(`\n\nREPORTE FINAL DE ENVÍO TEAMS:\n✅ Entregas: ${exitos} | ❌ Fallos: ${fallos}\n`);
                
                // 🌟 EL RASTREADOR MARCA EL FIN 🌟
                global.enviosActivos[jobId].estado = "Completado";

                if (req.body.notificar && req.body.remitente) {
                    await enviarNotificacionFin(req.body.remitente, exitos, fallos, minutosTranscurridos);
                }

            } catch (errAsync) {
                console.error("\n❌ Error en el proceso de fondo de Teams:", errAsync);
                global.enviosActivos[jobId].estado = "Completado"; // Liberar el tracking en caso de fallo crítico
            }
        })();

    } catch (error) {
        console.error("Error al preparar envío a Teams:", error.message);
        if (!res.headersSent) res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// ====================================================================
// 📧 RUTA PARA ENVIAR POR OUTLOOK (AHORA EN SEGUNDO PLANO)
// ====================================================================
app.post('/api/enviar-outlook', async (req, res) => {
    const { destinatarios, asunto, tarjeta, notificar, remitente } = req.body;
    
    try {
        const listaCorreos = typeof destinatarios === 'string' 
            ? destinatarios.split(',').map(e => e.trim()).filter(e => e !== "")
            : destinatarios;

        if (!listaCorreos || listaCorreos.length === 0) {
            return res.status(400).json({ error: "No hay destinatarios válidos." });
        }

        // 🌟 CREACIÓN DEL RASTREO (JOB ID) 🌟
        const jobId = "JOB_" + Date.now();
        global.enviosActivos[jobId] = {
            estado: "Enviando...",
            exitos: 0,
            fallos: 0,
            total: listaCorreos.length,
            usuariosFallidos: []
        };

        // RESPUESTA INMEDIATA (No bloquea la página web)
        res.status(202).json({ mensaje: `Proceso de Outlook iniciado.`, jobId: jobId });

        // PROCESO EN SEGUNDO PLANO
        (async () => {
            try {
                // Función auxiliar si no la tenías definida globalmente
                const dividirEnLotes = (arr, tamano) => {
                    const l = [];
                    for (let i = 0; i < arr.length; i += tamano) l.push(arr.slice(i, i + tamano));
                    return l;
                };

                const lotes = dividirEnLotes(listaCorreos, 10);
                let enviadosCorrectamente = 0;
                let fallidos = 0;
                const startTime = Date.now();

                console.log(`Iniciando envío de ${listaCorreos.length} correos en ${lotes.length} lotes...`);

                for (const [index, lote] of lotes.entries()) {
                    console.log(`Procesando lote ${index + 1}/${lotes.length}...`);

                    const promesasLote = lote.map(async (email) => {
                        try {
                            await client.api(`/users/${process.env.EMAIL_USER}/sendMail`).post({
                                message: {
                                    subject: asunto,
                                    toRecipients: [{ emailAddress: { address: email } }],
                                    body: {
                                        contentType: 'html',
                                        content: `
                                            <html>
                                                <head>
                                                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                                                </head>
                                                <body>
                                                    <div id="adaptive-card-container">
                                                        <script type="application/adaptivecard+json">${JSON.stringify(tarjeta)}</script>
                                                        <p style="font-family: sans-serif; font-size: 12px; color: #666;">
                                                            Si no puedes ver la tarjeta interactiva, este mensaje requiere un cliente de correo compatible con Actionable Messages.
                                                        </p>
                                                    </div>
                                                </body>
                                            </html>
                                        `
                                    }
                                }
                            });
                            enviadosCorrectamente++;
                            global.enviosActivos[jobId].exitos++; // Actualiza Tracker
                        } catch (err) {
                            console.error(`Error enviando a ${email}:`, err.message);
                            fallidos++;
                            global.enviosActivos[jobId].fallos++; 
                            // 🌟 AHORA GUARDAMOS EL CORREO Y EL MOTIVO DEL ERROR
                            global.enviosActivos[jobId].usuariosFallidos.push({
                                usuario: email,
                                motivo: err.message || "Error desconocido"
                            });
                        }
                    });

                    await Promise.all(promesasLote);

                    // Pausa de cortesía entre lotes (1 segundo)
                    if (index < lotes.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                const minutosTranscurridos = ((Date.now() - startTime) / 60000).toFixed(2);
                
                // 🌟 EL RASTREADOR MARCA EL FIN 🌟
                global.enviosActivos[jobId].estado = "Completado";

                // Enviar correo de notificación si el usuario lo pidió
                if (notificar && remitente) {
                    await enviarNotificacionFin(remitente, enviadosCorrectamente, fallidos, minutosTranscurridos);
                }

            } catch (errAsync) {
                console.error("Error crítico en proceso de fondo Outlook:", errAsync);
                global.enviosActivos[jobId].estado = "Completado"; // Liberar el tracking
            }
        })();

    } catch (error) {
        console.error("Error crítico en /api/enviar-outlook:", error);
        if (!res.headersSent) res.status(500).json({ error: 'Error interno al procesar el envío.' });
    }
});

// --- Iniciacion ---
app.listen(3000, () => {
    console.log('🚀 Servidor activo en puerto 3000');
});
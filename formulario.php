<?php
// ═══════════════════════════════════════════════════════════
//  Yako Card Builder — formulario.php
//  Recibe el formulario del navegador y llama al server.js
//  que es quien habla con Azure / Microsoft Graph
// ═══════════════════════════════════════════════════════════

// Puerto donde escucha server.js (debe coincidir con PORT en .env, por defecto 3000)
define('NODE_URL', 'http://localhost:3000');

header('Content-Type: application/json; charset=UTF-8');

// ── 1. Recoger datos ──────────────────────────
$imagen         = trim($_POST['imagen']         ?? '');
$titulo         = trim($_POST['titulo']         ?? '');
$subtitulo      = trim($_POST['subtitulo']      ?? '');
$bloques        = json_decode($_POST['bloques'] ?? '[]', true) ?: [];
$canal          = trim($_POST['canal']          ?? '');
$emails         = trim($_POST['emails']         ?? '');
$teamsRecipient = trim($_POST['teamsRecipient'] ?? '');

if (empty($titulo) || empty($canal)) {
    echo json_encode(['ok' => false, 'mensaje' => 'El título y el canal son obligatorios.']);
    exit;
}

// ── 2. Construir Adaptive Card ────────────────
$body = [];

if (!empty($imagen)) {
    $body[] = ['type' => 'Image', 'url' => $imagen, 'size' => 'Stretch'];
}

$body[] = [
    'type'   => 'TextBlock',
    'text'   => $titulo,
    'weight' => 'Bolder',
    'size'   => 'Medium',
    'wrap'   => true,
];

if (!empty($subtitulo)) {
    $body[] = ['type' => 'TextBlock', 'text' => $subtitulo, 'isSubtle' => true, 'wrap' => true];
}

foreach ($bloques as $bloque) {
    $tipo  = $bloque['tipo']  ?? '';
    $texto = strip_tags($bloque['html'] ?? $bloque['text'] ?? '');
    $url   = $bloque['value'] ?? '';

    if ($tipo === 'parrafo' && $texto !== '') {
        $body[] = ['type' => 'TextBlock', 'text' => $texto, 'wrap' => true];
    } elseif ($tipo === 'titulo' && $texto !== '') {
        $body[] = ['type' => 'TextBlock', 'text' => $texto, 'weight' => 'Bolder', 'wrap' => true];
    } elseif ($tipo === 'imagen' && $url !== '') {
        $body[] = ['type' => 'Image', 'url' => $url, 'size' => 'Stretch'];
    }
}

$adaptiveCard = [
    '$schema' => 'http://adaptivecards.io/schemas/adaptive-card.json',
    'type'    => 'AdaptiveCard',
    'version' => '1.5',
    'body'    => $body,
];

// ── 3. Helper: llamar al server.js ────────────
function llamarNode(string $ruta, array $datos): array {
    $ch = curl_init(NODE_URL . $ruta);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($datos, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 300,
    ]);

    $respuesta = curl_exec($ch);
    $errCurl   = curl_error($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($errCurl) {
        return [
            'ok'      => false,
            'mensaje' => 'No se pudo conectar con el servidor Node.js. Asegurate de que esta arrancado con "node server.js". Error: ' . $errCurl,
        ];
    }

    $json = json_decode($respuesta, true);
    return $json ?? ['ok' => false, 'mensaje' => 'Respuesta inesperada del servidor (HTTP ' . $httpCode . ').'];
}

// ── 4. Enrutar segun canal ────────────────────

if ($canal === 'teams') {

    // teamsRecipient puede ser: email, varios separados por , o ;, o vacio
    // Si esta vacio, server.js usara TEAM_ID + CHANNEL_ID del .env
    $destinatarios = [];
    if ($teamsRecipient !== '') {
        $destinatarios = array_values(array_filter(
            array_map('trim', preg_split('/[;,]/', $teamsRecipient))
        ));
    }

    $resultado = llamarNode('/api/enviar-teams', [
        'destinatarios' => $destinatarios,
        'tarjeta'       => $adaptiveCard,
    ]);

    echo json_encode($resultado);

} elseif ($canal === 'outlook') {

    if ($emails === '') {
        echo json_encode(['ok' => false, 'mensaje' => 'Introduce al menos un destinatario de correo.']);
        exit;
    }

    $htmlBlocks = '';
    foreach ($body as $bloque) {
        if (($bloque['type'] ?? '') === 'TextBlock') {
            $negrita = ($bloque['weight'] ?? '') === 'Bolder' ? 'bold' : 'normal';
            $sutil   = !empty($bloque['isSubtle']) ? 'color:#666;font-size:13px;' : '';
            $htmlBlocks .= '<p style="font-weight:' . $negrita . ';' . $sutil . 'margin:6px 0">'
                            . htmlspecialchars($bloque['text']) . '</p>';
        } elseif (($bloque['type'] ?? '') === 'Image') {
            $htmlBlocks .= '<img src="' . htmlspecialchars($bloque['url'])
                            . '" style="max-width:100%;display:block;margin:10px 0" alt="">';
        }
    }

    $htmlCorreo = "<html><body style=\"font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px\">"
                . "<div style=\"border:1px solid #e0e0e0;border-radius:8px;padding:24px;background:#fff\">"
                . $htmlBlocks
                . "</div>"
                . "<p style=\"font-size:11px;color:#aaa;text-align:center;margin-top:14px\">Enviado con Yako Card Builder</p>"
                . "</body></html>";

    $destinatarios = array_values(array_filter(
        array_map('trim', preg_split('/[;,]/', $emails))
    ));

    $resultado = llamarNode('/api/enviar-outlook', [
        'destinatarios' => $destinatarios,
        'asunto'        => $titulo,
        'htmlBody'      => $htmlCorreo,
    ]);

    echo json_encode($resultado);

} else {
    // Sin canal valido: devolver la card en JSON (para depuracion)
    echo json_encode($adaptiveCard, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?>
<?php
// Recoger datos del formulario
$imagen    = $_POST['imagen']    ?? '';
$titulo    = $_POST['titulo']    ?? '';
$subtitulo = $_POST['subtitulo'] ?? '';
$bloques   = json_decode($_POST['bloques'] ?? '[]', true) ?: [];
$canal     = $_POST['canal']     ?? '';
$emails    = $_POST['emails']    ?? '';

// Validación básica
if (empty($titulo) || empty($canal)) {
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'mensaje' => 'El título y el canal son obligatorios.']);
    exit;
}

// Construir cuerpo de la tarjeta
$body = [];

// Imagen si existe
if (!empty($imagen)) {
    $body[] = [
        "type" => "Image",
        "url"  => $imagen,
        "size" => "Stretch"
    ];
}

// Título
$body[] = [
    "type"   => "TextBlock",
    "text"   => $titulo,
    "weight" => "Bolder",
    "size"   => "Medium",
    "wrap"   => true
];

// Subtítulo si existe
if (!empty($subtitulo)) {
    $body[] = [
        "type"     => "TextBlock",
        "text"     => $subtitulo,
        "isSubtle" => true,
        "wrap"     => true
    ];
}

// Bloques de contenido dinámicos (párrafos, títulos e imágenes del editor)
foreach ($bloques as $bloque) {
    $tipoBLoque   = $bloque['tipo']  ?? '';
    $textoBloque  = strip_tags($bloque['html'] ?? $bloque['text'] ?? '');
    $urlBloque    = $bloque['value'] ?? '';

    if ($tipoBLoque === 'parrafo' && !empty($textoBloque)) {
        $body[] = [
            "type" => "TextBlock",
            "text" => $textoBloque,
            "wrap" => true
        ];
    } elseif ($tipoBLoque === 'titulo' && !empty($textoBloque)) {
        $body[] = [
            "type"   => "TextBlock",
            "text"   => $textoBloque,
            "weight" => "Bolder",
            "wrap"   => true
        ];
    } elseif ($tipoBLoque === 'imagen' && !empty($urlBloque)) {
        $body[] = [
            "type" => "Image",
            "url"  => $urlBloque,
            "size" => "Stretch"
        ];
    }
}

// Construcción completa de la Adaptive Card
$adaptiveCard = [
    "\$schema" => "http://adaptivecards.io/schemas/adaptive-card.json",
    "type"     => "AdaptiveCard",
    "version"  => "1.5",
    "body"     => $body
];

// Convertir a JSON
$jsonCard = json_encode($adaptiveCard, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

// Enviar según canal
if ($canal === 'teams') {

    $webhookUrl = 'https://outlook.office.com/webhook/TU_WEBHOOK_AQUI';

    // Teams requiere este formato de payload para recibir Adaptive Cards
    $payloadTeams = json_encode([
        "type"        => "message",
        "attachments" => [[
            "contentType" => "application/vnd.microsoft.card.adaptive",
            "contentUrl"  => null,
            "content"     => $adaptiveCard
        ]]
    ], JSON_UNESCAPED_UNICODE);

    // Enviar al webhook via cURL
    $curl = curl_init($webhookUrl);
    curl_setopt($curl, CURLOPT_POST,           true);
    curl_setopt($curl, CURLOPT_POSTFIELDS,     $payloadTeams);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER,     ['Content-Type: application/json']);
    $respuestaTeams  = curl_exec($curl);
    $httpStatusTeams = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    // Teams devuelve "1" y HTTP 200 cuando el envío es correcto
    $enviado = ($httpStatusTeams === 200 && trim($respuestaTeams) === '1');
    header('Content-Type: application/json');
    echo json_encode(['ok' => $enviado, 'mensaje' => $enviado ? '¡Tarjeta enviada a Teams!' : 'Error al enviar a Teams.']);

} elseif ($canal === 'outlook') {

    // Separar y limpiar los emails (admite coma o punto y coma como separador)
    $listaEmails  = implode(', ', array_filter(array_map('trim', preg_split('/[;,]/', $emails))));
    $asunto       = $titulo;
    $cuerpoCorreo = "<html><body><script type=\"application/adaptivecard+json\">{$jsonCard}</script><p>{$titulo}</p></body></html>";
    $cabeceras    = "From: noreply@tuempresa.com\r\nContent-Type: text/html; charset=UTF-8";

    $enviado = mail($listaEmails, $asunto, $cuerpoCorreo, $cabeceras);
    header('Content-Type: application/json');
    echo json_encode(['ok' => $enviado, 'mensaje' => $enviado ? '¡Correo enviado!' : 'Error al enviar el correo.']);

} else {

    // Fallback: devolver el JSON de la tarjeta (para pruebas)
    header('Content-Type: application/json');
    echo $jsonCard;

}
?>
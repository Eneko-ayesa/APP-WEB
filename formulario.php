<?php
// Recoger datos del formulario
$imagen     = $_POST['imagen'] ?? '';
$titulo     = $_POST['titulo'] ?? '';
$subtitulo  = $_POST['subtitulo'] ?? '';
$contenido  = $_POST['contenido'] ?? '';
$canal      = $_POST['canal'] ?? '';
$emails     = $_POST['emails'] ?? '';

// Construir cuerpo de la tarjeta
$body = [];

// Imagen si existe
if (!empty($imagen)) {
    $body[] = [
        "type" => "Image",
        "url" => $imagen,
        "size" => "Stretch"
    ];
}

// Título
$body[] = [
    "type" => "TextBlock",
    "text" => $titulo,
    "weight" => "Bolder",
    "size" => "Medium"
];

// Subtítulo si existe
if (!empty($subtitulo)) {
    $body[] = [
        "type" => "TextBlock",
        "text" => $subtitulo,
        "isSubtle" => true,
        "wrap" => true
    ];
}

// Contenido
$body[] = [
    "type" => "TextBlock",
    "text" => $contenido,
    "wrap" => true
];

// Construcción completa de la Adaptive Card
$adaptiveCard = [
    "\$schema" => "http://adaptivecards.io/schemas/adaptive-card.json",
    "type" => "AdaptiveCard",
    "version" => "1.5",
    "body" => $body
];

// Convertir a JSON
$jsonCard = json_encode($adaptiveCard, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

// Mostrar el JSON (para pruebas)
header('Content-Type: application/json');
echo $jsonCard;

?>
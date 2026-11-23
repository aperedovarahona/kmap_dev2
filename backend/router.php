<?php
/**
 * Built-in PHP Development Server Router
 * php -S 0.0.0.0:4000 backend/router.php
 */
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Servir archivos estáticos de /uploads directamente
if (strpos($uri, '/uploads/') === 0) {
    $filePath = __DIR__ . $uri;
    if (file_exists($filePath) && !is_dir($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimes = [
            'pdf' => 'application/pdf',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt' => 'text/plain',
            'json' => 'application/json'
        ];
        $contentType = isset($mimes[$ext]) ? $mimes[$ext] : 'application/octet-stream';
        header("Content-Type: {$contentType}");
        header('Access-Control-Allow-Origin: *');
        readfile($filePath);
        exit;
    }
}

// Redirigir el resto al punto de entrada CodeIgniter
require __DIR__ . '/index.php';

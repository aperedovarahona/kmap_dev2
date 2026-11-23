<?php
/**
 * CodeIgniter 3 Application Bootstrap & Dispatcher
 */
defined('BASEPATH') OR exit('No direct script access allowed');

// Manejar CORS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Length: 0');
    http_response_code(200);
    exit;
}

// Cargar clases base del núcleo
require_once BASEPATH . 'core/Controller.php';
require_once BASEPATH . 'core/Model.php';
require_once BASEPATH . 'core/Input.php';
require_once BASEPATH . 'core/Output.php';
require_once BASEPATH . 'core/Loader.php';

// Obtener URI limpia
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');

// Eliminar prefijo de subcarpeta si existe (ej. kmap_dev2/backend o api)
$script_name = trim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
if ($script_name && strpos($uri, $script_name) === 0) {
    $uri = trim(substr($uri, strlen($script_name)), '/');
}

// Resolver Controller, Método y Parámetros
$controller = 'Health';
$method = 'index';
$params = [];

// Tabla de enrutamiento RESTful para el Backend Plan Kmap
$routes = [
    // Health & Root
    '' => ['Health', 'index'],
    'api' => ['Health', 'index'],
    'api/health' => ['Health', 'index'],

    // Auth
    'api/auth/login' => ['Auth', 'login'],
    'api/auth/register/student' => ['Auth', 'register_student'],
    'api/auth/me' => ['Auth', 'me'],
    'api/auth/change-password' => ['Auth', 'change_password'],
    'api/auth/changepassword' => ['Auth', 'change_password'],

    // Admin
    'api/admin/teachers' => ['Admin', 'teachers'],
    'api/admin/subjects' => ['Admin', 'subjects'],
    'api/admin/assignments' => ['Admin', 'assignments'],

    // Teacher
    'api/teacher/subjects' => ['Teacher', 'subjects'],

    // Student
    'api/student/enroll' => ['Student', 'enroll'],
    'api/student/subjects' => ['Student', 'subjects'],

    // Kmap sync, IA y uploads
    'api/kmap/state' => ['Kmap', 'state'],
    'api/kmap/sync' => ['Kmap', 'sync'],
    'api/kmap/generate-ai' => ['Kmap', 'generate_ai'],
    'api/kmap/recommend' => ['Kmap', 'recommend'],
    'api/kmap/upload' => ['Kmap', 'upload'],
];

if (isset($routes[$uri])) {
    list($controller, $method) = $routes[$uri];
} else {
    // Rutas dinámicas con parámetros regex
    if (preg_match('#^api/admin/subjects/([a-zA-Z0-9_\-]+)$#', $uri, $m)) {
        $controller = 'Admin';
        $method = 'subject_detail';
        $params = [$m[1]];
    } elseif (preg_match('#^api/admin/assignments/([a-zA-Z0-9_\-]+)$#', $uri, $m)) {
        $controller = 'Admin';
        $method = 'assignment_detail';
        $params = [$m[1]];
    } elseif (preg_match('#^api/teacher/subjects/([a-zA-Z0-9_\-]+)/enrollment-code$#', $uri, $m)) {
        $controller = 'Teacher';
        $method = 'enrollment_code';
        $params = [$m[1]];
    } elseif (preg_match('#^api/subjects/([a-zA-Z0-9_\-]+)/graph$#', $uri, $m)) {
        $controller = 'Subjects';
        $method = 'graph';
        $params = [$m[1]];
    } elseif (preg_match('#^api/subjects/([a-zA-Z0-9_\-]+)/heatmap$#', $uri, $m)) {
        $controller = 'Subjects';
        $method = 'heatmap';
        $params = [$m[1]];
    } elseif (preg_match('#^api/nodes/([a-zA-Z0-9_\-]+)/materials$#', $uri, $m)) {
        $controller = 'Nodes';
        $method = 'materials';
        $params = [$m[1]];
    } elseif (preg_match('#^api/nodes/([a-zA-Z0-9_\-]+)/quizzes$#', $uri, $m)) {
        $controller = 'Nodes';
        $method = 'quizzes';
        $params = [$m[1]];
    } elseif (preg_match('#^api/nodes/([a-zA-Z0-9_\-]+)/quiz/generate-?ai$#', $uri, $m)) {
        $controller = 'Nodes';
        $method = 'generate_ai';
        $params = [$m[1]];
    } elseif (preg_match('#^api/nodes/([a-zA-Z0-9_\-]+)$#', $uri, $m)) {
        $controller = 'Nodes';
        $method = 'detail';
        $params = [$m[1]];
    } elseif (preg_match('#^api/materials/([a-zA-Z0-9_\-]+)$#', $uri, $m)) {
        $controller = 'Materials';
        $method = 'detail';
        $params = [$m[1]];
    } elseif (preg_match('#^api/quizzes/([a-zA-Z0-9_\-]+)/submit$#', $uri, $m)) {
        $controller = 'Quizzes';
        $method = 'submit';
        $params = [$m[1]];
    } elseif (preg_match('#^api/quizzes/([a-zA-Z0-9_\-]+)$#', $uri, $m)) {
        $controller = 'Quizzes';
        $method = 'detail';
        $params = [$m[1]];
    } else {
        // Enrutador estándar CI3: controller/method/param1/...
        $segments = explode('/', $uri);
        if ($segments[0] === 'api' && isset($segments[1])) {
            array_shift($segments);
        }
        if (!empty($segments[0])) {
            $controller = ucfirst($segments[0]);
        }
        if (!empty($segments[1])) {
            $method = $segments[1];
        }
        if (count($segments) > 2) {
            $params = array_slice($segments, 2);
        }
    }
}

// Cargar el archivo del controlador
$controller_file = APPPATH . 'controllers/' . $controller . '.php';
if (!file_exists($controller_file)) {
    // Si no existe, responder 404 JSON
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(404);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'NOT_FOUND',
            'message' => "Ruta o controlador '{$controller}' no encontrado en la API."
        ]
    ]);
    exit;
}

require_once $controller_file;
if (!class_exists($controller)) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => "Clase controladora '{$controller}' no definida."]);
    exit;
}

$CI = new $controller();

// Verificar si el método existe
if (!method_exists($CI, $method)) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(404);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'METHOD_NOT_FOUND',
            'message' => "Método '{$method}' no disponible en el controlador '{$controller}'."
        ]
    ]);
    exit;
}

// Ejecutar método del controlador con los parámetros
try {
    call_user_func_array([$CI, $method], $params);
    $CI->output->_display();
} catch (Exception $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'INTERNAL_ERROR',
            'message' => $e->getMessage()
        ]
    ]);
}

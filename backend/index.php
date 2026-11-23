<?php
/**
 * CodeIgniter 3 Entry Point
 */
define('ENVIRONMENT', isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : 'development');

switch (ENVIRONMENT) {
    case 'development':
        error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
        ini_set('display_errors', 0);
        break;
    case 'testing':
    case 'production':
        ini_set('display_errors', 0);
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_USER_NOTICE & ~E_USER_DEPRECATED);
        break;
    default:
        header('HTTP/1.1 503 Service Unavailable.', TRUE, 503);
        echo 'El entorno de la aplicación no está configurado correctamente.';
        exit(1);
}

$system_path = 'system';
$application_folder = 'application';

define('BASEPATH', str_replace('\\', '/', realpath(__DIR__ . '/' . $system_path)) . '/');
define('APPPATH', str_replace('\\', '/', realpath(__DIR__ . '/' . $application_folder)) . '/');
define('VIEWPATH', APPPATH . 'views/');

require_once BASEPATH . 'core/CodeIgniter.php';

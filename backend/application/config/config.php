<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$config['base_url'] = 'http://localhost:4000/';
$config['index_page'] = '';
$config['charset'] = 'UTF-8';
$config['upload_path'] = str_replace('\\', '/', realpath(__DIR__ . '/../../uploads')) . '/';
$config['data_path'] = str_replace('\\', '/', realpath(__DIR__ . '/../../data')) . '/';
$config['jwt_secret'] = 'kmap_secret_jwt_key_2026_super_secure';
$config['jwt_expire'] = 86400; // 24 horas

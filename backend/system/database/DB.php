<?php
/**
 * CodeIgniter 3 Database Factory
 */
defined('BASEPATH') OR exit('No direct script access allowed');

require_once BASEPATH . 'database/DB_query_builder.php';

function &DB($params = '', $query_builder_override = NULL) {
    if (file_exists(APPPATH . 'config/database.php')) {
        include APPPATH . 'config/database.php';
    }

    $group = 'default';
    $config = isset($db[$group]) ? $db[$group] : [
        'hostname' => 'localhost',
        'username' => 'root',
        'password' => '',
        'database' => 'kmap',
        'dbdriver' => 'mysqli',
        'dbprefix' => '',
        'char_set' => 'utf8mb4',
        'dbcollat' => 'utf8mb4_unicode_ci'
    ];

    $db_obj = new CI_DB_query_builder($config);
    return $db_obj;
}

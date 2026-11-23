<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Health extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Usuario_model');
        $this->load->model('Materia_model');
    }

    public function index() {
        $db_connected = $this->db->is_connected();
        $db_status = $db_connected ? 'connected' : 'connecting';

        $data = [
            'ok' => true,
            'service' => 'plan-kmap-backend-ci3',
            'engine' => 'PHP ' . PHP_VERSION . ' (CodeIgniter 3 MVC)',
            'database' => $db_status,
            'environment' => ENVIRONMENT,
            'modes' => [
                'email' => 'console',
                'storage' => 'local',
                'ai' => 'gemini'
            ],
            'tablesInfo' => [
                'usersCount' => 13,
                'subjectsCount' => 3,
                'nodesCount' => 15,
                'quizzesCount' => 5
            ],
            'timestamp' => date('c')
        ];

        return $this->output
            ->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
}

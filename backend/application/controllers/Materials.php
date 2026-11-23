<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Materials extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Tema_model');
    }

    public function detail($materialId) {
        $method = $this->input->method(TRUE);

        if ($method === 'DELETE') {
            $this->Tema_model->delete_material($materialId);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'message' => 'Material eliminado correctamente.']));
        }
    }
}

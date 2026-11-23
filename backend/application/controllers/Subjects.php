<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Subjects extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Tema_model');
        $this->load->model('Evaluacion_model');
    }

    public function graph($subjectId) {
        $method = $this->input->method(TRUE);

        if ($method === 'GET') {
            $graph = $this->Tema_model->get_graph($subjectId);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => true,
                    'graph' => $graph,
                    'nodes' => $graph['nodes'],
                    'edges' => $graph['edges']
                ], JSON_UNESCAPED_UNICODE));
        }

        if ($method === 'PUT') {
            $input = $this->input->post_or_json();
            $nodes = isset($input['nodes']) ? $input['nodes'] : [];
            $edges = isset($input['edges']) ? $input['edges'] : [];

            $res = $this->Tema_model->save_graph($subjectId, $nodes, $edges);
            $status = !empty($res['ok']) ? 200 : 400;

            return $this->output
                ->set_status_header($status)
                ->set_content_type('application/json')
                ->set_output(json_encode($res, JSON_UNESCAPED_UNICODE));
        }
    }

    public function heatmap($subjectId) {
        $data = $this->Evaluacion_model->get_heatmap($subjectId);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'heatmap' => $data], JSON_UNESCAPED_UNICODE));
    }
}

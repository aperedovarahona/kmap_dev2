<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Nodes extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Tema_model');
        $this->load->model('Quiz_model');
        $this->load->library('Gemini_ai');
    }

    public function detail($nodeId) {
        $method = $this->input->method(TRUE);

        if ($method === 'GET') {
            $detail = $this->Tema_model->get_node_detail($nodeId);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'node' => $detail], JSON_UNESCAPED_UNICODE));
        }

        if ($method === 'PATCH' || $method === 'PUT') {
            $input = $this->input->post_or_json();
            $updated = $this->Tema_model->update_node($nodeId, $input);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'node' => $updated], JSON_UNESCAPED_UNICODE));
        }
    }

    public function materials($nodeId) {
        $method = $this->input->method(TRUE);

        if ($method === 'POST') {
            // Verificar si viene archivo subido multipart
            $uploaded_url = '';
            $title = '';

            if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['file'];
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = 'mat_' . time() . '_' . rand(100, 999) . '.' . $ext;
                $dest = APPPATH . '../../backend/uploads/' . $filename;
                @move_uploaded_file($file['tmp_name'], $dest);
                $uploaded_url = '/uploads/' . $filename;
                $title = $file['name'];
            } else {
                $input = $this->input->post_or_json();
                $uploaded_url = isset($input['url']) ? $input['url'] : (isset($input['enlace_para_descargar']) ? $input['enlace_para_descargar'] : '');
                $title = isset($input['title']) ? $input['title'] : (isset($input['titulo_del_material']) ? $input['titulo_del_material'] : 'Material');
            }

            $mat = $this->Tema_model->add_material([
                'id_tema' => $nodeId,
                'titulo_del_material' => $title,
                'enlace_para_descargar' => $uploaded_url
            ]);

            return $this->output
                ->set_status_header(201)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'material' => $mat, 'url' => $uploaded_url], JSON_UNESCAPED_UNICODE));
        }
    }

    public function quizzes($nodeId) {
        $method = $this->input->method(TRUE);

        if ($method === 'GET') {
            $quizzes = $this->Quiz_model->list_by_node($nodeId);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'quizzes' => $quizzes], JSON_UNESCAPED_UNICODE));
        }

        if ($method === 'POST') {
            $input = $this->input->post_or_json();
            $quiz = $this->Quiz_model->create_quiz(array_merge($input, ['id_tema' => $nodeId]));
            return $this->output
                ->set_status_header(201)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'quiz' => $quiz], JSON_UNESCAPED_UNICODE));
        }
    }

    public function generate_ai($nodeId) {
        $node = $this->Tema_model->get_node_detail($nodeId);
        $topic_name = $node ? $node['nombre_del_tema'] : 'Tema ' . $nodeId;

        $questions = $this->gemini_ai->generate_questions($topic_name, 5);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'ok' => true,
                'topic' => $topic_name,
                'questions' => $questions
            ], JSON_UNESCAPED_UNICODE));
    }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kmap extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Kmap_model');
        $this->load->library('Gemini_ai');
    }

    public function state() {
        $state = $this->Kmap_model->get_state();
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'state' => $state], JSON_UNESCAPED_UNICODE));
    }

    public function sync() {
        $input = $this->input->post_or_json();
        $saved = $this->Kmap_model->sync_state($input);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'state' => $saved], JSON_UNESCAPED_UNICODE));
    }

    public function generate_ai() {
        $input = $this->input->post_or_json();
        $topic_name = isset($input['name']) ? $input['name'] : (isset($input['topicName']) ? $input['topicName'] : 'Tema General');
        $count = isset($input['count']) ? (int) $input['count'] : 5;
        $materials = isset($input['materials']) ? json_encode($input['materials'], JSON_UNESCAPED_UNICODE) : '';

        $questions = $this->gemini_ai->generate_questions($topic_name, $count, $materials);

        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'questions' => $questions], JSON_UNESCAPED_UNICODE));
    }

    public function recommend() {
        $input = $this->input->post_or_json();
        $rec = $this->Kmap_model->generate_recommendation($input);

        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'recommendation' => $rec], JSON_UNESCAPED_UNICODE));
    }

    public function upload() {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            return $this->output
                ->set_status_header(400)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => false, 'message' => 'No se recibió ningún archivo válido.']));
        }

        $file = $_FILES['file'];
        $upload_dir = APPPATH . '../../backend/uploads/';
        if (!is_dir($upload_dir)) {
            @mkdir($upload_dir, 0777, true);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safe_name = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
        $filename = time() . '_' . $safe_name . ($ext ? '.' . $ext : '');
        $target = $upload_dir . $filename;

        if (move_uploaded_file($file['tmp_name'], $target)) {
            $url = '/uploads/' . $filename;
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => true,
                    'url' => $url,
                    'title' => $file['name'],
                    'filename' => $filename
                ], JSON_UNESCAPED_UNICODE));
        }

        return $this->output
            ->set_status_header(500)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => false, 'message' => 'Error al mover el archivo subido en el servidor.']));
    }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Quizzes extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Quiz_model');
        $this->load->model('Evaluacion_model');
        $this->load->library('Jwt_lib');
    }

    public function detail($quizId) {
        $method = $this->input->method(TRUE);

        if ($method === 'GET') {
            $quiz = $this->Quiz_model->get_quiz_for_taking($quizId);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'quiz' => $quiz], JSON_UNESCAPED_UNICODE));
        }

        if ($method === 'PUT') {
            $input = $this->input->post_or_json();
            $res = $this->Quiz_model->update_quiz($quizId, $input);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'quiz' => $res]));
        }

        if ($method === 'DELETE') {
            $this->Quiz_model->delete_quiz($quizId);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'message' => 'Quiz eliminado exitosamente.']));
        }
    }

    public function submit($quizId) {
        $token = $this->input->bearer_token();
        $payload = $this->jwt_lib->verify($token);
        $student_id = $payload ? $payload['sub'] : 3;

        $input = $this->input->post_or_json();
        $res = $this->Evaluacion_model->submit_quiz($quizId, $student_id, $input);

        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(array_merge(['ok' => true], $res), JSON_UNESCAPED_UNICODE));
    }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Student extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Materia_model');
        $this->load->library('Jwt_lib');
    }

    public function enroll() {
        $token = $this->input->bearer_token();
        $payload = $this->jwt_lib->verify($token);
        $student_id = $payload ? $payload['sub'] : 3;

        $input = $this->input->post_or_json();
        $code = isset($input['code']) ? $input['code'] : (isset($input['codigo_matriculacion']) ? $input['codigo_matriculacion'] : '');

        $result = $this->Materia_model->enroll_student($student_id, $code);
        $status = $result['ok'] ? 200 : 404;

        return $this->output
            ->set_status_header($status)
            ->set_content_type('application/json')
            ->set_output(json_encode($result, JSON_UNESCAPED_UNICODE));
    }

    public function subjects() {
        $token = $this->input->bearer_token();
        $payload = $this->jwt_lib->verify($token);
        $student_id = $payload ? $payload['sub'] : 3;

        $subjects = $this->Materia_model->list_by_student($student_id);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'subjects' => $subjects], JSON_UNESCAPED_UNICODE));
    }
}

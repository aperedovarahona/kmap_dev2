<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Teacher extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Materia_model');
        $this->load->library('Jwt_lib');
    }

    public function subjects() {
        $token = $this->input->bearer_token();
        $payload = $this->jwt_lib->verify($token);
        $teacher_id = $payload ? $payload['sub'] : 2;

        $subjects = $this->Materia_model->list_by_teacher($teacher_id);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'subjects' => $subjects], JSON_UNESCAPED_UNICODE));
    }

    public function enrollment_code($subjectId) {
        $new_code = $this->Materia_model->regenerate_code($subjectId);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'ok' => true,
                'enrollmentCode' => $new_code,
                'code' => $new_code
            ]));
    }
}

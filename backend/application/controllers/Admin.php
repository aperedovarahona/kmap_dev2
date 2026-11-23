<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Usuario_model');
        $this->load->model('Materia_model');
    }

    public function teachers() {
        $method = $this->input->method(TRUE);

        if ($method === 'GET') {
            $teachers = $this->Usuario_model->list_teachers();
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'teachers' => $teachers], JSON_UNESCAPED_UNICODE));
        }

        if ($method === 'POST') {
            $input = $this->input->post_or_json();
            $teacher = $this->Usuario_model->create_teacher($input);
            return $this->output
                ->set_status_header(201)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => true,
                    'message' => 'Docente creado exitosamente y credenciales generadas.',
                    'teacher' => $teacher
                ], JSON_UNESCAPED_UNICODE));
        }
    }

    public function subjects() {
        $method = $this->input->method(TRUE);

        if ($method === 'GET') {
            $subjects = $this->Materia_model->list_all();
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'subjects' => $subjects], JSON_UNESCAPED_UNICODE));
        }

        if ($method === 'POST') {
            $input = $this->input->post_or_json();
            $subject = $this->Materia_model->create($input);
            return $this->output
                ->set_status_header(201)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => true,
                    'message' => 'Materia creada exitosamente.',
                    'subject' => $subject
                ], JSON_UNESCAPED_UNICODE));
        }
    }

    public function subject_detail($id) {
        $method = $this->input->method(TRUE);

        if ($method === 'PUT') {
            $input = $this->input->post_or_json();
            $updated = $this->Materia_model->update_subject($id, $input);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'subject' => $updated], JSON_UNESCAPED_UNICODE));
        }

        if ($method === 'DELETE') {
            $this->Materia_model->delete_subject($id);
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'message' => 'Materia eliminada correctamente.']));
        }
    }

    public function assignments() {
        $input = $this->input->post_or_json();
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'ok' => true,
                'message' => 'Materias asignadas al docente correctamente.'
            ]));
    }

    public function assignment_detail($id) {
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'ok' => true,
                'message' => 'Asignación removida correctamente.'
            ]));
    }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Usuario_model');
        $this->load->library('Jwt_lib');
    }

    public function login() {
        $input = $this->input->post_or_json();
        $identifier = isset($input['identifier']) ? $input['identifier'] : (isset($input['email']) ? $input['email'] : (isset($input['sisCode']) ? $input['sisCode'] : ''));
        $password = isset($input['password']) ? $input['password'] : '';

        if (empty($identifier) || empty($password)) {
            return $this->output
                ->set_status_header(400)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => false,
                    'message' => 'Debes enviar tu identificador (correo o código SIS) y contraseña.'
                ]));
        }

        $user = $this->Usuario_model->get_by_identifier($identifier);
        if (!$user || !$this->Usuario_model->verify_password($password, $user)) {
            return $this->output
                ->set_status_header(401)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => false,
                    'message' => 'Credenciales inválidas. Verifica tu usuario y contraseña.'
                ]));
        }

        $token = $this->jwt_lib->sign([
            'sub' => $user['id_usuario'],
            'role' => $user['role'],
            'email' => $user['correo_electronico'],
            'sisCode' => $user['codigo_sis'],
            'mustChangePassword' => $user['mustChangePassword']
        ]);

        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'ok' => true,
                'token' => $token,
                'user' => $user,
                'mustChangePassword' => $user['mustChangePassword']
            ], JSON_UNESCAPED_UNICODE));
    }

    public function register_student() {
        $input = $this->input->post_or_json();
        $name = isset($input['nombre_completo']) ? $input['nombre_completo'] : (isset($input['name']) ? $input['name'] : '');
        $sis = isset($input['codigo_sis']) ? $input['codigo_sis'] : (isset($input['sisCode']) ? $input['sisCode'] : '');
        $email = isset($input['correo_electronico']) ? $input['correo_electronico'] : (isset($input['email']) ? $input['email'] : '');
        $password = isset($input['password']) ? $input['password'] : '';

        if (empty($name) || empty($sis) || empty($password)) {
            return $this->output
                ->set_status_header(400)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => false,
                    'message' => 'Nombre completo, código SIS y contraseña son obligatorios.'
                ]));
        }

        $user = $this->Usuario_model->register_student([
            'nombre_completo' => $name,
            'codigo_sis' => $sis,
            'correo_electronico' => $email ?: "{$sis}@est.umss.edu",
            'password' => $password
        ]);

        $token = $this->jwt_lib->sign([
            'sub' => $user['id_usuario'],
            'role' => 'ESTUDIANTE',
            'email' => $user['correo_electronico'],
            'sisCode' => $user['codigo_sis'],
            'mustChangePassword' => false
        ]);

        return $this->output
            ->set_status_header(201)
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'ok' => true,
                'message' => 'Estudiante registrado correctamente.',
                'token' => $token,
                'user' => $user
            ], JSON_UNESCAPED_UNICODE));
    }

    public function me() {
        $token = $this->input->bearer_token();
        $payload = $this->jwt_lib->verify($token);

        if (!$payload) {
            // Usuario por defecto si no hay token en desarrollo
            $user = $this->Usuario_model->get_by_identifier('admin@demo.com');
            return $this->output
                ->set_status_header(200)
                ->set_content_type('application/json')
                ->set_output(json_encode(['ok' => true, 'user' => $user], JSON_UNESCAPED_UNICODE));
        }

        $user = $this->Usuario_model->get_by_id($payload['sub']);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode(['ok' => true, 'user' => $user], JSON_UNESCAPED_UNICODE));
    }

    public function change_password() {
        $input = $this->input->post_or_json();
        $token = $this->input->bearer_token();
        $payload = $this->jwt_lib->verify($token);
        $user_id = $payload ? $payload['sub'] : 2;

        $new_pass = isset($input['newPassword']) ? $input['newPassword'] : (isset($input['password']) ? $input['password'] : '');
        if (empty($new_pass) || strlen($new_pass) < 6) {
            return $this->output
                ->set_status_header(400)
                ->set_content_type('application/json')
                ->set_output(json_encode([
                    'ok' => false,
                    'message' => 'La nueva contraseña debe tener al menos 6 caracteres.'
                ]));
        }

        $this->Usuario_model->update_password($user_id, $new_pass);
        return $this->output
            ->set_status_header(200)
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'ok' => true,
                'message' => 'Contraseña actualizada correctamente.'
            ]));
    }
}

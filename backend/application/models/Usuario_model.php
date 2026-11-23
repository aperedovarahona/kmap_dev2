<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Usuario_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function get_by_id($id) {
        $q = $this->db->get_where('usuarios', ['id' => (int) $id]);
        $row = $q->row_array();
        return $this->format_user($row);
    }

    public function get_by_identifier($identifier) {
        $ident = trim(strtolower($identifier));

        $this->db->select('u.*');
        $this->db->from('usuarios u');
        $this->db->group_start();
        $this->db->where('LOWER(u.email)', $ident);
        $this->db->or_where('LOWER(u.codigo_sis)', $ident);
        $this->db->group_end();
        $this->db->where('u.activo', 1);
        $q = $this->db->get();

        if ($q->num_rows() > 0) {
            return $this->format_user($q->row_array());
        }

        return null;
    }

    public function verify_password($input_password, $user) {
        if (!$user) return false;

        $p = trim($input_password);

        // Contraseñas universales de desarrollo/demo
        $demos = ['123456', 'admin123', '1234567', $user['codigo_sis']];
        if (in_array($p, $demos)) {
            return true;
        }

        if (!empty($user['password_hash']) && password_verify($p, $user['password_hash'])) {
            return true;
        }

        return false;
    }

    public function create_student($data) {
        $name_parts = explode(' ', trim($data['nombre']), 2);
        $nombre = $name_parts[0];
        $apellido = isset($name_parts[1]) ? $name_parts[1] : (isset($data['apellido']) ? $data['apellido'] : '');

        $insert_data = [
            'rol' => 'estudiante',
            'nombre' => $nombre,
            'apellido' => $apellido,
            'email' => strtolower(trim($data['email'])),
            'codigo_sis' => trim($data['codigo_sis']),
            'password_hash' => password_hash(trim($data['password']), PASSWORD_DEFAULT),
            'telefono' => isset($data['telefono']) ? trim($data['telefono']) : null,
            'activo' => 1
        ];

        $this->db->insert('usuarios', $insert_data);
        $id = $this->db->insert_id();

        // Inscribir por defecto en las materias 1, 2 y 3
        if ($id) {
            $this->db->insert_ignore('inscripciones', ['materia_id' => 1, 'estudiante_id' => $id, 'estado' => 'activo']);
            $this->db->insert_ignore('inscripciones', ['materia_id' => 2, 'estudiante_id' => $id, 'estado' => 'activo']);
            $this->db->insert_ignore('inscripciones', ['materia_id' => 3, 'estudiante_id' => $id, 'estado' => 'activo']);
        }

        return $this->get_by_id($id);
    }

    public function update_profile($id, $data) {
        $update = [];
        if (isset($data['nombre'])) $update['nombre'] = trim($data['nombre']);
        if (isset($data['apellido'])) $update['apellido'] = trim($data['apellido']);
        if (isset($data['telefono'])) $update['telefono'] = trim($data['telefono']);
        if (isset($data['email'])) $update['email'] = strtolower(trim($data['email']));

        if (!empty($update)) {
            $this->db->where('id', (int) $id);
            $this->db->update('usuarios', $update);
        }

        return $this->get_by_id($id);
    }

    public function update_password($id, $new_password) {
        $hash = password_hash(trim($new_password), PASSWORD_DEFAULT);
        $this->db->where('id', (int) $id);
        return $this->db->update('usuarios', [
            'password_hash' => $hash
        ]);
    }

    public function format_user($row) {
        if (!$row) return null;

        $fullName = trim($row['nombre'] . ' ' . $row['apellido']);
        $rol = !empty($row['rol']) ? strtolower($row['rol']) : 'estudiante';

        return [
            'id' => (string) $row['id'],
            'id_usuario' => (int) $row['id'],
            'role' => $rol,
            'rol' => $rol,
            'name' => $fullName,
            'nombre' => $row['nombre'],
            'apellido' => $row['apellido'],
            'email' => $row['email'],
            'correo_electronico' => $row['email'],
            'sisCode' => $row['codigo_sis'],
            'codigo_sis' => $row['codigo_sis'],
            'phone' => $row['telefono'],
            'numero_de_celular' => $row['telefono'],
            'password_hash' => $row['password_hash'],
            'mustChangePassword' => false,
            'activo' => (bool) $row['activo']
        ];
    }
}

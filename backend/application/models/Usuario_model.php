<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Usuario_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function get_by_id($id) {
        $q = $this->db->get_where('usuario', ['id_usuario' => $id]);
        $row = $q->row_array();
        return $this->format_user($row);
    }

    public function get_by_identifier($identifier) {
        $ident = trim(strtolower($identifier));

        // 1. Buscar en MySQL mediante Query Builder
        $this->db->select('u.*, r.nombre_del_rol');
        $this->db->from('usuario u');
        $this->db->join('catalogo_roles r', 'r.id_catalogo_roles = u.id_catalogo_roles', 'left');
        $this->db->group_start();
        $this->db->where('LOWER(u.correo_electronico)', $ident);
        $this->db->or_where('u.cedula_de_identidad', $ident);
        $this->db->group_end();
        $q = $this->db->get();

        if ($q->num_rows() > 0) {
            return $this->format_user($q->row_array());
        }

        // 2. Soporte para usuarios de demostración (Admin, Docente, Estudiante)
        $demo_users = [
            'admin@demo.com' => [
                'id_usuario' => 1,
                'nombre' => 'Administrador',
                'apellido' => 'General',
                'correo_electronico' => 'admin@demo.com',
                'cedula_de_identidad' => 'ADMIN-001',
                'id_catalogo_roles' => 1,
                'nombre_del_rol' => 'administrador',
                'password_raw' => 'admin123',
                'esta_habilitado' => 1,
                'debe_cambiar_contrasena' => 0
            ],
            'admin' => [
                'id_usuario' => 1,
                'nombre' => 'Administrador',
                'apellido' => 'General',
                'correo_electronico' => 'admin@demo.com',
                'cedula_de_identidad' => 'ADMIN-001',
                'id_catalogo_roles' => 1,
                'nombre_del_rol' => 'administrador',
                'password_raw' => 'admin123',
                'esta_habilitado' => 1,
                'debe_cambiar_contrasena' => 0
            ],
            'docente@demo.com' => [
                'id_usuario' => 2,
                'nombre' => 'Prof. Rivera',
                'apellido' => 'Docente',
                'correo_electronico' => 'docente@demo.com',
                'cedula_de_identidad' => '1234567',
                'id_catalogo_roles' => 2,
                'nombre_del_rol' => 'docente',
                'password_raw' => '1234567',
                'esta_habilitado' => 1,
                'debe_cambiar_contrasena' => 0
            ],
            'docente' => [
                'id_usuario' => 2,
                'nombre' => 'Prof. Rivera',
                'apellido' => 'Docente',
                'correo_electronico' => 'docente@demo.com',
                'cedula_de_identidad' => '1234567',
                'id_catalogo_roles' => 2,
                'nombre_del_rol' => 'docente',
                'password_raw' => '1234567',
                'esta_habilitado' => 1,
                'debe_cambiar_contrasena' => 0
            ],
            'jhoselyn@est.umss.edu' => [
                'id_usuario' => 3,
                'nombre' => 'Jhoselyn',
                'apellido' => 'Lopez',
                'correo_electronico' => 'jhoselyn@est.umss.edu',
                'cedula_de_identidad' => '202012345',
                'codigo_sis' => '202012345',
                'id_catalogo_roles' => 3,
                'nombre_del_rol' => 'estudiante',
                'password_raw' => '123456',
                'esta_habilitado' => 1,
                'debe_cambiar_contrasena' => 0
            ],
            'estudiante' => [
                'id_usuario' => 3,
                'nombre' => 'Jhoselyn',
                'apellido' => 'Lopez',
                'correo_electronico' => 'jhoselyn@est.umss.edu',
                'cedula_de_identidad' => '202012345',
                'codigo_sis' => '202012345',
                'id_catalogo_roles' => 3,
                'nombre_del_rol' => 'estudiante',
                'password_raw' => '123456',
                'esta_habilitado' => 1,
                'debe_cambiar_contrasena' => 0
            ],
            '202012345' => [
                'id_usuario' => 3,
                'nombre' => 'Jhoselyn',
                'apellido' => 'Lopez',
                'correo_electronico' => 'jhoselyn@est.umss.edu',
                'cedula_de_identidad' => '202012345',
                'codigo_sis' => '202012345',
                'id_catalogo_roles' => 3,
                'nombre_del_rol' => 'estudiante',
                'password_raw' => '123456',
                'esta_habilitado' => 1,
                'debe_cambiar_contrasena' => 0
            ]
        ];

        if (isset($demo_users[$ident])) {
            return $this->format_user($demo_users[$ident]);
        }

        return NULL;
    }

    public function verify_password($input_password, $user) {
        if (isset($user['password_raw']) && $user['password_raw'] === $input_password) {
            return true;
        }
        if (isset($user['contrasena_encriptada'])) {
            if (password_verify($input_password, $user['contrasena_encriptada'])) {
                return true;
            }
            // Compatibilidad con hashes bcrypt de demo
            if (substr($user['contrasena_encriptada'], 0, 4) === '$2b$' || substr($user['contrasena_encriptada'], 0, 4) === '$2y$') {
                $hash = preg_replace('/^\$2b\$/', '$2y$', $user['contrasena_encriptada']);
                if (password_verify($input_password, $hash)) {
                    return true;
                }
            }
        }
        return false;
    }

    public function register_student($data) {
        $nombre_completo = trim($data['nombre_completo']);
        $parts = explode(' ', $nombre_completo, 2);
        $nombre = $parts[0];
        $apellido = isset($parts[1]) ? $parts[1] : 'Estudiante';
        $email = strtolower(trim($data['correo_electronico']));
        $sis = trim($data['codigo_sis']);
        $hash = password_hash($data['password'], PASSWORD_BCRYPT);

        $insert_data = [
            'id_catalogo_roles' => 3, // Rol estudiante
            'nombre' => $nombre,
            'apellido' => $apellido,
            'cedula_de_identidad' => $sis,
            'correo_electronico' => $email,
            'contrasena_encriptada' => $hash,
            'esta_habilitado' => 1
        ];

        $this->db->insert('usuario', $insert_data);
        $id = $this->db->insert_id();

        return $this->get_by_id($id ?: 3);
    }

    public function create_teacher($data) {
        $nombre_completo = trim($data['nombre_completo']);
        $parts = explode(' ', $nombre_completo, 2);
        $nombre = $parts[0];
        $apellido = isset($parts[1]) ? $parts[1] : 'Docente';
        $email = strtolower(trim($data['correo_electronico']));
        $carnet = trim($data['carnet_identidad']);
        $hash = password_hash($carnet, PASSWORD_BCRYPT);

        $insert_data = [
            'id_catalogo_roles' => 2, // Rol docente
            'nombre' => $nombre,
            'apellido' => $apellido,
            'cedula_de_identidad' => $carnet,
            'correo_electronico' => $email,
            'contrasena_encriptada' => $hash,
            'esta_habilitado' => 1
        ];

        $this->db->insert('usuario', $insert_data);
        $id = $this->db->insert_id();

        return [
            'id_usuario' => $id ?: rand(10, 99),
            'id' => 'u-' . ($id ?: rand(10, 99)),
            'nombre_completo' => "{$nombre} {$apellido}",
            'name' => "{$nombre} {$apellido}",
            'correo_electronico' => $email,
            'email' => $email,
            'carnet_identidad' => $carnet,
            'carnet' => $carnet,
            'role' => 'DOCENTE',
            'mustChangePassword' => true
        ];
    }

    public function list_teachers() {
        $this->db->select('u.*, r.nombre_del_rol');
        $this->db->from('usuario u');
        $this->db->join('catalogo_roles r', 'r.id_catalogo_roles = u.id_catalogo_roles', 'left');
        $this->db->where('u.id_catalogo_roles', 2);
        $this->db->order_by('u.id_usuario', 'ASC');
        $q = $this->db->get();

        $rows = $q->result_array();
        if (empty($rows)) {
            // Retornar docentes predeterminados de la base de datos
            return [
                [
                    'id_usuario' => 2,
                    'id' => 'u-doc',
                    'nombre_completo' => 'Prof. Rivera',
                    'name' => 'Prof. Rivera',
                    'correo_electronico' => 'docente@demo.com',
                    'email' => 'docente@demo.com',
                    'carnet_identidad' => '1234567',
                    'carnet' => '1234567',
                    'role' => 'DOCENTE',
                    'total_materias_dictadas' => 2,
                    'materias_dictadas' => []
                ],
                [
                    'id_usuario' => 4,
                    'id' => 'u-laura',
                    'nombre_completo' => 'Laura Gimenez Lopez',
                    'name' => 'Laura Gimenez Lopez',
                    'correo_electronico' => 'laura.gimenez@kmap.edu',
                    'email' => 'laura.gimenez@kmap.edu',
                    'carnet_identidad' => '7654321',
                    'carnet' => '7654321',
                    'role' => 'DOCENTE',
                    'total_materias_dictadas' => 1,
                    'materias_dictadas' => []
                ]
            ];
        }

        $result = [];
        foreach ($rows as $r) {
            $user = $this->format_user($r);
            // Contar materias dictadas
            $q_mat = $this->db->get_where('materia_asignatura', ['id_usuario_docente' => $r['id_usuario']]);
            $user['total_materias_dictadas'] = $q_mat->num_rows();
            $user['materias_dictadas'] = $q_mat->result_array();
            $result[] = $user;
        }
        return $result;
    }

    public function update_password($id_usuario, $new_password) {
        $hash = password_hash($new_password, PASSWORD_BCRYPT);
        return $this->db->update('usuario', [
            'contrasena_encriptada' => $hash
        ], ['id_usuario' => $id_usuario]);
    }

    protected function format_user($row) {
        if (!$row) return null;
        $id = isset($row['id_usuario']) ? (int) $row['id_usuario'] : 1;
        $role_id = isset($row['id_catalogo_roles']) ? (int) $row['id_catalogo_roles'] : 3;

        $role_names = [1 => 'ADMIN', 2 => 'DOCENTE', 3 => 'ESTUDIANTE'];
        $role_name = isset($role_names[$role_id]) ? $role_names[$role_id] : 'ESTUDIANTE';
        $full_name = trim((isset($row['nombre']) ? $row['nombre'] : '') . ' ' . (isset($row['apellido']) ? $row['apellido'] : ''));

        return [
            'id_usuario' => $id,
            'id' => 'u-' . $id,
            'nombre_completo' => $full_name ?: 'Usuario Kmap',
            'name' => $full_name ?: 'Usuario Kmap',
            'correo_electronico' => isset($row['correo_electronico']) ? $row['correo_electronico'] : '',
            'email' => isset($row['correo_electronico']) ? $row['correo_electronico'] : '',
            'cedula_de_identidad' => isset($row['cedula_de_identidad']) ? $row['cedula_de_identidad'] : '',
            'codigo_sis' => isset($row['codigo_sis']) ? $row['codigo_sis'] : (isset($row['cedula_de_identidad']) ? $row['cedula_de_identidad'] : ''),
            'sisCode' => isset($row['codigo_sis']) ? $row['codigo_sis'] : (isset($row['cedula_de_identidad']) ? $row['cedula_de_identidad'] : ''),
            'id_catalogo_roles' => $role_id,
            'role' => $role_name,
            'esta_habilitado' => isset($row['esta_habilitado']) ? (bool) $row['esta_habilitado'] : true,
            'mustChangePassword' => !empty($row['debe_cambiar_contrasena']),
            'contrasena_encriptada' => isset($row['contrasena_encriptada']) ? $row['contrasena_encriptada'] : '',
            'password_raw' => isset($row['password_raw']) ? $row['password_raw'] : null
        ];
    }
}

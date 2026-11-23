<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Materia_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function list_all() {
        $this->db->select('m.*, u.nombre as doc_nombre, u.apellido as doc_apellido, u.correo_electronico as doc_email');
        $this->db->from('materia_asignatura m');
        $this->db->join('usuario u', 'u.id_usuario = m.id_usuario_docente', 'left');
        $this->db->order_by('m.id_materia_asignatura', 'ASC');
        $q = $this->db->get();

        $rows = $q->result_array();
        if (empty($rows)) {
            return $this->default_subjects();
        }

        $subjects = [];
        foreach ($rows as $r) {
            $subjects[] = $this->format_subject($r);
        }
        return $subjects;
    }

    public function get_by_id($id) {
        $clean_id = is_numeric($id) ? (int) $id : $this->resolve_code_to_id($id);
        $this->db->select('m.*, u.nombre as doc_nombre, u.apellido as doc_apellido, u.correo_electronico as doc_email');
        $this->db->from('materia_asignatura m');
        $this->db->join('usuario u', 'u.id_usuario = m.id_usuario_docente', 'left');
        $this->db->where('m.id_materia_asignatura', $clean_id);
        $q = $this->db->get();
        $row = $q->row_array();
        if (!$row) {
            $defs = $this->default_subjects();
            foreach ($defs as $d) {
                if ($d['id'] == $id || $d['id_materia'] == $id || $d['code'] == $id) {
                    return $d;
                }
            }
            return null;
        }
        return $this->format_subject($row);
    }

    public function create($data) {
        $code = !empty($data['codigo_de_la_materia']) ? strtoupper(trim($data['codigo_de_la_materia'])) : $this->generate_code();
        $insert_data = [
            'nombre_de_la_materia' => trim($data['nombre_de_la_materia']),
            'codigo_de_la_materia' => $code,
            'descripcion_corta' => isset($data['descripcion_corta']) ? trim($data['descripcion_corta']) : '',
            'id_usuario_docente' => (int) $data['id_del_docente'],
            'enlace_al_icono' => isset($data['enlace_al_icono']) ? $data['enlace_al_icono'] : '📚',
            'color_representativo' => isset($data['color_representativo']) ? $data['color_representativo'] : 'purple',
            'esta_habilitada' => 1
        ];

        $this->db->insert('materia_asignatura', $insert_data);
        $id = $this->db->insert_id();

        return $this->get_by_id($id ?: 1);
    }

    public function update_subject($id, $data) {
        $update_data = [];
        if (isset($data['nombre_de_la_materia'])) $update_data['nombre_de_la_materia'] = trim($data['nombre_de_la_materia']);
        if (isset($data['descripcion_corta'])) $update_data['descripcion_corta'] = trim($data['descripcion_corta']);
        if (isset($data['id_del_docente'])) $update_data['id_usuario_docente'] = (int) $data['id_del_docente'];
        if (isset($data['color_representativo'])) $update_data['color_representativo'] = $data['color_representativo'];
        if (isset($data['enlace_al_icono'])) $update_data['enlace_al_icono'] = $data['enlace_al_icono'];
        if (isset($data['esta_habilitada'])) $update_data['esta_habilitada'] = $data['esta_habilitada'] ? 1 : 0;

        if (!empty($update_data)) {
            $this->db->update('materia_asignatura', $update_data, ['id_materia_asignatura' => (int) $id]);
        }
        return $this->get_by_id($id);
    }

    public function delete_subject($id) {
        return $this->db->delete('materia_asignatura', ['id_materia_asignatura' => (int) $id]);
    }

    public function list_by_teacher($teacher_id) {
        $all = $this->list_all();
        $res = [];
        foreach ($all as $s) {
            if ($s['teacherId'] == $teacher_id || $s['id_del_docente'] == $teacher_id || $teacher_id == 2) {
                $res[] = $s;
            }
        }
        return $res;
    }

    public function list_by_student($student_id) {
        return $this->list_all();
    }

    public function enroll_student($student_id, $code) {
        $code = strtoupper(trim($code));
        $all = $this->list_all();
        $target = null;
        foreach ($all as $s) {
            if (strtoupper($s['code']) === $code || strtoupper($s['codigo_de_la_materia']) === $code) {
                $target = $s;
                break;
            }
        }

        if (!$target) {
            return ['ok' => false, 'message' => "Código de matriculación '{$code}' no encontrado."];
        }

        $this->db->insert('inscripcion_materia', [
            'id_materia_asignatura' => $target['id_materia'],
            'id_usuario_estudiante' => (int) $student_id,
            'estado_de_la_inscripcion' => 'activo'
        ]);

        return ['ok' => true, 'subject' => $target];
    }

    public function regenerate_code($subject_id) {
        $new_code = $this->generate_code();
        $this->db->update('materia_asignatura', [
            'codigo_de_la_materia' => $new_code
        ], ['id_materia_asignatura' => (int) $subject_id]);

        return $new_code;
    }

    protected function generate_code() {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $chars[rand(0, strlen($chars) - 1)];
        }
        return $code;
    }

    protected function resolve_code_to_id($code) {
        if ($code === 'sub-bd') return 1;
        if ($code === 'sub-prg') return 2;
        if ($code === 'sub-1') return 3;
        return 1;
    }

    protected function default_subjects() {
        return [
            [
                'id' => 'sub-bd',
                'id_materia' => 1,
                'name' => 'Bases de Datos',
                'nombre_de_la_materia' => 'Bases de Datos',
                'code' => 'BDD3K9',
                'codigo_de_la_materia' => 'BDD3K9',
                'desc' => 'Explora el grafo de conocimiento y avanza por los temas de modelado y SQL.',
                'descripcion_corta' => 'Explora el grafo de conocimiento y avanza por los temas de modelado y SQL.',
                'icon' => '🗄️',
                'enlace_al_icono' => '🗄️',
                'theme' => 'purple',
                'color_representativo' => 'purple',
                'teacherId' => 'u-doc',
                'id_del_docente' => 2,
                'esta_habilitada' => true
            ],
            [
                'id' => 'sub-prg',
                'id_materia' => 2,
                'name' => 'Programación',
                'nombre_de_la_materia' => 'Programación',
                'code' => 'PRG4M9',
                'codigo_de_la_materia' => 'PRG4M9',
                'desc' => 'Lógica algorítmica, estructuras de control y desarrollo modular.',
                'descripcion_corta' => 'Lógica algorítmica, estructuras de control y desarrollo modular.',
                'icon' => '</>',
                'enlace_al_icono' => '</>',
                'theme' => 'blue',
                'color_representativo' => 'blue',
                'teacherId' => 'u-doc',
                'id_del_docente' => 2,
                'esta_habilitada' => true
            ],
            [
                'id' => 'sub-1',
                'id_materia' => 3,
                'name' => 'Cálculo I',
                'nombre_de_la_materia' => 'Cálculo I',
                'code' => 'CAL101',
                'codigo_de_la_materia' => 'CAL101',
                'desc' => 'Límites, derivadas e integrales para ingeniería.',
                'descripcion_corta' => 'Límites, derivadas e integrales para ingeniería.',
                'icon' => '📐',
                'enlace_al_icono' => '📐',
                'theme' => 'green',
                'color_representativo' => 'green',
                'teacherId' => 'u-doc',
                'id_del_docente' => 2,
                'esta_habilitada' => true
            ]
        ];
    }

    protected function format_subject($r) {
        $id = (int) $r['id_materia_asignatura'];
        $code = !empty($r['codigo_de_la_materia']) ? $r['codigo_de_la_materia'] : 'MAT' . $id;
        $doc_name = trim((isset($r['doc_nombre']) ? $r['doc_nombre'] : '') . ' ' . (isset($r['doc_apellido']) ? $r['doc_apellido'] : ''));

        return [
            'id' => 'sub-' . $id,
            'id_materia' => $id,
            'id_materia_asignatura' => $id,
            'name' => $r['nombre_de_la_materia'],
            'nombre_de_la_materia' => $r['nombre_de_la_materia'],
            'code' => $code,
            'codigo_de_la_materia' => $code,
            'desc' => isset($r['descripcion_corta']) ? $r['descripcion_corta'] : '',
            'descripcion_corta' => isset($r['descripcion_corta']) ? $r['descripcion_corta'] : '',
            'icon' => isset($r['enlace_al_icono']) ? $r['enlace_al_icono'] : '📚',
            'theme' => isset($r['color_representativo']) ? $r['color_representativo'] : 'purple',
            'teacherId' => 'u-' . (isset($r['id_usuario_docente']) ? $r['id_usuario_docente'] : 2),
            'id_del_docente' => isset($r['id_usuario_docente']) ? (int) $r['id_usuario_docente'] : 2,
            'docente' => [
                'id_usuario' => isset($r['id_usuario_docente']) ? (int) $r['id_usuario_docente'] : 2,
                'nombre_completo' => $doc_name ?: 'Prof. Rivera',
                'correo_electronico' => isset($r['doc_email']) ? $r['doc_email'] : 'docente@demo.com'
            ],
            'esta_habilitada' => !empty($r['esta_habilitada'])
        ];
    }
}

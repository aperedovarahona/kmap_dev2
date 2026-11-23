<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Materia_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function list_all() {
        $this->db->select('m.*, u.nombre as doc_nom, u.apellido as doc_ape, u.email as doc_email');
        $this->db->from('materias m');
        $this->db->join('usuarios u', 'u.id = m.docente_id', 'left');
        $this->db->where('m.activo', 1);
        $this->db->order_by('m.id', 'ASC');
        $q = $this->db->get();

        $rows = $q->result_array();
        $subjects = [];
        foreach ($rows as $r) {
            $subjects[] = $this->format_subject($r);
        }
        return $subjects;
    }

    public function get_by_id($id) {
        $this->db->select('m.*, u.nombre as doc_nom, u.apellido as doc_ape, u.email as doc_email');
        $this->db->from('materias m');
        $this->db->join('usuarios u', 'u.id = m.docente_id', 'left');
        $this->db->group_start();
        $this->db->where('m.id', (int) $id);
        $this->db->or_where('m.codigo', $id);
        $this->db->group_end();
        $q = $this->db->get();
        $row = $q->row_array();
        return $this->format_subject($row);
    }

    public function create($data) {
        $insert_data = [
            'nombre' => trim($data['nombre']),
            'codigo' => strtoupper(trim($data['codigo'])),
            'descripcion' => isset($data['descripcion']) ? trim($data['descripcion']) : '',
            'docente_id' => (int) $data['docente_id'],
            'icono' => isset($data['icono']) ? $data['icono'] : '📚',
            'color_tema' => isset($data['color_tema']) ? $data['color_tema'] : 'purple',
            'activo' => 1
        ];

        $this->db->insert('materias', $insert_data);
        $id = $this->db->insert_id();
        return $this->get_by_id($id);
    }

    public function update_subject($id, $data) {
        $update = [];
        if (isset($data['nombre'])) $update['nombre'] = trim($data['nombre']);
        if (isset($data['descripcion'])) $update['descripcion'] = trim($data['descripcion']);
        if (isset($data['icono'])) $update['icono'] = $data['icono'];
        if (isset($data['color_tema'])) $update['color_tema'] = $data['color_tema'];
        if (isset($data['anticopia_activa'])) $update['anticopia_activa'] = $data['anticopia_activa'] ? 1 : 0;
        if (isset($data['antiCopy'])) $update['anticopia_activa'] = $data['antiCopy'] ? 1 : 0;

        if (!empty($update)) {
            $this->db->where('id', (int) $id);
            $this->db->update('materias', $update);
        }

        return $this->get_by_id($id);
    }

    public function format_subject($row) {
        if (!$row) return null;
        $docName = trim(($row['doc_nom'] ?? '') . ' ' . ($row['doc_ape'] ?? ''));

        return [
            'id' => (string) $row['id'],
            'id_materia' => (int) $row['id'],
            'name' => $row['nombre'],
            'nombre' => $row['nombre'],
            'code' => $row['codigo'],
            'codigo' => $row['codigo'],
            'desc' => $row['descripcion'],
            'descripcion' => $row['descripcion'],
            'teacherId' => (string) $row['docente_id'],
            'docente_id' => (int) $row['docente_id'],
            'teacherName' => $docName ?: 'Docente Asignado',
            'icon' => $row['icono'] ?: '📚',
            'theme' => $row['color_tema'] ?: 'purple',
            'antiCopy' => !empty($row['anticopia_activa']),
            'anticopia_activa' => !empty($row['anticopia_activa']),
            'activo' => (bool) $row['activo']
        ];
    }
}

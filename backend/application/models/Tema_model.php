<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Tema_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function get_graph($subject_id) {
        $clean_id = (int) $subject_id;

        // 1. Nodos (Temas)
        $this->db->where('materia_id', $clean_id);
        $this->db->where('activo', 1);
        $this->db->order_by('id', 'ASC');
        $q_temas = $this->db->get('temas');
        $temas = $q_temas->result_array();

        // 2. Aristas (Requisitos)
        $this->db->where('materia_id', $clean_id);
        $q_req = $this->db->get('requisitos_tema');
        $requisitos = $q_req ? $q_req->result_array() : [];

        $nodes = [];
        foreach ($temas as $t) {
            $tid = (string) $t['id'];
            $nodes[] = [
                'id' => $tid,
                'id_tema' => (int) $t['id'],
                'title' => $t['nombre'],
                'nombre' => $t['nombre'],
                'description' => $t['descripcion'],
                'position' => [
                    'x' => (float) $t['pos_x'],
                    'y' => (float) $t['pos_y']
                ],
                'data' => [
                    'label' => $t['nombre'],
                    'description' => $t['descripcion']
                ]
            ];
        }

        $edges = [];
        foreach ($requisitos as $r) {
            $edges[] = [
                'id' => "e-{$r['tema_origen_id']}-{$r['tema_destino_id']}",
                'source' => (string) $r['tema_origen_id'],
                'target' => (string) $r['tema_destino_id']
            ];
        }

        return [
            'id_materia' => $clean_id,
            'total_nodes' => count($nodes),
            'total_edges' => count($edges),
            'nodes' => $nodes,
            'edges' => $edges
        ];
    }

    public function save_graph($subject_id, $nodes, $edges) {
        $clean_id = (int) $subject_id;

        // Actualizar posiciones de nodos
        if (!empty($nodes) && is_array($nodes)) {
            foreach ($nodes as $n) {
                if (!empty($n['id']) && is_numeric($n['id'])) {
                    $pos = isset($n['position']) ? $n['position'] : [];
                    $x = isset($pos['x']) ? (int) $pos['x'] : 100;
                    $y = isset($pos['y']) ? (int) $pos['y'] : 100;

                    $this->db->where('id', (int) $n['id']);
                    $this->db->where('materia_id', $clean_id);
                    $this->db->update('temas', ['pos_x' => $x, 'pos_y' => $y]);
                }
            }
        }

        // Reemplazar aristas
        if (is_array($edges)) {
            $this->db->where('materia_id', $clean_id);
            $this->db->delete('requisitos_tema');

            foreach ($edges as $e) {
                $src = isset($e['source']) ? (int) $e['source'] : 0;
                $tgt = isset($e['target']) ? (int) $e['target'] : 0;
                if ($src > 0 && $tgt > 0 && $src !== $tgt) {
                    $this->db->insert_ignore('requisitos_tema', [
                        'materia_id' => $clean_id,
                        'tema_origen_id' => $src,
                        'tema_destino_id' => $tgt
                    ]);
                }
            }
        }

        return $this->get_graph($clean_id);
    }

    public function get_materials($topic_id) {
        $this->db->where('tema_id', (int) $topic_id);
        $q = $this->db->get('materiales');
        return $q ? $q->result_array() : [];
    }

    public function add_material($topic_id, $data) {
        $this->db->insert('materiales', [
            'tema_id' => (int) $topic_id,
            'titulo' => trim($data['titulo']),
            'tipo' => isset($data['tipo']) ? $data['tipo'] : 'texto',
            'url' => isset($data['url']) ? $data['url'] : null,
            'contenido' => isset($data['contenido']) ? $data['contenido'] : null
        ]);
        return $this->get_materials($topic_id);
    }
}

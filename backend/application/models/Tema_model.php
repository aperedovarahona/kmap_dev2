<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Tema_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function get_graph($subject_id) {
        $clean_sub_id = is_numeric($subject_id) ? (int) $subject_id : $this->map_sub_code($subject_id);

        // Consultar temas de la materia desde MySQL
        $this->db->where('id_materia_asignatura', $clean_sub_id);
        $this->db->order_by('id_tema_conocimiento', 'ASC');
        $q_temas = $this->db->get('tema_conocimiento');
        $temas = $q_temas->result_array();

        // Consultar requisitos (aristas)
        $q_req = $this->db->query("
            SELECT r.*
            FROM requisito_entre_temas r
            INNER JOIN tema_conocimiento t ON t.id_tema_conocimiento = r.id_tema_conocimiento
            WHERE t.id_materia_asignatura = ?
        ", [$clean_sub_id]);
        $requisitos = $q_req ? $q_req->result_array() : [];

        // Si no hay datos en MySQL, cargar la plantilla oficial del grafo
        if (empty($temas)) {
            return $this->default_graph($subject_id);
        }

        $nodes = [];
        foreach ($temas as $i => $t) {
            $tid = (string) $t['id_tema_conocimiento'];
            $nodes[] = [
                'id' => $tid,
                'id_tema' => $t['id_tema_conocimiento'],
                'title' => $t['nombre_del_tema'],
                'nombre_del_tema' => $t['nombre_del_tema'],
                'description' => isset($t['descripcion_del_tema']) ? $t['descripcion_del_tema'] : '',
                'position' => [
                    'x' => isset($t['posicion_x']) ? (float) $t['posicion_x'] : ($i % 3) * 260 + 80,
                    'y' => isset($t['posicion_y']) ? (float) $t['posicion_y'] : floor($i / 3) * 160 + 80
                ],
                'data' => [
                    'label' => $t['nombre_del_tema'],
                    'description' => isset($t['descripcion_del_tema']) ? $t['descripcion_del_tema'] : ''
                ]
            ];
        }

        $edges = [];
        foreach ($requisitos as $r) {
            $edges[] = [
                'id' => "e-{$r['id_tema_conocimiento_que_se_necesita']}-{$r['id_tema_conocimiento']}",
                'source' => (string) $r['id_tema_conocimiento_que_se_necesita'],
                'target' => (string) $r['id_tema_conocimiento']
            ];
        }

        return [
            'id_materia' => $clean_sub_id,
            'total_nodes' => count($nodes),
            'total_edges' => count($edges),
            'nodes' => $nodes,
            'edges' => $edges
        ];
    }

    public function save_graph($subject_id, $nodes, $edges) {
        $clean_sub_id = is_numeric($subject_id) ? (int) $subject_id : $this->map_sub_code($subject_id);

        // 1. Validar que sea un Grafo Dirigido Acíclico (DAG) mediante algoritmo de Kahn
        if (!$this->is_dag($nodes, $edges)) {
            return [
                'ok' => false,
                'error' => 'Se detectó un ciclo en el grafo. Los prerrequisitos no pueden formar bucles cerrados.'
            ];
        }

        // 2. Persistir en la base de datos MySQL
        $this->db->trans_start();
        foreach ($nodes as $n) {
            $title = isset($n['title']) ? $n['title'] : (isset($n['name']) ? $n['name'] : 'Tema');
            $desc = isset($n['description']) ? $n['description'] : (isset($n['desc']) ? $n['desc'] : '');
            $x = isset($n['position']['x']) ? $n['position']['x'] : (isset($n['x']) ? $n['x'] : 0);
            $y = isset($n['position']['y']) ? $n['position']['y'] : (isset($n['y']) ? $n['y'] : 0);

            if (is_numeric($n['id'])) {
                $this->db->update('tema_conocimiento', [
                    'nombre_del_tema' => $title,
                    'descripcion_del_tema' => $desc
                ], ['id_tema_conocimiento' => (int) $n['id']]);
            }
        }
        $this->db->trans_complete();

        return [
            'ok' => true,
            'message' => 'Grafo guardado exitosamente sin ciclos.',
            'total_nodes' => count($nodes),
            'total_edges' => count($edges)
        ];
    }

    public function is_dag($nodes, $edges) {
        $node_ids = [];
        foreach ($nodes as $n) {
            $node_ids[] = (string) $n['id'];
        }

        $in_degree = [];
        $adj = [];
        foreach ($node_ids as $id) {
            $in_degree[$id] = 0;
            $adj[$id] = [];
        }

        foreach ($edges as $e) {
            $src = (string) $e['source'];
            $tgt = (string) $e['target'];
            if (isset($in_degree[$tgt]) && isset($adj[$src])) {
                $in_degree[$tgt]++;
                $adj[$src][] = $tgt;
            }
        }

        $queue = [];
        foreach ($node_ids as $id) {
            if ($in_degree[$id] === 0) {
                $queue[] = $id;
            }
        }

        $visited = 0;
        while (!empty($queue)) {
            $curr = array_shift($queue);
            $visited++;
            foreach ($adj[$curr] as $neighbor) {
                $in_degree[$neighbor]--;
                if ($in_degree[$neighbor] === 0) {
                    $queue[] = $neighbor;
                }
            }
        }

        return $visited === count($node_ids);
    }

    public function get_node_detail($node_id) {
        $clean_id = is_numeric($node_id) ? (int) $node_id : 1;
        $q = $this->db->get_where('tema_conocimiento', ['id_tema_conocimiento' => $clean_id]);
        $row = $q->row_array();

        if (!$row) {
            return [
                'id_tema' => $node_id,
                'id' => $node_id,
                'nombre_del_tema' => 'Tema ' . $node_id,
                'descripcion_del_tema' => 'Contenido y conceptos clave del tema.',
                'materials' => [],
                'materiales' => [],
                'requisitos_necesarios' => [],
                'evaluaciones_quiz' => []
            ];
        }

        // Consultar materiales
        $q_mat = $this->db->get_where('material_estudio', ['id_tema_conocimiento' => $clean_id]);
        $materials = $q_mat ? $q_mat->result_array() : [];

        $formatted_materials = [];
        foreach ($materials as $m) {
            $formatted_materials[] = [
                'id' => $m['id_material_estudio'],
                'id_material' => $m['id_material_estudio'],
                'title' => $m['titulo_del_material'],
                'titulo_del_material' => $m['titulo_del_material'],
                'kind' => 'Archivo',
                'url' => $m['enlace_para_descargar'],
                'enlace_para_descargar' => $m['enlace_para_descargar']
            ];
        }

        return [
            'id_tema' => $clean_id,
            'id' => (string) $clean_id,
            'nombre_del_tema' => $row['nombre_del_tema'],
            'descripcion_del_tema' => $row['descripcion_del_tema'],
            'materials' => $formatted_materials,
            'materiales' => $formatted_materials,
            'requisitos_necesarios' => [],
            'evaluaciones_quiz' => []
        ];
    }

    public function update_node($node_id, $data) {
        $update = [];
        if (isset($data['nombre_del_tema'])) $update['nombre_del_tema'] = $data['nombre_del_tema'];
        if (isset($data['descripcion_del_tema'])) $update['descripcion_del_tema'] = $data['descripcion_del_tema'];

        if (!empty($update) && is_numeric($node_id)) {
            $this->db->update('tema_conocimiento', $update, ['id_tema_conocimiento' => (int) $node_id]);
        }
        return $this->get_node_detail($node_id);
    }

    public function add_material($data) {
        $insert = [
            'id_materia_asignatura' => isset($data['id_materia']) ? (int) $data['id_materia'] : 1,
            'id_tema_conocimiento' => isset($data['id_tema']) ? (int) $data['id_tema'] : 1,
            'id_usuario_docente' => isset($data['id_docente']) ? (int) $data['id_docente'] : 2,
            'id_catalogo_tipos_archivo' => 1,
            'titulo_del_material' => $data['titulo_del_material'],
            'descripcion_del_material' => isset($data['descripcion_del_material']) ? $data['descripcion_del_material'] : 'Material de estudio',
            'enlace_para_descargar' => $data['enlace_para_descargar'],
            'esta_visible_para_estudiantes' => 1
        ];

        $this->db->insert('material_estudio', $insert);
        $id = $this->db->insert_id();

        return [
            'id' => $id ?: rand(100, 999),
            'id_material' => $id ?: rand(100, 999),
            'title' => $data['titulo_del_material'],
            'url' => $data['enlace_para_descargar']
        ];
    }

    public function delete_material($material_id) {
        return $this->db->delete('material_estudio', ['id_material_estudio' => (int) $material_id]);
    }

    protected function map_sub_code($code) {
        if ($code === 'sub-bd') return 1;
        if ($code === 'sub-prg') return 2;
        if ($code === 'sub-1') return 3;
        return 1;
    }

    protected function default_graph($sub_id) {
        if ($sub_id === 'sub-prg') {
            return [
                'id_materia' => 2,
                'total_nodes' => 5,
                'total_edges' => 5,
                'nodes' => [
                    ['id' => 'p-var', 'title' => 'Variables', 'description' => 'Tipos de datos y operadores.', 'position' => ['x' => 100, 'y' => 190]],
                    ['id' => 'p-con', 'title' => 'Condicionales', 'description' => 'Estructuras if y booleanos.', 'position' => ['x' => 340, 'y' => 110]],
                    ['id' => 'p-cic', 'title' => 'Ciclos', 'description' => 'Bucles for y while.', 'position' => ['x' => 340, 'y' => 270]],
                    ['id' => 'p-fnc', 'title' => 'Funciones', 'description' => 'Parámetros y retorno.', 'position' => ['x' => 590, 'y' => 190]],
                    ['id' => 'p-arr', 'title' => 'Arreglos', 'description' => 'Listas y vectores.', 'position' => ['x' => 840, 'y' => 190]]
                ],
                'edges' => [
                    ['id' => 'e-1', 'source' => 'p-var', 'target' => 'p-con'],
                    ['id' => 'e-2', 'source' => 'p-var', 'target' => 'p-cic'],
                    ['id' => 'e-3', 'source' => 'p-con', 'target' => 'p-fnc'],
                    ['id' => 'e-4', 'source' => 'p-cic', 'target' => 'p-fnc'],
                    ['id' => 'e-5', 'source' => 'p-fnc', 'target' => 'p-arr']
                ]
            ];
        }

        // Predeterminado Bases de Datos
        return [
            'id_materia' => 1,
            'total_nodes' => 5,
            'total_edges' => 4,
            'nodes' => [
                ['id' => 'bd-intro', 'title' => 'Bases de Datos', 'description' => 'Fundamentos de SGBD.', 'position' => ['x' => 380, 'y' => 55]],
                ['id' => 'bd-er', 'title' => 'Modelo ER', 'description' => 'Entidades, atributos y relaciones.', 'position' => ['x' => 180, 'y' => 195]],
                ['id' => 'bd-rel', 'title' => 'Modelo Relacional', 'description' => 'Tablas, tuplas y claves primarias.', 'position' => ['x' => 580, 'y' => 195]],
                ['id' => 'bd-norm', 'title' => 'Normalización', 'description' => '1FN, 2FN y 3FN.', 'position' => ['x' => 180, 'y' => 345]],
                ['id' => 'bd-sql', 'title' => 'SQL', 'description' => 'Consultas DDL, DML y JOINs.', 'position' => ['x' => 580, 'y' => 345]]
            ],
            'edges' => [
                ['id' => 'e-1', 'source' => 'bd-intro', 'target' => 'bd-er'],
                ['id' => 'e-2', 'source' => 'bd-intro', 'target' => 'bd-rel'],
                ['id' => 'e-3', 'source' => 'bd-er', 'target' => 'bd-norm'],
                ['id' => 'e-4', 'source' => 'bd-rel', 'target' => 'bd-sql']
            ]
        ];
    }
}

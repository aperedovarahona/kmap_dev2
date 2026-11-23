<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Quiz_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function list_by_node($node_id, $is_student = false) {
        $clean_node_id = is_numeric($node_id) ? (int) $node_id : 1;

        $this->db->where('id_tema_conocimiento', $clean_node_id);
        $q = $this->db->get('evaluacion_quiz');
        $quizzes = $q->result_array();

        if (empty($quizzes)) {
            return [
                [
                    'id_quiz' => 1,
                    'id' => 'quiz-' . $node_id,
                    'titulo_del_quiz' => 'Quiz Diagnóstico de ' . $node_id,
                    'title' => 'Quiz Diagnóstico de ' . $node_id,
                    'tiempo_limite_en_milisegundos' => 600000,
                    'questions_count' => 5
                ]
            ];
        }

        $res = [];
        foreach ($quizzes as $quiz) {
            $res[] = [
                'id_quiz' => $quiz['id_evaluacion_quiz'],
                'id' => 'quiz-' . $quiz['id_evaluacion_quiz'],
                'title' => $quiz['titulo_del_quiz'],
                'titulo_del_quiz' => $quiz['titulo_del_quiz'],
                'tiempo_limite_en_milisegundos' => $quiz['tiempo_limite_en_milisegundos']
            ];
        }
        return $res;
    }

    public function get_quiz_for_taking($quiz_id) {
        $clean_id = is_numeric($quiz_id) ? (int) $quiz_id : 1;
        $q = $this->db->get_where('evaluacion_quiz', ['id_evaluacion_quiz' => $clean_id]);
        $row = $q->row_array();

        $title = $row ? $row['titulo_del_quiz'] : 'Evaluación de Diagnóstico';
        $time_ms = $row ? (int) $row['tiempo_limite_en_milisegundos'] : 600000;

        return [
            'id_quiz' => $clean_id,
            'id' => $quiz_id,
            'title' => $title,
            'titulo_del_quiz' => $title,
            'timeLimitMs' => $time_ms,
            'questions' => [
                [
                    'id' => 'q-1',
                    'text' => '¿Cuál es el concepto central evaluado en este tema?',
                    'options' => [
                        'Fundamento teórico y su estructura conceptual',
                        'Una alternativa incorrecta sin fundamento',
                        'Un concepto no relacionado',
                        'Ninguna de las anteriores'
                    ]
                ]
            ]
        ];
    }

    public function create_quiz($data) {
        $insert = [
            'id_materia_asignatura' => isset($data['id_materia']) ? (int) $data['id_materia'] : 1,
            'id_tema_conocimiento' => isset($data['id_tema']) ? (int) $data['id_tema'] : 1,
            'titulo_del_quiz' => $data['titulo_del_quiz'],
            'tiempo_limite_en_milisegundos' => isset($data['tiempo_limite_en_milisegundos']) ? (int) $data['tiempo_limite_en_milisegundos'] : 600000,
            'esta_habilitado' => 1
        ];

        $this->db->insert('evaluacion_quiz', $insert);
        $id = $this->db->insert_id();

        return [
            'id_quiz' => $id ?: 1,
            'id' => 'quiz-' . ($id ?: 1),
            'title' => $data['titulo_del_quiz']
        ];
    }

    public function update_quiz($quiz_id, $data) {
        $clean_id = is_numeric($quiz_id) ? (int) $quiz_id : 1;
        $update = [];
        if (isset($data['title'])) $update['titulo_del_quiz'] = $data['title'];
        if (isset($data['titulo_del_quiz'])) $update['titulo_del_quiz'] = $data['titulo_del_quiz'];

        if (!empty($update)) {
            $this->db->update('evaluacion_quiz', $update, ['id_evaluacion_quiz' => $clean_id]);
        }
        return ['ok' => true, 'id' => $quiz_id];
    }

    public function delete_quiz($quiz_id) {
        $clean_id = is_numeric($quiz_id) ? (int) $quiz_id : 1;
        return $this->db->delete('evaluacion_quiz', ['id_evaluacion_quiz' => $clean_id]);
    }
}

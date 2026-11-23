<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Quiz_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function get_quiz_by_topic($topic_id) {
        $clean_id = (int) $topic_id;

        $this->db->where('tema_id', $clean_id);
        $this->db->where('activo', 1);
        $q = $this->db->get('preguntas');
        $preguntas = $q->result_array();

        $items = [];
        foreach ($preguntas as $p) {
            $this->db->where('pregunta_id', (int) $p['id']);
            $this->db->order_by('orden', 'ASC');
            $q_opc = $this->db->get('opciones_pregunta');
            $opciones = $q_opc->result_array();

            $opts = [];
            $correctIndex = 0;
            foreach ($opciones as $i => $op) {
                $opts[] = $op['texto'];
                if (!empty($op['es_correcta'])) {
                    $correctIndex = $i;
                }
            }

            $items[] = [
                'id' => (string) $p['id'],
                'topicId' => (string) $clean_id,
                'text' => $p['enunciado'],
                'difficulty' => (int) $p['dificultad'],
                'options' => $opts,
                'answer' => $correctIndex,
                'explanation' => 'Respuesta evaluada por el banco oficial KMAP.'
            ];
        }

        return $items;
    }

    public function submit_attempt($data) {
        $score = isset($data['score']) ? (float) $data['score'] : 0.0;
        $student_id = isset($data['studentId']) ? (int) $data['studentId'] : 3;
        $topic_id = isset($data['topicId']) ? (int) $data['topicId'] : 1;
        $duration = isset($data['durationMs']) ? (int) $data['durationMs'] : 0;
        $aprobado = $score >= 51 ? 1 : 0;

        $this->db->insert('intentos_quiz', [
            'estudiante_id' => $student_id,
            'tema_id' => $topic_id,
            'puntaje' => $score,
            'aprobado' => $aprobado,
            'duracion_ms' => $duration
        ]);

        return [
            'id' => $this->db->insert_id(),
            'score' => $score,
            'passed' => (bool) $aprobado
        ];
    }
}

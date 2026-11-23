<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kmap_model extends CI_Model {

    protected $state_file;

    public function __construct() {
        parent::__construct();
        $this->state_file = APPPATH . '../../backend/data/kmap-state.json';
    }

    public function get_state() {
        if (file_exists($this->state_file)) {
            $json = file_get_contents($this->state_file);
            $data = json_decode($json, true);
            if (is_array($data)) return $data;
        }

        return [
            'users' => [],
            'subjects' => [],
            'topics' => [],
            'edges' => [],
            'questions' => [],
            'enrollments' => [],
            'attempts' => []
        ];
    }

    public function sync_state($state) {
        if (!is_array($state)) return $this->get_state();

        $dir = dirname($this->state_file);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }

        file_put_contents($this->state_file, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $state;
    }

    public function generate_recommendation($payload) {
        $score = isset($payload['score']) ? (int) $payload['score'] : 50;
        $topic_id = isset($payload['topicId']) ? $payload['topicId'] : '';
        $subject_id = isset($payload['subjectId']) ? $payload['subjectId'] : '';
        $answers = isset($payload['answers']) ? $payload['answers'] : [];

        $passed = $score >= 51;

        if ($passed) {
            return [
                'type' => 'success',
                'passed' => true,
                'score' => $score,
                'message' => '¡Felicitaciones! Has aprobado este tema con éxito.',
                'recoveryPath' => [],
                'nextRecommendations' => ['Continúa con el siguiente tema dependiente en el grafo de conocimiento.']
            ];
        }

        // Diagnóstico de tema raíz con dificultades
        $root_cause = 'Fundamentos previos del tema ' . $topic_id;
        if (strpos($topic_id, 'norm') !== false) {
            $root_cause = 'Modelo ER y Dependencias Funcionales';
        } elseif (strpos($topic_id, 'sql') !== false) {
            $root_cause = 'Modelo Relacional y Álgebra Relacional';
        }

        return [
            'type' => 'recovery',
            'passed' => false,
            'score' => $score,
            'rootCauseNode' => $root_cause,
            'message' => "Se identificó que la dificultad principal en este quiz proviene de '{$root_cause}'.",
            'recoveryPath' => [
                ['step' => 1, 'topic' => $root_cause, 'action' => 'Repasar el material de lectura y conceptos clave'],
                ['step' => 2, 'topic' => $topic_id, 'action' => 'Reintentar el quiz diagnóstico tras afianzar los prerrequisitos']
            ],
            'nextRecommendations' => [
                "Revisar el material de estudio asociado al nodo '{$root_cause}'",
                "Resolver los ejercicios prácticos antes de un nuevo intento"
            ]
        ];
    }
}

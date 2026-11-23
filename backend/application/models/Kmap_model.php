<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kmap_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Obtiene el estado consolidado de KMAP directamente desde la base de datos limpia MySQL.
     */
    public function get_state() {
        return [
            'users' => $this->load_users(),
            'subjects' => $this->load_subjects(),
            'topics' => $this->load_topics(),
            'edges' => $this->load_edges(),
            'questions' => $this->load_questions(),
            'enrollments' => $this->load_enrollments(),
            'attempts' => $this->load_attempts()
        ];
    }

    protected function load_users() {
        $users = [];
        $this->db->select('*');
        $this->db->from('usuarios');
        $this->db->where('activo', 1);
        $q = $this->db->get();

        if ($q && $q->num_rows() > 0) {
            foreach ($q->result_array() as $u) {
                $uid = (string) $u['id'];
                $sis = $u['codigo_sis'];
                $users[] = [
                    'id' => $uid,
                    'role' => $u['rol'],
                    'name' => trim($u['nombre'] . ' ' . $u['apellido']),
                    'username' => explode('@', $u['email'])[0],
                    'email' => $u['email'],
                    'carnet' => $sis,
                    'sis' => $sis,
                    'password' => $sis,
                    'altPasswords' => ['123456', 'admin123', '1234567', $sis],
                    'phone' => $u['telefono'],
                    'mustChange' => false
                ];
            }
        }
        return $users;
    }

    protected function load_subjects() {
        $subjects = [];
        $this->db->select('m.*, u.nombre as doc_nom, u.apellido as doc_ape');
        $this->db->from('materias m');
        $this->db->join('usuarios u', 'u.id = m.docente_id', 'left');
        $this->db->where('m.activo', 1);
        $this->db->order_by('m.id', 'ASC');
        $q = $this->db->get();

        if ($q && $q->num_rows() > 0) {
            foreach ($q->result_array() as $m) {
                $docName = trim(($m['doc_nom'] ?? '') . ' ' . ($m['doc_ape'] ?? ''));
                $subjects[] = [
                    'id' => (string) $m['id'],
                    'name' => $m['nombre'],
                    'desc' => $m['descripcion'] ?: 'Explora el grafo de conocimiento.',
                    'icon' => $m['icono'] ?: '📚',
                    'theme' => $m['color_tema'] ?: 'purple',
                    'code' => $m['codigo'],
                    'teacherId' => (string) $m['docente_id'],
                    'teacherName' => $docName ?: 'Docente'
                ];
            }
        }
        return $subjects;
    }

    protected function load_topics() {
        $topics = [];
        $this->db->select('*');
        $this->db->from('temas');
        $this->db->where('activo', 1);
        $this->db->order_by('materia_id, id', 'ASC');
        $q = $this->db->get();

        if ($q && $q->num_rows() > 0) {
            foreach ($q->result_array() as $t) {
                // Materiales
                $materials = [];
                $q_m = $this->db->get_where('materiales', ['tema_id' => $t['id']]);
                if ($q_m && $q_m->num_rows() > 0) {
                    foreach ($q_m->result_array() as $mat) {
                        $materials[] = [
                            'id' => (string) $mat['id'],
                            'title' => $mat['titulo'],
                            'type' => $mat['tipo'],
                            'url' => $mat['url'] ?: '',
                            'content' => $mat['contenido'] ?: ''
                        ];
                    }
                }

                $topics[] = [
                    'id' => (string) $t['id'],
                    'subjectId' => (string) $t['materia_id'],
                    'name' => $t['nombre'],
                    'desc' => $t['descripcion'] ?: '',
                    'minScore' => (int) $t['min_score'],
                    'importance' => (int) $t['importancia'],
                    'x' => (int) $t['pos_x'],
                    'y' => (int) $t['pos_y'],
                    'level' => (int) $t['nivel'],
                    'materials' => $materials
                ];
            }
        }
        return $topics;
    }

    protected function load_edges() {
        $edges = [];
        $this->db->select('*');
        $this->db->from('requisitos_tema');
        $q = $this->db->get();

        if ($q && $q->num_rows() > 0) {
            foreach ($q->result_array() as $r) {
                $edges[] = [
                    'id' => "e-{$r['tema_origen_id']}-{$r['tema_destino_id']}",
                    'from' => (string) $r['tema_origen_id'],
                    'to' => (string) $r['tema_destino_id'],
                    'subjectId' => (string) $r['materia_id']
                ];
            }
        }
        return $edges;
    }

    protected function load_questions() {
        $questions = [];
        $this->db->select('*');
        $this->db->from('preguntas');
        $this->db->where('activo', 1);
        $q = $this->db->get();

        if ($q && $q->num_rows() > 0) {
            foreach ($q->result_array() as $p) {
                $q_ops = $this->db->get_where('opciones_pregunta', ['pregunta_id' => $p['id']]);
                $options = [];
                $correctIndex = 0;
                if ($q_ops && $q_ops->num_rows() > 0) {
                    foreach ($q_ops->result_array() as $i => $op) {
                        $options[] = $op['texto'];
                        if (!empty($op['es_correcta'])) {
                            $correctIndex = $i;
                        }
                    }
                }
                $questions[] = [
                    'id' => (string) $p['id'],
                    'topicId' => (string) $p['tema_id'],
                    'text' => $p['enunciado'],
                    'difficulty' => (int) $p['dificultad'],
                    'options' => $options,
                    'answer' => $correctIndex,
                    'explanation' => 'Evaluado por el banco de preguntas KMAP.'
                ];
            }
        }
        return $questions;
    }

    protected function load_enrollments() {
        $enrollments = [];
        $this->db->select('*');
        $this->db->from('inscripciones');
        $q = $this->db->get();

        if ($q && $q->num_rows() > 0) {
            foreach ($q->result_array() as $im) {
                $enrollments[] = [
                    'id' => (string) $im['id'],
                    'subjectId' => (string) $im['materia_id'],
                    'studentId' => (string) $im['estudiante_id'],
                    'date' => $im['fecha'],
                    'status' => $im['estado']
                ];
            }
        }
        return $enrollments;
    }

    protected function load_attempts() {
        $attempts = [];
        $this->db->select('*');
        $this->db->from('intentos_quiz');
        $this->db->order_by('fecha', 'DESC');
        $q = $this->db->get();

        if ($q && $q->num_rows() > 0) {
            foreach ($q->result_array() as $iq) {
                $score = (float) $iq['puntaje'];
                $attempts[] = [
                    'id' => (string) $iq['id'],
                    'userId' => (string) $iq['estudiante_id'],
                    'topicId' => (string) $iq['tema_id'],
                    'score' => $score,
                    'passed' => (bool) $iq['aprobado'],
                    'date' => $iq['fecha'],
                    'durationMs' => (int) $iq['duracion_ms']
                ];
            }
        }
        return $attempts;
    }

    public function sync_state($state) {
        if (!is_array($state)) return $this->get_state();

        // Si se guardaron nuevos intentos de quiz
        if (!empty($state['attempts']) && is_array($state['attempts'])) {
            foreach ($state['attempts'] as $att) {
                if (!empty($att['isNew'])) {
                    $score = isset($att['score']) ? (float) $att['score'] : 0.0;
                    $student_id = isset($att['userId']) && is_numeric($att['userId']) ? (int) $att['userId'] : 3;
                    $topic_id = isset($att['topicId']) && is_numeric($att['topicId']) ? (int) $att['topicId'] : 1;
                    $duration = isset($att['durationMs']) ? (int) $att['durationMs'] : 0;

                    $this->db->insert('intentos_quiz', [
                        'estudiante_id' => $student_id,
                        'tema_id' => $topic_id,
                        'puntaje' => $score,
                        'aprobado' => $score >= 51 ? 1 : 0,
                        'duracion_ms' => $duration,
                        'fecha' => $att['date'] ?? date('Y-m-d H:i:s')
                    ]);
                }
            }
        }

        // Si se inscribió a materias
        if (!empty($state['enrollments']) && is_array($state['enrollments'])) {
            foreach ($state['enrollments'] as $en) {
                if (!empty($en['isNew'])) {
                    $subId = isset($en['subjectId']) ? (int) $en['subjectId'] : 0;
                    $stuId = isset($en['studentId']) ? (int) $en['studentId'] : 0;
                    if ($subId > 0 && $stuId > 0) {
                        $this->db->insert_ignore('inscripciones', [
                            'materia_id' => $subId,
                            'estudiante_id' => $stuId,
                            'estado' => 'activo'
                        ]);
                    }
                }
            }
        }

        return $this->get_state();
    }

    public function generate_recommendation($payload) {
        $score = isset($payload['score']) ? (int) $payload['score'] : 50;
        $topic_id = isset($payload['topicId']) ? $payload['topicId'] : '1';

        if ($score >= 51) {
            return [
                'type' => 'success',
                'passed' => true,
                'score' => $score,
                'message' => '¡Excelente! Has dominado el nodo y desbloqueado el siguiente contenido.',
                'recoveryPath' => [],
                'nextRecommendations' => ['Avanza al siguiente nodo en la ruta del grafo.']
            ];
        }

        return [
            'type' => 'recovery',
            'passed' => false,
            'score' => $score,
            'rootCauseNode' => 'Prerrequisitos del tema ' . $topic_id,
            'message' => 'Detectamos vacíos conceptuales en los fundamentos de este tema.',
            'recoveryPath' => [
                ['step' => 1, 'topic' => 'Conceptos base', 'action' => 'Repasar el material didáctico'],
                ['step' => 2, 'topic' => 'Evaluación formativa', 'action' => 'Reintentar el quiz adaptativo']
            ],
            'nextRecommendations' => ['Consulta el material de estudio antes del próximo intento.']
        ];
    }
}

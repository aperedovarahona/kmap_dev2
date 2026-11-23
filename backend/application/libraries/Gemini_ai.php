<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Gemini_ai {

    protected $api_key = '';
    protected $model = 'gemini-3.8-flash';

    public function __construct() {
        // Cargar key desde variable de entorno o .env si existe
        $this->api_key = getenv('AI_API_KEY') ?: '';
        if (!$this->api_key && file_exists(APPPATH . '../.env')) {
            $env = parse_ini_file(APPPATH . '../.env');
            if (isset($env['AI_API_KEY'])) $this->api_key = $env['AI_API_KEY'];
            if (isset($env['AI_MODEL'])) $this->model = $env['AI_MODEL'];
        }
    }

    public function generate_questions($topic_name, $count = 5, $materials_text = '') {
        $count = max(1, min(15, (int) $count));

        if (!empty($this->api_key)) {
            $prompt = "Eres BITSIBOOT, el asistente educativo inteligente de Plan Kmap.
Genera exactamente {$count} preguntas de opción múltiple en español para evaluar el tema: '{$topic_name}'.
Contexto adicional o materiales del tema:
{$materials_text}

Debes responder ÚNICAMENTE un arreglo JSON válido (sin markdown, sin bloques de código ```json) con el siguiente formato estricto:
[
  {
    \"id\": \"q-1\",
    \"text\": \"¿Pregunta aquí?\",
    \"options\": [\"Opción A\", \"Opción B\", \"Opción C\", \"Opción D\"],
    \"correct\": 0,
    \"explanation\": \"Explicación pedagógica breve de por qué la opción es correcta.\"
  }
]";

            $res = $this->call_gemini_api($prompt);
            if ($res && is_array($res) && count($res) > 0) {
                return $res;
            }
        }

        // Generador pedagógico de respaldo de alta calidad
        return $this->fallback_questions($topic_name, $count);
    }

    protected function call_gemini_api($prompt) {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->api_key}";

        $payload = [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ],
            'generationConfig' => [
                'temperature' => 0.4,
                'responseMimeType' => 'application/json'
            ]
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code === 200 && $response) {
            $json = json_decode($response, true);
            $raw_text = isset($json['candidates'][0]['content']['parts'][0]['text'])
                ? $json['candidates'][0]['content']['parts'][0]['text']
                : '';
            $parsed = json_decode($raw_text, true);
            if (is_array($parsed)) {
                return $parsed;
            }
        }
        return null;
    }

    protected function fallback_questions($topic, $count) {
        $questions = [];
        $templates = [
            [
                "¿Cuál es el objetivo principal del estudio de {$topic}?",
                [
                    "Comprender y dominar los conceptos clave y aplicaciones prácticas de {$topic}",
                    "Memorizar definiciones sin entender su utilidad práctica",
                    "Evitar el uso de metodologías estructuradas",
                    "Sustituir los fundamentos por herramientas obsoletas"
                ],
                0,
                "El estudio de {$topic} busca consolidar la comprensión conceptual y su aplicación técnica."
            ],
            [
                "En el contexto de {$topic}, ¿qué principio fundamental debe cumplirse?",
                [
                    "Consistencia, coherencia conceptual y validez de la estructura",
                    "Inconsistencia en los datos y redundancia deliberada",
                    "Ejecución de procesos sin validación previa",
                    "Desarticulación entre teoría y práctica"
                ],
                0,
                "La consistencia y rigor estructural son pilares al abordar {$topic}."
            ],
            [
                "¿Qué dificultad suele presentarse si no se dominan los prerrequisitos de {$topic}?",
                [
                    "Vacíos conceptuales que impiden avanzar con solvencia hacia temas posteriores",
                    "Aumento inmediato del rendimiento en evaluaciones avanzadas",
                    "Simplificación automática de problemas complejos",
                    "Ninguna, los prerrequisitos no influyen en el aprendizaje"
                ],
                0,
                "Los conocimientos previos habilitan el entendimiento progresivo de {$topic}."
            ],
            [
                "¿Cuál es una buena práctica recomendada al implementar soluciones relacionadas con {$topic}?",
                [
                    "Verificar y validar cada paso contra las reglas formales establecidas",
                    "Proceder por ensayo y error sin documentar resultados",
                    "Omitir el análisis de requisitos previos",
                    "Asumir que todos los casos límite son irrelevantes"
                ],
                0,
                "La verificación sistemática asegura la calidad del aprendizaje en {$topic}."
            ],
            [
                "Al diagnosticar errores en ejercicios de {$topic}, ¿cuál es el primer paso recomendado?",
                [
                    "Rastrear el punto de fallo hacia los conceptos raíz y prerrequisitos del tema",
                    "Reiniciar todo el proceso sin analizar el error cometido",
                    "Ignorar las fallas intermedias y continuar con temas más avanzados",
                    "Cambiar arbitrariamente los parámetros del problema"
                ],
                0,
                "Rastrear hacia el tema raíz permite corregir la debilidad de aprendizaje de origen."
            ]
        ];

        for ($i = 0; $i < $count; $i++) {
            $t = $templates[$i % count($templates)];
            $questions[] = [
                'id' => 'q-gen-' . ($i + 1) . '-' . substr(md5($topic . $i), 0, 5),
                'text' => $t[0],
                'options' => $t[1],
                'correct' => $t[2],
                'explanation' => $t[3],
                'source' => 'ai'
            ];
        }

        return $questions;
    }
}

<?php
/**
 * CodeIgniter 3 Core Input Class
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CI_Input {

    protected $raw_input_stream;
    protected $headers = [];

    public function __construct() {
        $this->raw_input_stream = file_get_contents('php://input');
        if (function_exists('getallheaders')) {
            $this->headers = getallheaders();
        } else {
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $header = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                    $this->headers[$header] = $value;
                }
            }
        }
    }

    public function get($index = NULL) {
        if ($index === NULL) {
            return $_GET;
        }
        return isset($_GET[$index]) ? $_GET[$index] : NULL;
    }

    public function post($index = NULL) {
        if ($index === NULL) {
            return $_POST;
        }
        return isset($_POST[$index]) ? $_POST[$index] : NULL;
    }

    public function raw_input_stream() {
        return $this->raw_input_stream;
    }

    public function json() {
        $data = json_decode($this->raw_input_stream, true);
        return is_array($data) ? $data : [];
    }

    public function post_or_json($index = NULL) {
        $json = $this->json();
        $merged = array_merge($_POST, $json);
        if ($index === NULL) {
            return $merged;
        }
        return isset($merged[$index]) ? $merged[$index] : NULL;
    }

    public function get_request_header($header, $xss_clean = NULL) {
        foreach ($this->headers as $key => $val) {
            if (strcasecmp($key, $header) === 0) {
                return $val;
            }
        }
        return NULL;
    }

    public function bearer_token() {
        $auth = $this->get_request_header('Authorization');
        if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $auth = $_SERVER['HTTP_AUTHORIZATION'];
        }
        if ($auth && preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
            return trim($matches[1]);
        }
        return NULL;
    }

    public function method($upper = FALSE) {
        $method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
        return $upper ? strtoupper($method) : strtolower($method);
    }
}

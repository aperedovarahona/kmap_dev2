<?php
/**
 * CodeIgniter 3 Core Output Class
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CI_Output {

    protected $status_code = 200;
    protected $content_type = 'text/html';
    protected $output_data = '';
    protected $headers = [];

    public function set_status_header($code = 200, $text = '') {
        $this->status_code = (int) $code;
        return $this;
    }

    public function get_status_code() {
        return $this->status_code;
    }

    public function set_content_type($mime_type, $charset = NULL) {
        if ($mime_type === 'application/json') {
            $this->content_type = 'application/json; charset=utf-8';
        } else {
            $this->content_type = $mime_type . ($charset ? '; charset=' . $charset : '');
        }
        return $this;
    }

    public function set_header($header, $replace = TRUE) {
        $this->headers[] = [$header, $replace];
        return $this;
    }

    public function set_output($output) {
        $this->output_data = $output;
        return $this;
    }

    public function get_output() {
        return $this->output_data;
    }

    public function json($data, $status_code = 200) {
        $this->set_status_header($status_code);
        $this->set_content_type('application/json');
        $this->set_output(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        return $this;
    }

    public function _display() {
        http_response_code($this->status_code);
        header('Content-Type: ' . $this->content_type);
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

        foreach ($this->headers as $h) {
            header($h[0], $h[1]);
        }

        echo $this->output_data;
    }
}

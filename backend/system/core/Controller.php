<?php
/**
 * CodeIgniter 3 Core Controller
 */
defined('BASEPATH') OR exit('No direct script access allowed');

#[\AllowDynamicProperties]
class CI_Controller {

    private static $instance;
    public $load;
    public $input;
    public $output;
    public $db;

    public function __construct() {
        self::$instance =& $this;
        $this->load = new CI_Loader();
        $this->input = new CI_Input();
        $this->output = new CI_Output();

        // Autocargar base de datos
        $this->load->database();
    }

    public static function &get_instance() {
        return self::$instance;
    }
}

function &get_instance() {
    return CI_Controller::get_instance();
}


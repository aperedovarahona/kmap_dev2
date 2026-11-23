<?php
/**
 * CodeIgniter 3 Core Loader Class
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CI_Loader {

    protected $_ci_models = [];
    protected $_ci_libraries = [];

    public function model($model, $name = '', $db_conn = FALSE) {
        if (empty($model)) return $this;

        $model_name = empty($name) ? $model : $name;
        $class_name = ucfirst($model);

        if (isset($this->_ci_models[$model_name])) {
            return $this;
        }

        $file_path = APPPATH . 'models/' . $class_name . '.php';
        if (!file_exists($file_path)) {
            // Try lower case file name
            $file_path = APPPATH . 'models/' . strtolower($class_name) . '.php';
        }

        if (file_exists($file_path)) {
            require_once $file_path;
            $CI =& get_instance();
            $CI->$model_name = new $class_name();
            $this->_ci_models[$model_name] = $CI->$model_name;
        } else {
            throw new Exception("No se encontró el modelo: {$class_name} en {$file_path}");
        }

        return $this;
    }

    public function library($library, $params = NULL, $object_name = NULL) {
        if (empty($library)) return $this;

        $lib_name = empty($object_name) ? strtolower($library) : $object_name;
        $class_name = ucfirst($library);

        if (isset($this->_ci_libraries[$lib_name])) {
            return $this;
        }

        $file_path = APPPATH . 'libraries/' . $class_name . '.php';
        if (file_exists($file_path)) {
            require_once $file_path;
            $CI =& get_instance();
            $CI->$lib_name = $params !== NULL ? new $class_name($params) : new $class_name();
            $this->_ci_libraries[$lib_name] = $CI->$lib_name;
        }

        return $this;
    }

    public function database($params = '', $return = FALSE, $query_builder = NULL) {
        $CI =& get_instance();
        require_once BASEPATH . 'database/DB.php';
        $db = DB($params, $query_builder);
        if ($return === TRUE) {
            return $db;
        }
        $CI->db = $db;
        return $this;
    }

    public function helper($helper) {
        // Carga de helpers opcionales
        return $this;
    }
}

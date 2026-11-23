<?php
/**
 * CodeIgniter 3 Query Builder Implementation (PDO / MySQLi Compatible)
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class CI_DB_result {
    protected $data = [];
    protected $num_rows = 0;

    public function __construct($data = []) {
        $this->data = is_array($data) ? $data : [];
        $this->num_rows = count($this->data);
    }

    public function result() {
        $objects = [];
        foreach ($this->data as $row) {
            $objects[] = (object) $row;
        }
        return $objects;
    }

    public function result_array() {
        return $this->data;
    }

    public function row($index = 0) {
        $arr = $this->row_array($index);
        return $arr ? (object) $arr : NULL;
    }

    public function row_array($index = 0) {
        if (!isset($this->data[$index])) {
            return NULL;
        }
        return $this->data[$index];
    }

    public function num_rows() {
        return $this->num_rows;
    }
}

class CI_DB_query_builder {
    protected $config;
    protected $pdo = null;
    protected $connected = false;
    protected $error_message = '';

    // Query builder state
    protected $ar_select = [];
    protected $ar_from = '';
    protected $ar_join = [];
    protected $ar_where = [];
    protected $ar_order_by = [];
    protected $ar_limit = null;
    protected $ar_offset = null;
    protected $last_insert_id = 0;
    protected $last_query = '';

    public function __construct($config = []) {
        $this->config = $config;
        $this->connect();
    }

    public function connect() {
        $host = isset($this->config['hostname']) ? $this->config['hostname'] : 'localhost';
        $user = isset($this->config['username']) ? $this->config['username'] : 'root';
        $pass = isset($this->config['password']) ? $this->config['password'] : '';
        $dbname = isset($this->config['database']) ? $this->config['database'] : 'kmap';
        $charset = isset($this->config['char_set']) ? $this->config['char_set'] : 'utf8mb4';

        try {
            $dsn = "mysql:host={$host};dbname={$dbname};charset={$charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 2
            ];
            $this->pdo = new PDO($dsn, $user, $pass, $options);
            $this->connected = true;
        } catch (PDOException $e) {
            // Intentar conectar sin seleccionar db para crearla si no existe
            try {
                $dsn_no_db = "mysql:host={$host};charset={$charset}";
                $pdo_temp = new PDO($dsn_no_db, $user, $pass, [PDO::ATTR_TIMEOUT => 2]);
                $pdo_temp->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                $this->pdo = new PDO($dsn, $user, $pass, $options);
                $this->connected = true;
            } catch (Exception $ex) {
                $this->connected = false;
                $this->error_message = $e->getMessage();
            }
        }
    }

    public function is_connected() {
        return $this->connected;
    }

    public function get_error() {
        return $this->error_message;
    }

    public function select($select = '*') {
        if (is_string($select)) {
            $this->ar_select[] = $select;
        } elseif (is_array($select)) {
            $this->ar_select = array_merge($this->ar_select, $select);
        }
        return $this;
    }

    public function from($table) {
        $this->ar_from = $table;
        return $this;
    }

    public function join($table, $cond, $type = '') {
        $type = strtoupper(trim($type));
        $this->ar_join[] = "{$type} JOIN {$table} ON {$cond}";
        return $this;
    }

    public function where($key, $value = NULL) {
        if (is_array($key)) {
            foreach ($key as $k => $v) {
                $this->where($k, $v);
            }
            return $this;
        }
        if ($value === NULL) {
            $this->ar_where[] = $key;
        } else {
            $this->ar_where[] = [$key, $value, 'AND'];
        }
        return $this;
    }

    public function or_where($key, $value = NULL) {
        if ($value === NULL) {
            $this->ar_where[] = $key;
        } else {
            $this->ar_where[] = [$key, $value, 'OR'];
        }
        return $this;
    }

    public function where_in($key, $values = []) {
        if (empty($values)) {
            $this->ar_where[] = "1=0";
            return $this;
        }
        $escaped = [];
        foreach ($values as $v) {
            $escaped[] = is_numeric($v) ? $v : "'" . addslashes($v) . "'";
        }
        $this->ar_where[] = "{$key} IN (" . implode(',', $escaped) . ")";
        return $this;
    }

    public function order_by($orderby, $direction = '') {
        $dir = strtoupper(trim($direction));
        $this->ar_order_by[] = $orderby . ($dir ? ' ' . $dir : '');
        return $this;
    }

    public function limit($value, $offset = 0) {
        $this->ar_limit = (int) $value;
        if ($offset) {
            $this->ar_offset = (int) $offset;
        }
        return $this;
    }

    protected function build_where() {
        if (empty($this->ar_where)) return '';
        $sql = '';
        foreach ($this->ar_where as $i => $cond) {
            if (is_string($cond)) {
                $clause = $cond;
                $logic = 'AND';
            } else {
                list($k, $v, $logic) = $cond;
                $operator = '=';
                $clean_key = trim($k);
                if (preg_match('/([<>=!]+)$/', $clean_key, $m)) {
                    $operator = $m[1];
                    $clean_key = trim(substr($clean_key, 0, -strlen($operator)));
                }
                $escaped_val = is_numeric($v) ? $v : "'" . addslashes($v) . "'";
                $clause = "{$clean_key} {$operator} {$escaped_val}";
            }

            if ($i === 0) {
                $sql .= " WHERE {$clause}";
            } else {
                $sql .= " {$logic} {$clause}";
            }
        }
        return $sql;
    }

    protected function reset_select() {
        $this->ar_select = [];
        $this->ar_from = '';
        $this->ar_join = [];
        $this->ar_where = [];
        $this->ar_order_by = [];
        $this->ar_limit = null;
        $this->ar_offset = null;
    }

    public function get($table = '', $limit = null, $offset = null) {
        if ($table) {
            $this->from($table);
        }
        if ($limit !== null) {
            $this->limit($limit, $offset);
        }

        $select = empty($this->ar_select) ? '*' : implode(', ', $this->ar_select);
        $sql = "SELECT {$select} FROM {$this->ar_from}";

        if (!empty($this->ar_join)) {
            $sql .= ' ' . implode(' ', $this->ar_join);
        }

        $sql .= $this->build_where();

        if (!empty($this->ar_order_by)) {
            $sql .= ' ORDER BY ' . implode(', ', $this->ar_order_by);
        }

        if ($this->ar_limit !== null) {
            $sql .= " LIMIT {$this->ar_limit}";
            if ($this->ar_offset !== null) {
                $sql .= " OFFSET {$this->ar_offset}";
            }
        }

        $this->reset_select();
        return $this->query($sql);
    }

    public function get_where($table, $where = [], $limit = null, $offset = null) {
        $this->where($where);
        return $this->get($table, $limit, $offset);
    }

    public function query($sql, $params = []) {
        $this->last_query = $sql;
        if (!$this->connected || !$this->pdo) {
            // Retornar resultado vacío si la base de datos está desconectada
            return new CI_DB_result([]);
        }

        try {
            if (empty($params)) {
                $stmt = $this->pdo->query($sql);
            } else {
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($params);
            }

            if ($stmt && strncasecmp(trim($sql), 'SELECT', 6) === 0 || strncasecmp(trim($sql), 'SHOW', 4) === 0) {
                $rows = $stmt->fetchAll();
                return new CI_DB_result($rows);
            }
            return TRUE;
        } catch (PDOException $e) {
            $this->error_message = $e->getMessage();
            return new CI_DB_result([]);
        }
    }

    public function insert($table, $data = []) {
        if (empty($data)) return false;

        $fields = array_keys($data);
        $escaped_fields = array_map(function($f) { return "`{$f}`"; }, $fields);
        $placeholders = array_fill(0, count($fields), '?');

        $sql = "INSERT INTO `{$table}` (" . implode(', ', $escaped_fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
        $this->last_query = $sql;

        if (!$this->connected || !$this->pdo) {
            $this->last_insert_id = rand(100, 9999);
            return true;
        }

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(array_values($data));
            $this->last_insert_id = (int) $this->pdo->lastInsertId();
            return true;
        } catch (PDOException $e) {
            $this->error_message = $e->getMessage();
            return false;
        }
    }

    public function insert_id() {
        return $this->last_insert_id;
    }

    public function update($table, $data = [], $where = []) {
        if (!empty($where)) {
            $this->where($where);
        }

        $sets = [];
        $values = [];
        foreach ($data as $k => $v) {
            $sets[] = "`{$k}` = ?";
            $values[] = $v;
        }

        $sql = "UPDATE `{$table}` SET " . implode(', ', $sets);
        $sql .= $this->build_where();
        $this->reset_select();
        $this->last_query = $sql;

        if (!$this->connected || !$this->pdo) {
            return true;
        }

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($values);
            return true;
        } catch (PDOException $e) {
            $this->error_message = $e->getMessage();
            return false;
        }
    }

    public function delete($table, $where = []) {
        if (!empty($where)) {
            $this->where($where);
        }

        $sql = "DELETE FROM `{$table}`";
        $sql .= $this->build_where();
        $this->reset_select();
        $this->last_query = $sql;

        if (!$this->connected || !$this->pdo) {
            return true;
        }

        try {
            $this->pdo->exec($sql);
            return true;
        } catch (PDOException $e) {
            $this->error_message = $e->getMessage();
            return false;
        }
    }

    public function count_all_results($table = '') {
        if ($table) {
            $this->from($table);
        }
        $res = $this->select('COUNT(*) as total')->get();
        $row = $res->row();
        return $row ? (int) $row->total : 0;
    }

    public function trans_start() {
        if ($this->connected && $this->pdo) {
            try { $this->pdo->beginTransaction(); } catch (Exception $e) {}
        }
    }

    public function trans_complete() {
        if ($this->connected && $this->pdo) {
            try { $this->pdo->commit(); } catch (Exception $e) {}
        }
    }

    public function trans_rollback() {
        if ($this->connected && $this->pdo) {
            try { $this->pdo->rollBack(); } catch (Exception $e) {}
        }
    }

    public function last_query() {
        return $this->last_query;
    }
}

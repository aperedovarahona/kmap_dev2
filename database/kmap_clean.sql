-- ============================================================
-- BASE DE DATOS LIMPIA Y OPTIMIZADA: KMAP V2
-- Adaptada al avance actual de la plataforma educativa KMAP
-- ============================================================

CREATE DATABASE IF NOT EXISTS kmap
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kmap;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS intentos_quiz;
DROP TABLE IF EXISTS opciones_pregunta;
DROP TABLE IF EXISTS preguntas;
DROP TABLE IF EXISTS materiales;
DROP TABLE IF EXISTS requisitos_tema;
DROP TABLE IF EXISTS temas;
DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS materias;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- 1. USUARIOS
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    rol ENUM('admin', 'docente', 'estudiante') NOT NULL DEFAULT 'estudiante',
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    codigo_sis VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(30) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_usuario_rol (rol),
    KEY idx_usuario_email (email),
    KEY idx_usuario_sis (codigo_sis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. MATERIAS
-- ------------------------------------------------------------
CREATE TABLE materias (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    docente_id BIGINT UNSIGNED NOT NULL,
    icono VARCHAR(50) DEFAULT '📚',
    color_tema VARCHAR(30) DEFAULT 'purple',
    activo TINYINT(1) NOT NULL DEFAULT 1,
    anticopia_activa TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_materia_docente (docente_id),
    CONSTRAINT fk_materias_docente FOREIGN KEY (docente_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. INSCRIPCIONES
-- ------------------------------------------------------------
CREATE TABLE inscripciones (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    materia_id BIGINT UNSIGNED NOT NULL,
    estudiante_id BIGINT UNSIGNED NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'completado', 'retirado') NOT NULL DEFAULT 'activo',
    PRIMARY KEY (id),
    UNIQUE KEY uq_inscripcion (materia_id, estudiante_id),
    KEY idx_inscripcion_estudiante (estudiante_id),
    CONSTRAINT fk_insc_materia FOREIGN KEY (materia_id)
        REFERENCES materias(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_insc_estudiante FOREIGN KEY (estudiante_id)
        REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. TEMAS (NODOS DEL GRAFO DE CONOCIMIENTO)
-- ------------------------------------------------------------
CREATE TABLE temas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    materia_id BIGINT UNSIGNED NOT NULL,
    nombre VARCHAR(180) NOT NULL,
    descripcion TEXT NULL,
    pos_x INT NOT NULL DEFAULT 100,
    pos_y INT NOT NULL DEFAULT 100,
    nivel INT NOT NULL DEFAULT 1,
    min_score INT NOT NULL DEFAULT 51,
    importancia INT NOT NULL DEFAULT 1,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY idx_temas_materia (materia_id),
    CONSTRAINT fk_temas_materia FOREIGN KEY (materia_id)
        REFERENCES materias(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. REQUISITOS (ARISTAS DE DEPENDENCIA DEL GRAFO)
-- ------------------------------------------------------------
CREATE TABLE requisitos_tema (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    materia_id BIGINT UNSIGNED NOT NULL,
    tema_origen_id BIGINT UNSIGNED NOT NULL,
    tema_destino_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_requisito (tema_origen_id, tema_destino_id),
    KEY idx_req_materia (materia_id),
    CONSTRAINT fk_req_materia FOREIGN KEY (materia_id)
        REFERENCES materias(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_req_origen FOREIGN KEY (tema_origen_id)
        REFERENCES temas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_req_destino FOREIGN KEY (tema_destino_id)
        REFERENCES temas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. MATERIALES DE ESTUDIO
-- ------------------------------------------------------------
CREATE TABLE materiales (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tema_id BIGINT UNSIGNED NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    tipo ENUM('texto', 'enlace', 'archivo') NOT NULL DEFAULT 'texto',
    url VARCHAR(500) NULL,
    contenido MEDIUMTEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_mat_tema (tema_id),
    CONSTRAINT fk_mat_tema FOREIGN KEY (tema_id)
        REFERENCES temas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. BANCO DE PREGUNTAS
-- ------------------------------------------------------------
CREATE TABLE preguntas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tema_id BIGINT UNSIGNED NOT NULL,
    enunciado TEXT NOT NULL,
    dificultad TINYINT UNSIGNED NOT NULL DEFAULT 1,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY idx_preg_tema (tema_id),
    CONSTRAINT fk_preg_tema FOREIGN KEY (tema_id)
        REFERENCES temas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. OPCIONES DE RESPUESTA
-- ------------------------------------------------------------
CREATE TABLE opciones_pregunta (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    pregunta_id BIGINT UNSIGNED NOT NULL,
    texto VARCHAR(1000) NOT NULL,
    es_correcta TINYINT(1) NOT NULL DEFAULT 0,
    orden INT UNSIGNED NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY idx_opc_pregunta (pregunta_id),
    CONSTRAINT fk_opc_pregunta FOREIGN KEY (pregunta_id)
        REFERENCES preguntas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. INTENTOS Y EVALUACIONES DE ESTUDIANTES
-- ------------------------------------------------------------
CREATE TABLE intentos_quiz (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    estudiante_id BIGINT UNSIGNED NOT NULL,
    tema_id BIGINT UNSIGNED NOT NULL,
    puntaje DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    aprobado TINYINT(1) NOT NULL DEFAULT 0,
    duracion_ms INT UNSIGNED NOT NULL DEFAULT 0,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_int_estudiante (estudiante_id),
    KEY idx_int_tema (tema_id),
    CONSTRAINT fk_int_estudiante FOREIGN KEY (estudiante_id)
        REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_int_tema FOREIGN KEY (tema_id)
        REFERENCES temas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEMILLAS DE DATOS INICIALES (DEMO Y REALES)
-- ============================================================

-- Usuarios base del sistema
INSERT INTO usuarios (id, rol, nombre, apellido, email, codigo_sis, password_hash, telefono) VALUES
(1, 'admin', 'Administrador', 'KMAP', 'admin@demo.com', 'admin', '$2b$12$demoAdminHashKey00000001', '+59170000001'),
(2, 'docente', 'Prof. Carlos', 'Rivera', 'docente@demo.com', '1234567', '$2b$12$demoDocenteHashKey00000002', '+59170000002'),
(3, 'estudiante', 'Jhoselyn', 'Lopez', 'estudiante@demo.com', '202012345', '$2b$12$demoEstudianteHashKey0003', '+59170000003'),
(4, 'estudiante', 'Ana', 'Torres', 'ana.torres@est.umss.edu', '202100001', '$2b$12$demoEstudianteHashKey0004', '+59170000004'),
(5, 'estudiante', 'Carlos', 'Mendez', 'carlos.mendez@est.umss.edu', '202100002', '$2b$12$demoEstudianteHashKey0005', '+59170000005'),
(6, 'estudiante', 'Maria', 'Lopez', 'maria.lopez@est.umss.edu', '202100003', '$2b$12$demoEstudianteHashKey0006', '+59170000006');

-- Materias
INSERT INTO materias (id, nombre, codigo, descripcion, docente_id, icono, color_tema) VALUES
(1, 'Bases de Datos', 'BDD3K9', 'Explora el grafo de conocimiento y avanza por los temas de modelado relacional y SQL.', 2, '🗄️', 'purple'),
(2, 'Programación I', 'PRG4M9', 'Lógica algorítmica, estructuras de control, funciones y programación modular.', 2, '</>', 'blue'),
(3, 'Álgebra Lineal', 'ALG2K1', 'Vectores en Rn, matrices, sistemas de ecuaciones lineales y transformaciones.', 2, '📐', 'amber');

-- Inscripciones
INSERT INTO inscripciones (materia_id, estudiante_id, estado) VALUES
(1, 3, 'activo'), (2, 3, 'activo'), (3, 3, 'activo'),
(1, 4, 'activo'), (2, 4, 'activo'),
(1, 5, 'activo'), (3, 5, 'activo'),
(2, 6, 'activo'), (3, 6, 'activo');

-- Temas para Materia 1: Bases de Datos
INSERT INTO temas (id, materia_id, nombre, descripcion, pos_x, pos_y, nivel, min_score, importancia) VALUES
(1, 1, 'Modelo Entidad-Relación', 'Conceptos fundamentales de entidades, atributos, cardinalidades y diagramas ER.', 80, 80, 1, 51, 1),
(2, 1, 'Modelo Relacional', 'Transformación del diagrama ER a tablas relacionales, claves primarias y foráneas.', 320, 80, 2, 51, 1),
(3, 1, 'Álgebra Relacional', 'Operaciones formales de selección, proyección, unión, diferencia y producto cartesiano.', 80, 230, 2, 51, 2),
(4, 1, 'Normalización (1FN, 2FN, 3FN)', 'Formas normales para eliminar redundancias y anomalías de actualización.', 320, 230, 3, 51, 2),
(5, 1, 'SQL DDL y DML', 'Definición y manipulación de datos con CREATE, ALTER, INSERT, UPDATE y DELETE.', 560, 150, 3, 51, 3),
(6, 1, 'Consultas Complejas y JOINs', 'Subconsultas correlacionadas, INNER JOIN, LEFT JOIN, GROUP BY y HAVING.', 560, 300, 4, 51, 3);

-- Requisitos para Materia 1 (Aristas)
INSERT INTO requisitos_tema (materia_id, tema_origen_id, tema_destino_id) VALUES
(1, 1, 2),
(1, 2, 3),
(1, 2, 4),
(1, 3, 5),
(1, 4, 5),
(1, 5, 6);

-- Temas para Materia 2: Programación I
INSERT INTO temas (id, materia_id, nombre, descripcion, pos_x, pos_y, nivel, min_score, importancia) VALUES
(7, 2, 'Algoritmos y Pseudocódigo', 'Conceptos de algoritmo, variables, tipos de datos primitivos y operadores.', 80, 80, 1, 51, 1),
(8, 2, 'Estructuras Condicionales', 'Instrucciones if-else, operadores lógicos y switch-case.', 320, 80, 2, 51, 1),
(9, 2, 'Estructuras Repetitivas', 'Bucles while, for y do-while con contadores y acumuladores.', 560, 80, 3, 51, 2),
(10, 2, 'Funciones y Alcance', 'Modularización, paso de parámetros por valor y referencia, y retorno de valores.', 320, 230, 3, 51, 2),
(11, 2, 'Arreglos y Matrices', 'Vectores unidimensionales y matrices bidimensionales.', 560, 230, 4, 51, 3);

-- Requisitos para Materia 2
INSERT INTO requisitos_tema (materia_id, tema_origen_id, tema_destino_id) VALUES
(2, 7, 8),
(2, 8, 9),
(2, 8, 10),
(2, 9, 11),
(2, 10, 11);

-- Temas para Materia 3: Álgebra Lineal
INSERT INTO temas (id, materia_id, nombre, descripcion, pos_x, pos_y, nivel, min_score, importancia) VALUES
(12, 3, 'Sistemas de Ecuaciones Lineales', 'Método de eliminación de Gauss y Gauss-Jordan.', 80, 80, 1, 51, 1),
(13, 3, 'Operaciones con Matrices', 'Suma, multiplicación de matrices, matriz inversa y determinantes.', 320, 80, 2, 51, 2),
(14, 3, 'Espacios Vectoriales', 'Combinaciones lineales, dependencia e independencia lineal y bases.', 560, 80, 3, 51, 3);

-- Requisitos para Materia 3
INSERT INTO requisitos_tema (materia_id, tema_origen_id, tema_destino_id) VALUES
(3, 12, 13),
(3, 13, 14);

-- Materiales didácticos
INSERT INTO materiales (tema_id, titulo, tipo, contenido) VALUES
(1, 'Guía de Modelado Entidad-Relación', 'texto', 'El modelo entidad-relación permite representar el mundo real mediante entidades y sus interconexiones.'),
(2, 'Transformación a Esquema Relacional', 'texto', 'Reglas para convertir entidades fuertes, débiles y relaciones 1:N o M:N a tablas.'),
(5, 'Sintaxis SQL Esencial', 'texto', 'Comandos clave: SELECT campos FROM tabla WHERE condicion ORDER BY campo ASC;');

-- Preguntas y Opciones de evaluación
INSERT INTO preguntas (id, tema_id, enunciado, dificultad) VALUES
(1, 1, '¿Qué representa un rombo en un diagrama Entidad-Relación estándar?', 1),
(2, 1, '¿Qué tipo de atributo se representa comúnmente con un doble óvalo?', 2),
(3, 2, '¿Qué es una clave foránea (Foreign Key)?', 1),
(4, 4, '¿Cuál es el requisito indispensable para que una relación esté en Primera Forma Normal (1FN)?', 2),
(5, 5, '¿Qué cláusula SQL se utiliza para filtrar grupos de resultados agregados?', 2);

INSERT INTO opciones_pregunta (pregunta_id, texto, es_correcta, orden) VALUES
(1, 'Una relación entre dos o más entidades', 1, 1),
(1, 'Una entidad fuerte', 0, 2),
(1, 'Un atributo derivado', 0, 3),
(1, 'Una clave primaria', 0, 4),

(2, 'Un atributo multivalorado', 1, 1),
(2, 'Un atributo identificador principal', 0, 2),
(2, 'Un atributo compuesto', 0, 3),
(2, 'Una entidad débil', 0, 4),

(3, 'Un atributo que referencia la clave primaria de otra tabla', 1, 1),
(3, 'Una clave que no puede repetirse en la misma tabla', 0, 2),
(3, 'Un índice exclusivo para ordenar registros', 0, 3),
(3, 'Un valor nulo obligatorio', 0, 4),

(4, 'Todos los atributos deben contener valores atómicos e indivisibles', 1, 1),
(4, 'No deben existir dependencias transitivas', 0, 2),
(4, 'Todos los atributos no clave deben depender de la clave primaria completa', 0, 3),
(4, 'Debe tener al menos tres claves candidatas', 0, 4),

(5, 'HAVING', 1, 1),
(5, 'WHERE', 0, 2),
(5, 'GROUP BY', 0, 3),
(5, 'ORDER BY', 0, 4);

-- Intentos de evaluación iniciales para progreso
INSERT INTO intentos_quiz (estudiante_id, tema_id, puntaje, aprobado, duracion_ms) VALUES
(3, 1, 95.00, 1, 45000),
(3, 2, 85.00, 1, 52000),
(4, 1, 90.00, 1, 48000),
(5, 1, 40.00, 0, 39000);

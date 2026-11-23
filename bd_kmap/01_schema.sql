CREATE DATABASE IF NOT EXISTS kmap
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kmap;

SET SESSION sql_mode = 'STRICT_TRANS_TABLES,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ------------------------------------------------------------
-- LIMPIEZA
-- ------------------------------------------------------------
DROP TABLE IF EXISTS registro_auditoria;
DROP TABLE IF EXISTS ranking_por_tema;
DROP TABLE IF EXISTS resumen_estadisticas_materia;
DROP TABLE IF EXISTS pasos_del_camino;
DROP TABLE IF EXISTS rutas_de_aprendizaje;
DROP TABLE IF EXISTS falla_encontrada;
DROP TABLE IF EXISTS historial_de_progreso;
DROP TABLE IF EXISTS progreso_actual;
DROP TABLE IF EXISTS respuesta_estudiante;
DROP TABLE IF EXISTS intento_de_quiz;
DROP TABLE IF EXISTS respuesta_oficial_quiz;
DROP TABLE IF EXISTS opcion_respuesta;
DROP TABLE IF EXISTS preguntas_del_quiz;
DROP TABLE IF EXISTS banco_preguntas;
DROP TABLE IF EXISTS catalogo_tipos_pregunta;
DROP TABLE IF EXISTS evaluacion_quiz;
DROP TABLE IF EXISTS material_estudio;
DROP TABLE IF EXISTS catalogo_tipos_archivo;
DROP TABLE IF EXISTS requisito_entre_temas;
DROP TABLE IF EXISTS tema_conocimiento;
DROP TABLE IF EXISTS inscripcion_materia;
DROP TABLE IF EXISTS materia_asignatura;
DROP TABLE IF EXISTS mensaje_chat;
DROP TABLE IF EXISTS miembro_chat;
DROP TABLE IF EXISTS conversacion_chat;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS catalogo_roles;

-- ============================================================
-- 1. MÓDULO DE USUARIOS Y ROLES
-- ============================================================

CREATE TABLE catalogo_roles (
    id_catalogo_roles       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_del_rol          VARCHAR(50)  NOT NULL UNIQUE,
    descripcion_del_rol     VARCHAR(200) NULL,
    fecha_creacion          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_catalogo_roles)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuario (
    id_usuario              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_catalogo_roles       INT UNSIGNED    NOT NULL,
    nombre                  VARCHAR(80)     NOT NULL,
    apellido                VARCHAR(80)     NOT NULL,
    numero_de_celular       VARCHAR(20)     NULL,
    cedula_de_identidad     VARCHAR(20)     NOT NULL,
    correo_electronico      VARCHAR(254)    NOT NULL COLLATE utf8mb4_general_ci,
    contrasena_encriptada   VARCHAR(255)    NOT NULL,
    enlace_a_su_foto        VARCHAR(500)    NULL,
    esta_habilitado         TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_registro          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuario_correo (correo_electronico),
    UNIQUE KEY uq_usuario_cedula (cedula_de_identidad),
    KEY idx_usuario_rol (id_catalogo_roles),
    KEY idx_usuario_nombre_apellido (nombre, apellido),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_catalogo_roles)
        REFERENCES catalogo_roles(id_catalogo_roles) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. MÓDULO ACADÉMICO (Materias, Temas y Materiales)
-- ============================================================

CREATE TABLE materia_asignatura (
    id_materia_asignatura   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_de_la_materia    VARCHAR(120)    NOT NULL,
    codigo_de_la_materia    VARCHAR(20)     NULL,
    descripcion_corta       VARCHAR(2000)   NULL,
    id_usuario_docente      BIGINT UNSIGNED NOT NULL,
    enlace_al_icono         VARCHAR(500)    NULL,
    color_representativo    VARCHAR(20)     NULL,
    esta_habilitada         TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_materia_asignatura),
    UNIQUE KEY uq_materia_codigo (codigo_de_la_materia),
    CONSTRAINT fk_materia_docente FOREIGN KEY (id_usuario_docente)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inscripcion_materia (
    id_inscripcion_materia  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_materia_asignatura   BIGINT UNSIGNED NOT NULL,
    id_usuario_estudiante   BIGINT UNSIGNED NOT NULL,
    fecha_en_que_se_inscribio DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_de_la_inscripcion ENUM('activo','completado','retirado') NOT NULL DEFAULT 'activo',
    PRIMARY KEY (id_inscripcion_materia),
    UNIQUE KEY uq_materia_estudiante (id_materia_asignatura, id_usuario_estudiante),
    CONSTRAINT fk_inscripcion_materia FOREIGN KEY (id_materia_asignatura)
        REFERENCES materia_asignatura(id_materia_asignatura) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_inscripcion_estudiante FOREIGN KEY (id_usuario_estudiante)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tema_conocimiento (
    id_tema_conocimiento            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_materia_asignatura           BIGINT UNSIGNED NOT NULL,
    nombre_del_tema                 VARCHAR(160)    NOT NULL,
    descripcion_del_tema            VARCHAR(2000)   NULL,
    nota_minima_para_aprobar        TINYINT UNSIGNED NOT NULL DEFAULT 80,
    importancia_del_tema            TINYINT UNSIGNED NOT NULL DEFAULT 1,
    esta_habilitado                 TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion                  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_tema_conocimiento),
    UNIQUE KEY uq_tema_materia_nombre (id_materia_asignatura, nombre_del_tema),
    CONSTRAINT fk_tema_materia FOREIGN KEY (id_materia_asignatura)
        REFERENCES materia_asignatura(id_materia_asignatura) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_nota_minima CHECK (nota_minima_para_aprobar BETWEEN 0 AND 100),
    CONSTRAINT chk_importancia CHECK (importancia_del_tema BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE requisito_entre_temas (
    id_requisito_entre_temas                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_tema_conocimiento                    BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento_que_se_necesita    BIGINT UNSIGNED NOT NULL,
    necesidad_de_saber_el_tema_anterior     TINYINT UNSIGNED NOT NULL DEFAULT 100,
    fecha_creacion                          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_requisito_entre_temas),
    UNIQUE KEY uq_requisito_par (id_tema_conocimiento, id_tema_conocimiento_que_se_necesita),
    CONSTRAINT fk_requisito_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_requisito_prerequisito FOREIGN KEY (id_tema_conocimiento_que_se_necesita)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_necesidad CHECK (necesidad_de_saber_el_tema_anterior BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE catalogo_tipos_archivo (
    id_catalogo_tipos_archivo INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_del_tipo           VARCHAR(50)  NOT NULL UNIQUE,
    icono_que_lo_representa   VARCHAR(100) NULL,
    PRIMARY KEY (id_catalogo_tipos_archivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE material_estudio (
    id_material_estudio             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_materia_asignatura           BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento            BIGINT UNSIGNED NOT NULL,
    id_usuario_docente              BIGINT UNSIGNED NOT NULL,
    id_catalogo_tipos_archivo       INT UNSIGNED    NOT NULL,
    titulo_del_material             VARCHAR(200)    NOT NULL,
    descripcion_del_material        VARCHAR(1000)  NULL,
    enlace_para_descargar           VARCHAR(500)    NOT NULL,
    esta_visible_para_estudiantes   TINYINT(1) NOT NULL DEFAULT 1,
    fecha_en_que_se_subio           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_material_estudio),
    KEY idx_material_materia (id_materia_asignatura),
    KEY idx_material_tema (id_tema_conocimiento),
    CONSTRAINT fk_material_materia FOREIGN KEY (id_materia_asignatura)
        REFERENCES materia_asignatura(id_materia_asignatura) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_material_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_material_docente FOREIGN KEY (id_usuario_docente)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_material_tipo FOREIGN KEY (id_catalogo_tipos_archivo)
        REFERENCES catalogo_tipos_archivo(id_catalogo_tipos_archivo) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. MÓDULO DE BANCO DE PREGUNTAS (Sugerencias) y QUIZ
-- ============================================================

CREATE TABLE catalogo_tipos_pregunta (
    id_catalogo_tipos_pregunta INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_del_tipo            VARCHAR(50)  NOT NULL UNIQUE,
    descripcion_del_tipo       VARCHAR(200) NULL,
    PRIMARY KEY (id_catalogo_tipos_pregunta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE banco_preguntas (
    id_banco_preguntas          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_tema_conocimiento        BIGINT UNSIGNED NOT NULL,
    id_catalogo_tipos_pregunta  INT UNSIGNED    NOT NULL,
    texto_de_la_pregunta        VARCHAR(5000)   NOT NULL,
    nivel_de_dificultad         TINYINT UNSIGNED NOT NULL DEFAULT 50,
    esta_habilitada             TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_banco_preguntas),
    CONSTRAINT fk_pregunta_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pregunta_tipo FOREIGN KEY (id_catalogo_tipos_pregunta)
        REFERENCES catalogo_tipos_pregunta(id_catalogo_tipos_pregunta) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_dificultad CHECK (nivel_de_dificultad BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE opcion_respuesta (
    id_opcion_respuesta         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_banco_preguntas          BIGINT UNSIGNED NOT NULL,
    texto_de_la_opcion          VARCHAR(1000)   NOT NULL,
    orden_en_que_aparece        INT UNSIGNED    NOT NULL DEFAULT 0,
    PRIMARY KEY (id_opcion_respuesta),
    UNIQUE KEY uq_opcion_pregunta_orden (id_banco_preguntas, orden_en_que_aparece),
    CONSTRAINT fk_opcion_pregunta FOREIGN KEY (id_banco_preguntas)
        REFERENCES banco_preguntas(id_banco_preguntas) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE evaluacion_quiz (
    id_evaluacion_quiz              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_materia_asignatura           BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento            BIGINT UNSIGNED NOT NULL,
    titulo_del_quiz                 VARCHAR(200)    NOT NULL,
    tiempo_limite_en_milisegundos   INT UNSIGNED NOT NULL,
    esta_habilitado                 TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion                  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_evaluacion_quiz),
    CONSTRAINT fk_quiz_materia FOREIGN KEY (id_materia_asignatura)
        REFERENCES materia_asignatura(id_materia_asignatura) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_quiz_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE preguntas_del_quiz (
    id_preguntas_del_quiz       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_evaluacion_quiz          BIGINT UNSIGNED NOT NULL,
    id_banco_preguntas          BIGINT UNSIGNED NOT NULL,
    orden_en_el_quiz            INT UNSIGNED    NOT NULL DEFAULT 0,
    PRIMARY KEY (id_preguntas_del_quiz),
    UNIQUE KEY uq_quiz_pregunta (id_evaluacion_quiz, id_banco_preguntas),
    CONSTRAINT fk_pregunta_del_quiz FOREIGN KEY (id_evaluacion_quiz)
        REFERENCES evaluacion_quiz(id_evaluacion_quiz) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pregunta_del_banco FOREIGN KEY (id_banco_preguntas)
        REFERENCES banco_preguntas(id_banco_preguntas) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE respuesta_oficial_quiz (
    id_respuesta_oficial_quiz   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_preguntas_del_quiz       BIGINT UNSIGNED NOT NULL,
    id_opcion_correcta          BIGINT UNSIGNED NULL,
    texto_correcto              VARCHAR(2000)   NULL,
    fecha_creacion              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_respuesta_oficial_quiz),
    UNIQUE KEY uq_respuesta_oficial_pregunta (id_preguntas_del_quiz),
    CONSTRAINT fk_respuesta_oficial_pregunta FOREIGN KEY (id_preguntas_del_quiz)
        REFERENCES preguntas_del_quiz(id_preguntas_del_quiz) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_respuesta_oficial_opcion FOREIGN KEY (id_opcion_correcta)
        REFERENCES opcion_respuesta(id_opcion_respuesta) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. MÓDULO DE INTENTOS Y RESPUESTAS DEL ESTUDIANTE
-- ============================================================

CREATE TABLE intento_de_quiz (
    id_intento_de_quiz              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_evaluacion_quiz              BIGINT UNSIGNED NOT NULL,
    id_usuario_estudiante           BIGINT UNSIGNED NOT NULL,
    fecha_en_que_inicio             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_en_que_termino            DATETIME        NULL,
    tiempo_total_en_milisegundos    INT UNSIGNED NULL,
    puntaje_que_obtuvo              DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
    estado_del_intento              ENUM('en_curso','completado','abandonado') NOT NULL DEFAULT 'en_curso',
    PRIMARY KEY (id_intento_de_quiz),
    KEY idx_intento_quiz (id_evaluacion_quiz),
    KEY idx_intento_estudiante (id_usuario_estudiante),
    CONSTRAINT fk_intento_quiz FOREIGN KEY (id_evaluacion_quiz)
        REFERENCES evaluacion_quiz(id_evaluacion_quiz) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_intento_estudiante FOREIGN KEY (id_usuario_estudiante)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE respuesta_estudiante (
    id_respuesta_estudiante     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_intento_de_quiz          BIGINT UNSIGNED NOT NULL,
    id_preguntas_del_quiz       BIGINT UNSIGNED NOT NULL,
    id_opcion_que_eligio        BIGINT UNSIGNED NULL,
    texto_que_escribio          VARCHAR(2000)   NULL,
    fue_correcta_su_respuesta   TINYINT(1)      NULL,
    tiempo_que_tardo_en_responder_milisegundos INT UNSIGNED NULL,
    PRIMARY KEY (id_respuesta_estudiante),
    UNIQUE KEY uq_respuesta_intento_pregunta (id_intento_de_quiz, id_preguntas_del_quiz),
    CONSTRAINT fk_respuesta_intento FOREIGN KEY (id_intento_de_quiz)
        REFERENCES intento_de_quiz(id_intento_de_quiz) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_respuesta_pregunta FOREIGN KEY (id_preguntas_del_quiz)
        REFERENCES preguntas_del_quiz(id_preguntas_del_quiz) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_respuesta_opcion FOREIGN KEY (id_opcion_que_eligio)
        REFERENCES opcion_respuesta(id_opcion_respuesta) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. MÓDULO DE ESTADÍSTICAS, RANKING Y PROGRESO
-- ============================================================

CREATE TABLE ranking_por_tema (
    id_ranking_por_tema             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_tema_conocimiento            BIGINT UNSIGNED NOT NULL,
    id_usuario_estudiante           BIGINT UNSIGNED NOT NULL,
    mejor_puntaje_obtenido          DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
    mejor_tiempo_en_milisegundos    INT UNSIGNED NULL,
    posicion_en_el_ranking          INT UNSIGNED    NOT NULL DEFAULT 0,
    fecha_actualizacion             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_ranking_por_tema),
    UNIQUE KEY uq_ranking_tema_estudiante (id_tema_conocimiento, id_usuario_estudiante),
    KEY idx_ranking_orden (id_tema_conocimiento, mejor_puntaje_obtenido DESC, mejor_tiempo_en_milisegundos ASC),
    CONSTRAINT fk_ranking_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ranking_estudiante FOREIGN KEY (id_usuario_estudiante)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE resumen_estadisticas_materia (
    id_resumen_estadisticas_materia BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_materia_asignatura           BIGINT UNSIGNED NOT NULL,
    total_de_estudiantes_inscritos  INT UNSIGNED NOT NULL DEFAULT 0,
    total_de_quices_realizados      INT UNSIGNED NOT NULL DEFAULT 0,
    promedio_general_de_notas       DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    cantidad_de_aprobados           INT UNSIGNED NOT NULL DEFAULT 0,
    cantidad_de_reprobados          INT UNSIGNED NOT NULL DEFAULT 0,
    ultima_vez_que_se_actualizo     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_resumen_estadisticas_materia),
    UNIQUE KEY uq_estadistica_materia (id_materia_asignatura),
    CONSTRAINT fk_estadistica_materia FOREIGN KEY (id_materia_asignatura)
        REFERENCES materia_asignatura(id_materia_asignatura) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE progreso_actual (
    id_progreso_actual                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario_estudiante                   BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento                    BIGINT UNSIGNED NOT NULL,
    nota_actual_del_tema                    TINYINT UNSIGNED NOT NULL DEFAULT 0,
    seguridad_del_sistema_en_su_nota        TINYINT UNSIGNED NOT NULL DEFAULT 0,
    cantidad_de_intentos                    INT UNSIGNED    NOT NULL DEFAULT 0,
    estado_de_aprendizaje                   ENUM('sin_evaluar','debil','en_progreso','dominado') NOT NULL DEFAULT 'sin_evaluar',
    ultima_vez_que_se_actualizo             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_progreso_actual),
    UNIQUE KEY uq_progreso_estudiante_tema (id_usuario_estudiante, id_tema_conocimiento),
    CONSTRAINT fk_progreso_estudiante FOREIGN KEY (id_usuario_estudiante)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_progreso_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_nota_actual CHECK (nota_actual_del_tema BETWEEN 0 AND 100),
    CONSTRAINT chk_seguridad CHECK (seguridad_del_sistema_en_su_nota BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE historial_de_progreso (
    id_historial_de_progreso    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario_estudiante       BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento        BIGINT UNSIGNED NOT NULL,
    nota_que_tenia              TINYINT UNSIGNED NOT NULL,
    seguridad_del_sistema_en_su_nota TINYINT UNSIGNED NOT NULL,
    estado_de_aprendizaje       ENUM('sin_evaluar','debil','en_progreso','dominado') NOT NULL,
    fecha_en_que_se_registro    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_historial_de_progreso),
    KEY idx_historial_estudiante (id_usuario_estudiante, id_tema_conocimiento),
    CONSTRAINT fk_historial_estudiante FOREIGN KEY (id_usuario_estudiante)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_historial_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE falla_encontrada (
    id_falla_encontrada                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario_estudiante                   BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento_que_le_falta       BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento_donde_fallo        BIGINT UNSIGNED NULL,
    seguridad_del_sistema_en_su_falla       TINYINT UNSIGNED NOT NULL DEFAULT 0,
    tipo_de_falla                           ENUM('raiz','intermedia','sin_evidencia') NOT NULL DEFAULT 'raiz',
    fecha_en_que_se_detecto                 DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_falla_encontrada),
    CONSTRAINT fk_falla_estudiante FOREIGN KEY (id_usuario_estudiante)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_falla_tema FOREIGN KEY (id_tema_conocimiento_que_le_falta)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_seguridad_falla CHECK (seguridad_del_sistema_en_su_falla BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. MÓDULO DE RUTAS DE APRENDIZAJE
-- ============================================================
CREATE TABLE rutas_de_aprendizaje (
    id_rutas_de_aprendizaje BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario_estudiante   BIGINT UNSIGNED NOT NULL,
    id_materia_asignatura   BIGINT UNSIGNED NOT NULL,
    estado_de_la_ruta       ENUM('activa','completada','abandonada') NOT NULL DEFAULT 'activa',
    fecha_creacion          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rutas_de_aprendizaje),
    CONSTRAINT fk_ruta_estudiante FOREIGN KEY (id_usuario_estudiante)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ruta_materia FOREIGN KEY (id_materia_asignatura)
        REFERENCES materia_asignatura(id_materia_asignatura) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pasos_del_camino (
    id_pasos_del_camino     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_rutas_de_aprendizaje BIGINT UNSIGNED NOT NULL,
    id_tema_conocimiento    BIGINT UNSIGNED NOT NULL,
    numero_de_paso          INT UNSIGNED    NOT NULL,
    estado_del_paso         ENUM('pendiente','en_progreso','completado') NOT NULL DEFAULT 'pendiente',
    fecha_en_que_lo_completo DATETIME       NULL,
    PRIMARY KEY (id_pasos_del_camino),
    UNIQUE KEY uq_ruta_paso_orden (id_rutas_de_aprendizaje, numero_de_paso),
    CONSTRAINT fk_paso_ruta FOREIGN KEY (id_rutas_de_aprendizaje)
        REFERENCES rutas_de_aprendizaje(id_rutas_de_aprendizaje) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_paso_tema FOREIGN KEY (id_tema_conocimiento)
        REFERENCES tema_conocimiento(id_tema_conocimiento) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. MÓDULO DE CHATS Y MENSAJERÍA
-- ============================================================
CREATE TABLE conversacion_chat (
    id_conversacion_chat    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    asunto_del_chat         VARCHAR(200)    NULL,
    tipo_de_chat            ENUM('directa','grupal','sistema') NOT NULL DEFAULT 'directa',
    id_usuario_creador      BIGINT UNSIGNED NOT NULL,
    clave_de_idempotencia   CHAR(36)        NOT NULL,
    estado_del_chat         ENUM('activa','archivada','bloqueada') NOT NULL DEFAULT 'activa',
    fecha_en_que_se_creo    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_conversacion_chat),
    UNIQUE KEY uq_chat_idempotencia (clave_de_idempotencia),
    CONSTRAINT fk_chat_creador FOREIGN KEY (id_usuario_creador)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE miembro_chat (
    id_miembro_chat         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_conversacion_chat    BIGINT UNSIGNED NOT NULL,
    id_usuario              BIGINT UNSIGNED NOT NULL,
    ultima_vez_que_leyo     DATETIME        NULL,
    PRIMARY KEY (id_miembro_chat),
    UNIQUE KEY uq_chat_miembro (id_conversacion_chat, id_usuario),
    CONSTRAINT fk_miembro_chat FOREIGN KEY (id_conversacion_chat)
        REFERENCES conversacion_chat(id_conversacion_chat) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_miembro_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mensaje_chat (
    id_mensaje_chat         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_conversacion_chat    BIGINT UNSIGNED NOT NULL,
    id_usuario_emisor       BIGINT UNSIGNED NOT NULL,
    texto_del_mensaje       VARCHAR(5000)   NOT NULL,
    clave_de_idempotencia   CHAR(36)        NOT NULL,
    fecha_en_que_se_envio   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_mensaje_chat),
    UNIQUE KEY uq_mensaje_idempotencia (clave_de_idempotencia),
    CONSTRAINT fk_mensaje_chat FOREIGN KEY (id_conversacion_chat)
        REFERENCES conversacion_chat(id_conversacion_chat) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_mensaje_emisor FOREIGN KEY (id_usuario_emisor)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. MÓDULO DE AUDITORÍA
-- ============================================================
CREATE TABLE registro_auditoria (
    id_registro_auditoria   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario              BIGINT UNSIGNED NULL,
    accion_realizada        VARCHAR(50)     NOT NULL,
    tabla_afectada          VARCHAR(60)     NOT NULL,
    id_del_registro_afectado BIGINT UNSIGNED NULL,
    fecha_de_la_accion      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_registro_auditoria),
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
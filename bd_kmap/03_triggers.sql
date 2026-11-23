USE kmap;

-- ------------------------------------------------------------
-- 0. Limpieza idempotente (permite re-ejecutar sin errores)
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_evitar_ciclos_directos_ins;
DROP TRIGGER IF EXISTS trg_evitar_ciclos_directos_upd;
DROP TRIGGER IF EXISTS trg_no_activar_pregunta_sin_correcta;
DROP TRIGGER IF EXISTS trg_guardar_historial_nota_ins;
DROP TRIGGER IF EXISTS trg_guardar_historial_nota_upd;
DROP TRIGGER IF EXISTS trg_validar_emisor_en_chat;
DROP TRIGGER IF EXISTS trg_proteger_auditoria_update;
DROP TRIGGER IF EXISTS trg_proteger_auditoria_delete;
DROP TRIGGER IF EXISTS trg_evitar_doble_respuesta;
DROP TRIGGER IF EXISTS trg_actualizar_ranking_al_terminar_quiz;
DROP TRIGGER IF EXISTS trg_generar_codigo_materia_ins;
DROP TRIGGER IF EXISTS trg_proteger_codigo_materia_upd;

DROP PROCEDURE IF EXISTS sp_validar_dependencia_indirecta;

DELIMITER $$

-- ============================================================
-- A. GRAFO DE CONOCIMIENTO (Evitar ciclos)
-- ============================================================

-- A.1 Evitar que A dependa de B y B dependa de A (Ciclo directo)
CREATE TRIGGER trg_evitar_ciclos_directos_ins
BEFORE INSERT ON requisito_entre_temas
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM requisito_entre_temas
        WHERE id_tema_conocimiento = NEW.id_tema_conocimiento_que_se_necesita
          AND id_tema_conocimiento_que_se_necesita = NEW.id_tema_conocimiento
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Se detectó un ciclo directo. El tema A no puede depender de B si B ya depende de A.';
    END IF;
END$$

-- A.2 Lo mismo, pero al actualizar
CREATE TRIGGER trg_evitar_ciclos_directos_upd
BEFORE UPDATE ON requisito_entre_temas
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM requisito_entre_temas
        WHERE id_tema_conocimiento = NEW.id_tema_conocimiento_que_se_necesita
          AND id_tema_conocimiento_que_se_necesita = NEW.id_tema_conocimiento
          AND id_requisito_entre_temas <> NEW.id_requisito_entre_temas
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Se detectó un ciclo directo al actualizar.';
    END IF;
END$$

-- A.3 Procedimiento para ciclos indirectos (A -> B -> C -> A)
-- La app debe llamar a este procedimiento ANTES de insertar un requisito.
CREATE PROCEDURE sp_validar_dependencia_indirecta(
    IN p_id_tema_conocimiento BIGINT UNSIGNED,
    IN p_id_tema_conocimiento_que_se_necesita BIGINT UNSIGNED
)
BEGIN
    DECLARE v_existe_ciclo INT DEFAULT 0;

    IF p_id_tema_conocimiento = p_id_tema_conocimiento_que_se_necesita THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Un tema no puede ser requisito de sí mismo.';
    END IF;

    -- Busca si el tema necesario ya depende del tema que queremos agregar
    WITH RECURSIVE alcanzables (id) AS (
        SELECT p_id_tema_conocimiento_que_se_necesita
        UNION
        SELECT r.id_tema_conocimiento_que_se_necesita
        FROM requisito_entre_temas r
        JOIN alcanzables a ON r.id_tema_conocimiento = a.id
        WHERE r.id_tema_conocimiento <> p_id_tema_conocimiento
    )
    SELECT COUNT(*) INTO v_existe_ciclo
    FROM alcanzables
    WHERE id = p_id_tema_conocimiento;

    IF v_existe_ciclo > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Se detectó un ciclo indirecto (A depende de B, B de C, C de A).';
    END IF;
END$$

-- ============================================================
-- A.BIS GENERACIÓN AUTOMÁTICA DE codigo_de_la_materia
-- ============================================================

-- A.BIS.1 Al insertar una materia, la BD genera el código aleatorio
--         (6 a 8 dígitos) e IGNORA lo que envíe el backend/frontend.
CREATE TRIGGER trg_generar_codigo_materia_ins
BEFORE INSERT ON materia_asignatura
FOR EACH ROW
BEGIN
    DECLARE v_codigo   VARCHAR(20);
    DECLARE v_longitud TINYINT UNSIGNED;
    DECLARE v_intentos TINYINT UNSIGNED DEFAULT 0;

    -- Longitud aleatoria entre 6 y 8 dígitos
    SET v_longitud = 6 + FLOOR(RAND() * 3);

    -- Generar código único (máx. 20 intentos para evitar colisiones)
    REPEAT
        SET v_codigo = LPAD(
            CAST(FLOOR(RAND() * POW(10, v_longitud)) AS CHAR),
            v_longitud,
            '0'
        );
        SET v_intentos = v_intentos + 1;
    UNTIL NOT EXISTS (
        SELECT 1 FROM materia_asignatura
        WHERE codigo_de_la_materia = v_codigo
    ) OR v_intentos >= 20
    END REPEAT;

    -- Si tras 20 intentos no se logró uno único, lanza error
    IF EXISTS (
        SELECT 1 FROM materia_asignatura
        WHERE codigo_de_la_materia = v_codigo
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: No se pudo generar un código de materia único. Intente nuevamente.';
    END IF;

    -- Sobrescribe SIEMPRE el valor enviado por el backend/frontend
    SET NEW.codigo_de_la_materia = v_codigo;
END$$

-- A.BIS.2 Al actualizar, se PROHÍBE modificar el código de materia.
--         Si el valor entrante es distinto al actual, se fuerza el valor original.
CREATE TRIGGER trg_proteger_codigo_materia_upd
BEFORE UPDATE ON materia_asignatura
FOR EACH ROW
BEGIN
    -- Si el código ya existía y se intenta cambiar, se revierte silenciosamente
    IF OLD.codigo_de_la_materia IS NOT NULL
       AND (NEW.codigo_de_la_materia IS NULL
            OR NEW.codigo_de_la_materia <> OLD.codigo_de_la_materia) THEN
        SET NEW.codigo_de_la_materia = OLD.codigo_de_la_materia;
    END IF;

    -- Si por alguna razón el código estaba NULL (no debería), se genera uno nuevo
    IF NEW.codigo_de_la_materia IS NULL THEN
        SET NEW.codigo_de_la_materia = LPAD(
            CAST(FLOOR(RAND() * 99999999) AS CHAR),
            8,
            '0'
        );
    END IF;
END$$

-- ============================================================
-- B. PREGUNTAS Y OPCIONES
-- ============================================================

-- B.1 No permitir habilitar una pregunta en el examen si no tiene respuesta oficial
CREATE TRIGGER trg_no_activar_pregunta_sin_correcta
BEFORE UPDATE ON preguntas_del_quiz
FOR EACH ROW
BEGIN
    IF (SELECT COUNT(*) FROM respuesta_oficial_quiz WHERE id_preguntas_del_quiz = NEW.id_preguntas_del_quiz) = 0 
    THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: No puedes guardar esta pregunta en el quiz porque no tiene una respuesta oficial guardada.';
    END IF;
END$$

-- ============================================================
-- C. PROGRESO E HISTORIAL
-- ============================================================

-- C.1 Guardar automáticamente en el historial cuando el estudiante recibe una nota
CREATE TRIGGER trg_guardar_historial_nota_ins
AFTER INSERT ON progreso_actual
FOR EACH ROW
BEGIN
    INSERT INTO historial_de_progreso
    (id_usuario_estudiante, id_tema_conocimiento, nota_que_tenia, seguridad_del_sistema_en_su_nota, estado_de_aprendizaje)
    VALUES
    (NEW.id_usuario_estudiante, NEW.id_tema_conocimiento, NEW.nota_actual_del_tema, NEW.seguridad_del_sistema_en_su_nota, NEW.estado_de_aprendizaje);
END$$

-- C.2 Guardar en el historial cada vez que el estudiante SUBE o BAJA su nota
CREATE TRIGGER trg_guardar_historial_nota_upd
AFTER UPDATE ON progreso_actual
FOR EACH ROW
BEGIN
    IF OLD.nota_actual_del_tema <> NEW.nota_actual_del_tema 
       OR OLD.estado_de_aprendizaje <> NEW.estado_de_aprendizaje
    THEN
        INSERT INTO historial_de_progreso
        (id_usuario_estudiante, id_tema_conocimiento, nota_que_tenia, seguridad_del_sistema_en_su_nota, estado_de_aprendizaje)
        VALUES
        (NEW.id_usuario_estudiante, NEW.id_tema_conocimiento, NEW.nota_actual_del_tema, NEW.seguridad_del_sistema_en_su_nota, NEW.estado_de_aprendizaje);
    END IF;
END$$

-- ============================================================
-- D. MENSAJERÍA (Chats)
-- ============================================================

-- D.1 Evitar que alguien envíe un mensaje a un chat donde no está inscrito
CREATE TRIGGER trg_validar_emisor_en_chat
BEFORE INSERT ON mensaje_chat
FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM miembro_chat
        WHERE id_conversacion_chat = NEW.id_conversacion_chat
          AND id_usuario = NEW.id_usuario_emisor
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: No puedes enviar mensajes a un chat del que no eres miembro.';
    END IF;
END$$

-- ============================================================
-- E. SEGURIDAD Y AUDITORÍA
-- ============================================================

-- E.1 Hacer que la auditoría sea inmutable (no se puede editar)
CREATE TRIGGER trg_proteger_auditoria_update
BEFORE UPDATE ON registro_auditoria
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: La tabla de auditoría es un registro histórico y no se puede modificar.';
END$$

-- E.2 Hacer que la auditoría sea inmutable (no se puede borrar)
CREATE TRIGGER trg_proteger_auditoria_delete
BEFORE DELETE ON registro_auditoria
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Por seguridad, no se permite borrar registros de auditoría.';
END$$

-- ============================================================
-- F. INTENTOS DE QUIZ Y RANKING
-- ============================================================

-- F.1 Evitar que un estudiante responda dos veces la misma pregunta en el mismo intento
CREATE TRIGGER trg_evitar_doble_respuesta
BEFORE INSERT ON respuesta_estudiante
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM respuesta_estudiante
        WHERE id_intento_de_quiz = NEW.id_intento_de_quiz
          AND id_preguntas_del_quiz = NEW.id_preguntas_del_quiz
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Ya has respondido esta pregunta en este intento. No puedes enviarla dos veces.';
    END IF;
END$$

-- F.2 Actualizar el Ranking automáticamente al terminar un quiz
CREATE TRIGGER trg_actualizar_ranking_al_terminar_quiz
AFTER UPDATE ON intento_de_quiz
FOR EACH ROW
BEGIN
    DECLARE v_id_tema_conocimiento BIGINT UNSIGNED;
    DECLARE v_mejor_puntaje_actual DECIMAL(5,2);
    DECLARE v_mejor_tiempo_actual INT UNSIGNED;

    -- Solo actuar si el intento acaba de pasar a "completado"
    IF NEW.estado_del_intento = 'completado' AND OLD.estado_del_intento <> 'completado' THEN
        
        -- 1. Obtener a qué tema pertenece este quiz
        SELECT id_tema_conocimiento INTO v_id_tema_conocimiento 
        FROM evaluacion_quiz 
        WHERE id_evaluacion_quiz = NEW.id_evaluacion_quiz;

        -- 2. Revisar si el estudiante ya tenía un registro en el ranking de este tema
        SELECT mejor_puntaje_obtenido, mejor_tiempo_en_milisegundos 
        INTO v_mejor_puntaje_actual, v_mejor_tiempo_actual
        FROM ranking_por_tema
        WHERE id_tema_conocimiento = v_id_tema_conocimiento 
          AND id_usuario_estudiante = NEW.id_usuario_estudiante;

        -- 3. Si NO existe registro, lo creamos
        IF v_mejor_puntaje_actual IS NULL THEN
            INSERT INTO ranking_por_tema (id_tema_conocimiento, id_usuario_estudiante, mejor_puntaje_obtenido, mejor_tiempo_en_milisegundos)
            VALUES (v_id_tema_conocimiento, NEW.id_usuario_estudiante, NEW.puntaje_que_obtuvo, NEW.tiempo_total_en_milisegundos);
        
        -- 4. Si YA existe, comparamos (Regla: Puntaje manda, Tiempo desempata)
        ELSE
            IF (NEW.puntaje_que_obtuvo > v_mejor_puntaje_actual) OR 
               (NEW.puntaje_que_obtuvo = v_mejor_puntaje_actual AND NEW.tiempo_total_en_milisegundos < v_mejor_tiempo_actual) 
            THEN
                UPDATE ranking_por_tema 
                SET mejor_puntaje_obtenido = NEW.puntaje_que_obtuvo,
                    mejor_tiempo_en_milisegundos = NEW.tiempo_total_en_milisegundos
                WHERE id_tema_conocimiento = v_id_tema_conocimiento 
                  AND id_usuario_estudiante = NEW.id_usuario_estudiante;
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;
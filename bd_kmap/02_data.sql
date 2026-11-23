USE kmap;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. CATALOGO_ROLES
-- ============================================================
INSERT INTO catalogo_roles (nombre_del_rol, descripcion_del_rol) VALUES
('administrador', 'Acceso total al sistema, gestiona usuarios, materias y configuracion global'),
('docente', 'Crea materias, temas, materiales, preguntas y evaluaciones'),
('estudiante', 'Se inscribe en materias, realiza quizzes y sigue rutas de aprendizaje'),
('tutor', 'Apoya a estudiantes y puede revisar progreso y chats'),
('auditor', 'Solo lectura de reportes, estadisticas y registros de auditoria'),
('invitado', 'Acceso limitado a contenidos publicos sin inscripcion');

-- ============================================================
-- 2. USUARIO (adaptado a: nombre, apellido, celular, CI)
-- ============================================================
INSERT INTO usuario
(id_catalogo_roles, nombre, apellido, numero_de_celular, cedula_de_identidad, correo_electronico, contrasena_encriptada, enlace_a_su_foto, esta_habilitado)
VALUES
-- ===== ADMINISTRADORES =====
(1, 'Ana Maria',   'Rodriguez',   '+59170000001', '10000001', 'ana.rodriguez@kmap.edu',      '$2b$12$hashAnaRodriguez001',   'https://cdn.kmap.edu/avatars/ana.png',        1),
(1, 'Carlos Eduardo','Perez',     '+59170000002', '10000002', 'carlos.perez@kmap.edu',       '$2b$12$hashCarlosPerez002',    'https://cdn.kmap.edu/avatars/carlos.png',     1),

-- ===== DOCENTES =====
(2, 'Laura',       'Gimenez',     '+59170000003', '10000003', 'laura.gimenez@kmap.edu',      '$2b$12$hashLauraGimenez003',   'https://cdn.kmap.edu/avatars/laura.png',      1),
(2, 'Pedro Antonio','Silva',      '+59170000004', '10000004', 'pedro.silva@kmap.edu',        '$2b$12$hashPedroSilva004',     'https://cdn.kmap.edu/avatars/pedro.png',      1),
(2, 'Marta',       'Fernandez',   '+59170000005', '10000005', 'marta.fernandez@kmap.edu',    '$2b$12$hashMartaFernandez005', 'https://cdn.kmap.edu/avatars/marta.png',      1),
(2, 'Jorge Luis',  'Mendez',      '+59170000006', '10000006', 'jorge.mendez@kmap.edu',       '$2b$12$hashJorgeMendez006',    'https://cdn.kmap.edu/avatars/jorge.png',      1),
(2, 'Sofia',       'Castro',      '+59170000007', '10000007', 'sofia.castro@kmap.edu',       '$2b$12$hashSofiaCastro007',    'https://cdn.kmap.edu/avatars/sofia.png',      1),

-- ===== ESTUDIANTES =====
(3, 'Juan David',  'Torres',      '+59170000008', '10000008', 'juan.torres@kmap.edu',        '$2b$12$hashJuanTorres008',     'https://cdn.kmap.edu/avatars/juan.png',       1),
(3, 'Valentina',   'Rios',        '+59170000009', '10000009', 'valentina.rios@kmap.edu',     '$2b$12$hashValentinaRios009',  'https://cdn.kmap.edu/avatars/valentina.png',  1),
(3, 'Andres Felipe','Mora',       '+59170000010', '10000010', 'andres.mora@kmap.edu',        '$2b$12$hashAndresMora010',     'https://cdn.kmap.edu/avatars/andres.png',     1),
(3, 'Camila Andrea','Suarez',     '+59170000011', '10000011', 'camila.suarez@kmap.edu',      '$2b$12$hashCamilaSuarez011',   'https://cdn.kmap.edu/avatars/camila.png',     1),
(3, 'Sebastian',   'Molina',      '+59170000012', '10000012', 'sebastian.molina@kmap.edu',   '$2b$12$hashSebastianMolina012', 'https://cdn.kmap.edu/avatars/sebastian.png', 1),
(3, 'Isabella',    'Navarro',     '+59170000013', '10000013', 'isabella.navarro@kmap.edu',   '$2b$12$hashIsabellaNavarro013', 'https://cdn.kmap.edu/avatars/isabella.png', 1),
(3, 'Mateo',       'Ramirez',     '+59170000014', '10000014', 'mateo.ramirez@kmap.edu',      '$2b$12$hashMateoRamirez014',   'https://cdn.kmap.edu/avatars/mateo.png',      1),
(3, 'Daniela',     'Ortiz',       '+59170000015', '10000015', 'daniela.ortiz@kmap.edu',      '$2b$12$hashDanielaOrtiz015',   'https://cdn.kmap.edu/avatars/daniela.png',    1),
(3, 'Santiago',    'Herrera',     '+59170000016', '10000016', 'santiago.herrera@kmap.edu',   '$2b$12$hashSantiagoHerrera016', 'https://cdn.kmap.edu/avatars/santiago.png', 1),
(3, 'Mariana',     'Lopez',       '+59170000017', '10000017', 'mariana.lopez@kmap.edu',      '$2b$12$hashMarianaLopez017',   'https://cdn.kmap.edu/avatars/mariana.png',    1),
(3, 'Alejandro',   'Gomez',       '+59170000018', '10000018', 'alejandro.gomez@kmap.edu',    '$2b$12$hashAlejandroGomez018', 'https://cdn.kmap.edu/avatars/alejandro.png', 1),
(3, 'Gabriela',    'Torres',      '+59170000019', '10000019', 'gabriela.torres@kmap.edu',    '$2b$12$hashGabrielaTorres019', 'https://cdn.kmap.edu/avatars/gabriela.png',   1),
(3, 'Nicolas',     'Vargas',      '+59170000020', '10000020', 'nicolas.vargas@kmap.edu',     '$2b$12$hashNicolasVargas020',  'https://cdn.kmap.edu/avatars/nicolas.png',    1),
(3, 'Luciana',     'Mejia',       '+59170000021', '10000021', 'luciana.mejia@kmap.edu',      '$2b$12$hashLucianaMejia021',   'https://cdn.kmap.edu/avatars/luciana.png',    1),
(3, 'Emilio',      'Castano',     '+59170000022', '10000022', 'emilio.castano@kmap.edu',     '$2b$12$hashEmilioCastano022',  'https://cdn.kmap.edu/avatars/emilio.png',     1),
(3, 'Antonella',   'Rojas',       '+59170000023', '10000023', 'antonella.rojas@kmap.edu',    '$2b$12$hashAntonellaRojas023', 'https://cdn.kmap.edu/avatars/antonella.png', 1),
(3, 'Samuel',      'Quintero',    '+59170000024', '10000024', 'samuel.quintero@kmap.edu',    '$2b$12$hashSamuelQuintero024', 'https://cdn.kmap.edu/avatars/samuel.png',     1),
(3, 'Victoria',    'Salgado',     '+59170000025', '10000025', 'victoria.salgado@kmap.edu',   '$2b$12$hashVictoriaSalgado025', 'https://cdn.kmap.edu/avatars/victoria.png', 1),
(3, 'Tomas',       'Espinoza',    '+59170000026', '10000026', 'tomas.espinoza@kmap.edu',     '$2b$12$hashTomasEspinoza026',  'https://cdn.kmap.edu/avatars/tomas.png',      1),
(3, 'Renata',      'Palacios',    '+59170000027', '10000027', 'renata.palacios@kmap.edu',    '$2b$12$hashRenataPalacios027', 'https://cdn.kmap.edu/avatars/renata.png',     1),
(3, 'Benjamin',    'Cordero',     '+59170000028', '10000028', 'benjamin.cordero@kmap.edu',   '$2b$12$hashBenjaminCordero028', 'https://cdn.kmap.edu/avatars/benjamin.png', 1),
(3, 'Julieta',     'Montoya',     '+59170000029', '10000029', 'julieta.montoya@kmap.edu',    '$2b$12$hashJulietaMontoya029', 'https://cdn.kmap.edu/avatars/julieta.png',    1),
(3, 'Martin',      'Villalba',    '+59170000030', '10000030', 'martin.villalba@kmap.edu',    '$2b$12$hashMartinVillalba030', 'https://cdn.kmap.edu/avatars/martin.png',     1),

-- ===== TUTORES =====
(4, 'Patricia',    'Nunez',       '+59170000031', '10000031', 'patricia.nunez@kmap.edu',     '$2b$12$hashPatriciaNunez031',  'https://cdn.kmap.edu/avatars/patricia.png',   1),
(4, 'Ricardo',     'Pena',        '+59170000032', '10000032', 'ricardo.pena@kmap.edu',       '$2b$12$hashRicardoPena032',    'https://cdn.kmap.edu/avatars/ricardo.png',    1),

-- ===== AUDITORES =====
(5, 'Monica',      'Serrano',     '+59170000033', '10000033', 'monica.serrano@kmap.edu',     '$2b$12$hashMonicaSerrano033',  'https://cdn.kmap.edu/avatars/monica.png',     1),
(5, 'Felipe',      'Guzman',      '+59170000034', '10000034', 'felipe.guzman@kmap.edu',      '$2b$12$hashFelipeGuzman034',   'https://cdn.kmap.edu/avatars/felipe.png',     1),

-- ===== INVITADOS =====
(6, 'Invitado',    'Demo Uno',    '+59170000035', '10000035', 'invitado1@kmap.edu',          '$2b$12$hashInvitadoUno035',    'https://cdn.kmap.edu/avatars/inv1.png',       1),
(6, 'Invitado',    'Demo Dos',    '+59170000036', '10000036', 'invitado2@kmap.edu',          '$2b$12$hashInvitadoDos036',    'https://cdn.kmap.edu/avatars/inv2.png',       1),

-- ===== ESTUDIANTES (continuación) =====
(3, 'Paula Andrea','Beltran',     '+59170000037', '10000037', 'paula.beltran@kmap.edu',      '$2b$12$hashPaulaBeltran037',   'https://cdn.kmap.edu/avatars/paula.png',      1),
(3, 'Diego Alejandro','Cortes',   '+59170000038', '10000038', 'diego.cortes@kmap.edu',       '$2b$12$hashDiegoCortes038',    'https://cdn.kmap.edu/avatars/diego.png',      1),
(3, 'Sara Lucia',  'Ospina',      '+59170000039', '10000039', 'sara.ospina@kmap.edu',        '$2b$12$hashSaraOspina039',     'https://cdn.kmap.edu/avatars/sara.png',       1),
(3, 'Cristian Camilo','Rios',     '+59170000040', '10000040', 'cristian.rios@kmap.edu',      '$2b$12$hashCristianRios040',   'https://cdn.kmap.edu/avatars/cristian.png',   1);
-- ============================================================
-- 3. MATERIA_ASIGNATURA
-- ============================================================
INSERT INTO materia_asignatura (nombre_de_la_materia, codigo_de_la_materia, descripcion_corta, id_usuario_docente, enlace_al_icono, color_representativo, esta_habilitada) VALUES
('Matematicas Basicas',           'MAT101', 'Fundamentos de aritmetica, algebra y geometria',            3, 'https://cdn.kmap.edu/icons/mat.png', '#FF5733', 1),
('Algebra Lineal',                'MAT201', 'Vectores, matrices, espacios vectoriales y transformaciones', 3, 'https://cdn.kmap.edu/icons/algebra.png', '#33A1FF', 1),
('Calculo Diferencial',           'MAT301', 'Limites, derivadas y aplicaciones',                         4, 'https://cdn.kmap.edu/icons/calculo.png', '#8E44AD', 1),
('Fisica Mecanica',               'FIS101', 'Cinematica, dinamica y leyes de Newton',                     4, 'https://cdn.kmap.edu/icons/fisica.png', '#27AE60', 1),
('Quimica General',               'QUI101', 'Estructura atomica, enlaces y reacciones basicas',           5, 'https://cdn.kmap.edu/icons/quimica.png', '#E67E22', 1),
('Biologia Celular',              'BIO101', 'La celula, organelos y procesos metabolicos',                5, 'https://cdn.kmap.edu/icons/bio.png', '#16A085', 1),
('Programacion I',                'PRO101', 'Logica, algoritmos y fundamentos de programacion',           6, 'https://cdn.kmap.edu/icons/prog.png', '#2C3E50', 1),
('Estructuras de Datos',          'PRO201', 'Listas, pilas, colas, arboles y grafos',                     6, 'https://cdn.kmap.edu/icons/ed.png', '#C0392B', 1),
('Bases de Datos',                'BD101',  'Modelo relacional, SQL y normalizacion',                    7, 'https://cdn.kmap.edu/icons/bd.png', '#2980B9', 1),
('Ingles Tecnico',                'ING101', 'Vocabulario y comprension lectora tecnica',                  7, 'https://cdn.kmap.edu/icons/ingles.png', '#F1C40F', 1),
('Estadistica Descriptiva',       'EST101', 'Medidas de tendencia central, dispersion y graficos',        3, 'https://cdn.kmap.edu/icons/est.png', '#D35400', 1),
('Redes de Computadores',         'RED101', 'Modelos OSI, TCP/IP y fundamentos de redes',                 6, 'https://cdn.kmap.edu/icons/redes.png', '#7F8C8D', 1);

-- ============================================================
-- 4. INSCRIPCION_MATERIA
-- ============================================================
INSERT INTO inscripcion_materia (id_materia_asignatura, id_usuario_estudiante, estado_de_la_inscripcion) VALUES
(1, 8, 'activo'), (1, 9, 'activo'), (1, 10, 'activo'), (1, 11, 'activo'), (1, 12, 'activo'),
(2, 8, 'activo'), (2, 13, 'activo'), (2, 14, 'activo'), (2, 15, 'activo'),
(3, 9, 'activo'), (3, 16, 'activo'), (3, 17, 'activo'), (3, 18, 'activo'),
(4, 10, 'activo'), (4, 19, 'activo'), (4, 20, 'activo'), (4, 21, 'activo'),
(5, 11, 'activo'), (5, 22, 'activo'), (5, 23, 'activo'), (5, 24, 'activo'),
(6, 12, 'activo'), (6, 25, 'activo'), (6, 26, 'activo'), (6, 27, 'activo'),
(7, 13, 'activo'), (7, 28, 'activo'), (7, 29, 'activo'), (7, 30, 'activo'),
(8, 14, 'activo'), (8, 37, 'activo'), (8, 38, 'activo'), (8, 39, 'activo'),
(9, 15, 'activo'), (9, 40, 'activo'), (9, 8, 'activo'), (9, 9, 'activo'),
(10, 16, 'activo'), (10, 10, 'activo'), (10, 11, 'activo'),
(11, 17, 'activo'), (11, 12, 'activo'), (11, 13, 'activo'),
(12, 18, 'activo'), (12, 14, 'activo'), (12, 15, 'activo'),
(1, 37, 'completado'), (2, 38, 'retirado'), (3, 39, 'activo'), (4, 40, 'activo');

-- ============================================================
-- 5. TEMA_CONOCIMIENTO (60 temas)
-- ============================================================
INSERT INTO tema_conocimiento (id_materia_asignatura, nombre_del_tema, descripcion_del_tema, nota_minima_para_aprobar, importancia_del_tema, esta_habilitado) VALUES
(1, 'Numeros enteros y racionales', 'Operaciones basicas con enteros y fracciones', 80, 1, 1),
(1, 'Potencias y raices', 'Propiedades de exponentes y radicales', 80, 1, 1),
(1, 'Expresiones algebraicas', 'Simplificacion y factorizacion', 80, 1, 1),
(1, 'Ecuaciones lineales', 'Resolucion de ecuaciones de primer grado', 80, 2, 1),
(1, 'Geometria basica', 'Perimetros, areas y volumenes', 75, 1, 1),
(2, 'Vectores', 'Operaciones vectoriales y producto punto', 80, 1, 1),
(2, 'Matrices', 'Operaciones con matrices y determinantes', 80, 1, 1),
(2, 'Sistemas de ecuaciones', 'Metodos de Gauss y Gauss-Jordan', 80, 2, 1),
(2, 'Espacios vectoriales', 'Bases, dimension y subespacios', 80, 1, 1),
(2, 'Transformaciones lineales', 'Nucleo, imagen y matrices asociadas', 80, 1, 1),
(3, 'Limites', 'Concepto y calculo de limites', 80, 1, 1),
(3, 'Continuidad', 'Tipos de discontinuidad y teoremas', 80, 1, 1),
(3, 'Derivadas', 'Reglas de derivacion y regla de la cadena', 80, 2, 1),
(3, 'Aplicaciones de la derivada', 'Maximos, minimos y optimizacion', 80, 1, 1),
(3, 'Trazado de curvas', 'Concavidad y puntos de inflexion', 75, 1, 1),
(4, 'Cinematica', 'MRU, MRUA y caida libre', 80, 1, 1),
(4, 'Dinamica', 'Leyes de Newton y diagramas de cuerpo libre', 80, 2, 1),
(4, 'Trabajo y energia', 'Teorema trabajo-energia y conservacion', 80, 1, 1),
(4, 'Momento lineal', 'Impulso y choques', 80, 1, 1),
(4, 'Rotacion', 'Cinematica y dinamica rotacional', 80, 1, 1),
(5, 'Estructura atomica', 'Modelos atomicos y configuracion electronica', 80, 1, 1),
(5, 'Tabla periodica', 'Propiedades periodicas', 80, 1, 1),
(5, 'Enlaces quimicos', 'Ionico, covalente y metalico', 80, 1, 1),
(5, 'Estequiometria', 'Calculos molares y balanceo', 80, 2, 1),
(5, 'Reacciones quimicas', 'Tipos de reacciones y ecuaciones', 80, 1, 1),
(6, 'Membrana celular', 'Estructura y transporte', 80, 1, 1),
(6, 'Organelos', 'Funciones de los organelos celulares', 80, 1, 1),
(6, 'Metabolismo', 'Anabolismo y catabolismo', 80, 2, 1),
(6, 'Division celular', 'Mitosis y meiosis', 80, 1, 1),
(6, 'Genetica basica', 'Herencia mendeliana', 80, 1, 1),
(7, 'Variables y tipos de datos', 'Tipos primitivos y declaracion', 80, 1, 1),
(7, 'Estructuras de control', 'Condicionales y bucles', 80, 2, 1),
(7, 'Funciones', 'Declaracion, parametros y retorno', 80, 1, 1),
(7, 'Arreglos', 'Arreglos unidimensionales y multidimensionales', 80, 1, 1),
(7, 'Algoritmos basicos', 'Busqueda y ordenamiento simple', 80, 1, 1),
(8, 'Listas enlazadas', 'Simples, dobles y circulares', 80, 1, 1),
(8, 'Pilas y colas', 'Implementacion y aplicaciones', 80, 1, 1),
(8, 'Arboles', 'Arboles binarios y recorridos', 80, 2, 1),
(8, 'Grafos', 'Representacion y recorridos BFS/DFS', 80, 1, 1),
(8, 'Complejidad algoritmica', 'Notacion Big-O', 80, 1, 1),
(9, 'Modelo relacional', 'Tablas, claves y relaciones', 80, 1, 1),
(9, 'SQL basico', 'SELECT, INSERT, UPDATE, DELETE', 80, 2, 1),
(9, 'Joins', 'INNER, LEFT, RIGHT y FULL', 80, 1, 1),
(9, 'Normalizacion', '1FN, 2FN, 3FN y BCNF', 80, 1, 1),
(9, 'Indices y vistas', 'Optimizacion y vistas', 75, 1, 1),
(10, 'Vocabulario tecnico', 'Terminos de ingenieria y tecnologia', 80, 1, 1),
(10, 'Comprension lectora', 'Lectura de textos tecnicos', 80, 1, 1),
(10, 'Gramatica basica', 'Tiempos verbales y estructuras', 80, 1, 1),
(10, 'Escritura tecnica', 'Informes y documentacion', 80, 1, 1),
(10, 'Listening', 'Comprension auditiva', 75, 1, 1),
(11, 'Medidas de tendencia central', 'Media, mediana y moda', 80, 1, 1),
(11, 'Medidas de dispersion', 'Varianza, desviacion y rango', 80, 1, 1),
(11, 'Graficos estadisticos', 'Histogramas, barras y pastel', 80, 1, 1),
(11, 'Probabilidad basica', 'Espacios muestrales y eventos', 80, 2, 1),
(11, 'Distribuciones', 'Binomial y normal', 80, 1, 1),
(12, 'Modelo OSI', 'Las siete capas y sus funciones', 80, 1, 1),
(12, 'TCP/IP', 'Protocolos y capas', 80, 2, 1),
(12, 'Direccionamiento IP', 'IPv4, IPv6 y subredes', 80, 2, 1),
(12, 'Dispositivos de red', 'Routers, switches y hubs', 80, 1, 1),
(12, 'Seguridad basica', 'Firewalls y cifrado', 75, 1, 1);

-- ============================================================
-- 6. REQUISITO_ENTRE_TEMAS
-- ============================================================
INSERT INTO requisito_entre_temas (id_tema_conocimiento, id_tema_conocimiento_que_se_necesita, necesidad_de_saber_el_tema_anterior) VALUES
(2, 1, 100), (3, 1, 100), (3, 2, 90), (4, 3, 100), (5, 1, 70),
(7, 6, 100), (8, 7, 100), (8, 6, 80), (9, 8, 90), (10, 9, 100),
(12, 11, 100), (13, 11, 100), (13, 12, 90), (14, 13, 100), (15, 14, 80),
(17, 16, 100), (18, 17, 90), (19, 18, 80), (20, 19, 70),
(22, 21, 100), (23, 22, 90), (24, 23, 100), (25, 24, 80),
(27, 26, 100), (28, 27, 90), (29, 28, 100), (30, 29, 70),
(32, 31, 100), (33, 32, 90), (34, 33, 100), (35, 34, 80),
(37, 36, 100), (38, 37, 100), (39, 38, 90), (40, 39, 80),
(42, 41, 100), (43, 42, 90), (44, 43, 100), (45, 44, 80),
(47, 46, 100), (48, 47, 90), (49, 48, 80), (50, 49, 70),
(52, 51, 100), (53, 52, 90), (54, 53, 100), (55, 54, 80),
(57, 56, 100), (58, 57, 100), (59, 58, 90), (60, 59, 80);

-- ============================================================
-- 7. CATALOGO_TIPOS_ARCHIVO
-- ============================================================
INSERT INTO catalogo_tipos_archivo (nombre_del_tipo, icono_que_lo_representa) VALUES
('PDF', 'fa-file-pdf'),
('Video MP4', 'fa-file-video'),
('Presentacion PPTX', 'fa-file-powerpoint'),
('Documento DOCX', 'fa-file-word'),
('Imagen PNG', 'fa-file-image'),
('Imagen JPG', 'fa-file-image'),
('Audio MP3', 'fa-file-audio'),
('Enlace externo', 'fa-link'),
('Hoja de calculo XLSX', 'fa-file-excel'),
('Archivo comprimido ZIP', 'fa-file-archive');

-- ============================================================
-- 8. MATERIAL_ESTUDIO
-- ============================================================
INSERT INTO material_estudio (id_materia_asignatura, id_tema_conocimiento, id_usuario_docente, id_catalogo_tipos_archivo, titulo_del_material, descripcion_del_material, enlace_para_descargar, esta_visible_para_estudiantes) VALUES
(1, 1, 3, 1, 'Guia de numeros enteros', 'Ejercicios resueltos de operaciones con enteros', 'https://cdn.kmap.edu/materiales/mat101_t1_guia.pdf', 1),
(1, 2, 3, 2, 'Video potencias y raices', 'Explicacion paso a paso con ejemplos', 'https://cdn.kmap.edu/materiales/mat101_t2_video.mp4', 1),
(1, 3, 3, 3, 'Presentacion expresiones algebraicas', 'Diapositivas con reglas de factorizacion', 'https://cdn.kmap.edu/materiales/mat101_t3_pres.pptx', 1),
(1, 4, 3, 1, 'Taller ecuaciones lineales', 'Problemas propuestos y solucionario', 'https://cdn.kmap.edu/materiales/mat101_t4_taller.pdf', 1),
(1, 5, 3, 5, 'Formulario geometria', 'Formulas de areas y volumenes', 'https://cdn.kmap.edu/materiales/mat101_t5_formulario.png', 1),
(2, 6, 3, 1, 'Apuntes de vectores', 'Definiciones y ejercicios de producto punto', 'https://cdn.kmap.edu/materiales/mat201_t1_apuntes.pdf', 1),
(2, 7, 3, 2, 'Video matrices', 'Operaciones y determinantes explicados', 'https://cdn.kmap.edu/materiales/mat201_t2_video.mp4', 1),
(2, 8, 3, 3, 'Presentacion Gauss-Jordan', 'Metodo paso a paso con ejemplos', 'https://cdn.kmap.edu/materiales/mat201_t3_gauss.pptx', 1),
(2, 9, 3, 1, 'Guia espacios vectoriales', 'Bases y dimension con ejercicios', 'https://cdn.kmap.edu/materiales/mat201_t4_guia.pdf', 1),
(2, 10, 3, 4, 'Documento transformaciones', 'Nucleo e imagen con ejemplos', 'https://cdn.kmap.edu/materiales/mat201_t5_doc.docx', 1),
(3, 11, 4, 1, 'Guia de limites', 'Limites laterales y al infinito', 'https://cdn.kmap.edu/materiales/mat301_t1_limites.pdf', 1),
(3, 12, 4, 2, 'Video continuidad', 'Tipos de discontinuidad con graficos', 'https://cdn.kmap.edu/materiales/mat301_t2_video.mp4', 1),
(3, 13, 4, 3, 'Presentacion derivadas', 'Reglas de derivacion y cadena', 'https://cdn.kmap.edu/materiales/mat301_t3_derivadas.pptx', 1),
(3, 14, 4, 1, 'Taller optimizacion', 'Problemas de maximos y minimos', 'https://cdn.kmap.edu/materiales/mat301_t4_taller.pdf', 1),
(3, 15, 4, 5, 'Graficos trazado de curvas', 'Ejemplos de concavidad', 'https://cdn.kmap.edu/materiales/mat301_t5_graficos.png', 1),
(4, 16, 4, 1, 'Apuntes cinematica', 'MRU y MRUA con ejercicios', 'https://cdn.kmap.edu/materiales/fis101_t1_cinematica.pdf', 1),
(4, 17, 4, 2, 'Video leyes de Newton', 'Dinamica y diagramas de cuerpo libre', 'https://cdn.kmap.edu/materiales/fis101_t2_newton.mp4', 1),
(4, 18, 4, 3, 'Presentacion energia', 'Trabajo y conservacion de energia', 'https://cdn.kmap.edu/materiales/fis101_t3_energia.pptx', 1),
(4, 19, 4, 1, 'Taller momento lineal', 'Choques elasticos e inelasticos', 'https://cdn.kmap.edu/materiales/fis101_t4_taller.pdf', 1),
(4, 20, 4, 5, 'Formulario rotacion', 'Ecuaciones de rotacion', 'https://cdn.kmap.edu/materiales/fis101_t5_formulario.png', 1),
(5, 21, 5, 1, 'Guia estructura atomica', 'Modelos atomicos y configuracion', 'https://cdn.kmap.edu/materiales/qui101_t1_guia.pdf', 1),
(5, 22, 5, 2, 'Video tabla periodica', 'Propiedades periodicas explicadas', 'https://cdn.kmap.edu/materiales/qui101_t2_video.mp4', 1),
(5, 23, 5, 3, 'Presentacion enlaces', 'Ionico, covalente y metalico', 'https://cdn.kmap.edu/materiales/qui101_t3_enlaces.pptx', 1),
(5, 24, 5, 1, 'Taller estequiometria', 'Calculos molares y balanceo', 'https://cdn.kmap.edu/materiales/qui101_t4_taller.pdf', 1),
(5, 25, 5, 4, 'Documento reacciones', 'Tipos de reacciones quimicas', 'https://cdn.kmap.edu/materiales/qui101_t5_doc.docx', 1),
(6, 26, 5, 1, 'Guia membrana celular', 'Transporte pasivo y activo', 'https://cdn.kmap.edu/materiales/bio101_t1_guia.pdf', 1),
(6, 27, 5, 2, 'Video organelos', 'Funciones de cada organelo', 'https://cdn.kmap.edu/materiales/bio101_t2_video.mp4', 1),
(6, 28, 5, 3, 'Presentacion metabolismo', 'Anabolismo y catabolismo', 'https://cdn.kmap.edu/materiales/bio101_t3_metabolismo.pptx', 1),
(6, 29, 5, 1, 'Taller division celular', 'Mitosis y meiosis comparadas', 'https://cdn.kmap.edu/materiales/bio101_t4_taller.pdf', 1),
(6, 30, 5, 6, 'Infografia genetica', 'Herencia mendeliana visual', 'https://cdn.kmap.edu/materiales/bio101_t5_infografia.jpg', 1),
(7, 31, 6, 1, 'Guia variables y tipos', 'Declaracion y uso de variables', 'https://cdn.kmap.edu/materiales/pro101_t1_guia.pdf', 1),
(7, 32, 6, 2, 'Video estructuras de control', 'Condicionales y bucles con ejemplos', 'https://cdn.kmap.edu/materiales/pro101_t2_video.mp4', 1),
(7, 33, 6, 3, 'Presentacion funciones', 'Parametros y retorno', 'https://cdn.kmap.edu/materiales/pro101_t3_funciones.pptx', 1),
(7, 34, 6, 1, 'Taller arreglos', 'Ejercicios con arreglos', 'https://cdn.kmap.edu/materiales/pro101_t4_taller.pdf', 1),
(7, 35, 6, 7, 'Audio algoritmos basicos', 'Explicacion de busqueda y ordenamiento', 'https://cdn.kmap.edu/materiales/pro101_t5_audio.mp3', 1),
(8, 36, 6, 1, 'Guia listas enlazadas', 'Listas simples, dobles y circulares', 'https://cdn.kmap.edu/materiales/pro201_t1_guia.pdf', 1),
(8, 37, 6, 2, 'Video pilas y colas', 'Implementacion y aplicaciones', 'https://cdn.kmap.edu/materiales/pro201_t2_video.mp4', 1),
(8, 38, 6, 3, 'Presentacion arboles', 'Recorridos y arboles binarios', 'https://cdn.kmap.edu/materiales/pro201_t3_arboles.pptx', 1),
(8, 39, 6, 1, 'Taller grafos', 'BFS y DFS con ejercicios', 'https://cdn.kmap.edu/materiales/pro201_t4_taller.pdf', 1),
(8, 40, 6, 4, 'Documento complejidad', 'Notacion Big-O explicada', 'https://cdn.kmap.edu/materiales/pro201_t5_doc.docx', 1),
(9, 41, 7, 1, 'Guia modelo relacional', 'Tablas, claves y relaciones', 'https://cdn.kmap.edu/materiales/bd101_t1_guia.pdf', 1),
(9, 42, 7, 2, 'Video SQL basico', 'SELECT, INSERT, UPDATE, DELETE', 'https://cdn.kmap.edu/materiales/bd101_t2_video.mp4', 1),
(9, 43, 7, 3, 'Presentacion joins', 'Tipos de joins con ejemplos', 'https://cdn.kmap.edu/materiales/bd101_t3_joins.pptx', 1),
(9, 44, 7, 1, 'Taller normalizacion', 'Ejercicios de 1FN a BCNF', 'https://cdn.kmap.edu/materiales/bd101_t4_taller.pdf', 1),
(9, 45, 7, 5, 'Diagrama indices y vistas', 'Optimizacion visual', 'https://cdn.kmap.edu/materiales/bd101_t5_diagrama.png', 1),
(10, 46, 7, 1, 'Guia vocabulario tecnico', 'Terminos de ingenieria', 'https://cdn.kmap.edu/materiales/ing101_t1_guia.pdf', 1),
(10, 47, 7, 2, 'Video comprension lectora', 'Estrategias de lectura tecnica', 'https://cdn.kmap.edu/materiales/ing101_t2_video.mp4', 1),
(10, 48, 7, 3, 'Presentacion gramatica', 'Tiempos verbales y estructuras', 'https://cdn.kmap.edu/materiales/ing101_t3_gramatica.pptx', 1),
(10, 49, 7, 1, 'Taller escritura tecnica', 'Informes y documentacion', 'https://cdn.kmap.edu/materiales/ing101_t4_taller.pdf', 1),
(10, 50, 7, 7, 'Audio listening', 'Comprension auditiva con transcripcion', 'https://cdn.kmap.edu/materiales/ing101_t5_audio.mp3', 1),
(11, 51, 3, 1, 'Guia medidas de tendencia', 'Media, mediana y moda', 'https://cdn.kmap.edu/materiales/est101_t1_guia.pdf', 1),
(11, 52, 3, 2, 'Video dispersion', 'Varianza y desviacion estandar', 'https://cdn.kmap.edu/materiales/est101_t2_video.mp4', 1),
(11, 53, 3, 3, 'Presentacion graficos', 'Histogramas y pastel', 'https://cdn.kmap.edu/materiales/est101_t3_graficos.pptx', 1),
(11, 54, 3, 1, 'Taller probabilidad', 'Espacios muestrales y eventos', 'https://cdn.kmap.edu/materiales/est101_t4_taller.pdf', 1),
(11, 55, 3, 9, 'Hoja de calculo distribuciones', 'Binomial y normal con formulas', 'https://cdn.kmap.edu/materiales/est101_t5_hoja.xlsx', 1),
(12, 56, 6, 1, 'Guia modelo OSI', 'Las siete capas explicadas', 'https://cdn.kmap.edu/materiales/red101_t1_guia.pdf', 1),
(12, 57, 6, 2, 'Video TCP/IP', 'Protocolos y capas', 'https://cdn.kmap.edu/materiales/red101_t2_video.mp4', 1),
(12, 58, 6, 3, 'Presentacion direccionamiento IP', 'IPv4, IPv6 y subredes', 'https://cdn.kmap.edu/materiales/red101_t3_ip.pptx', 1),
(12, 59, 6, 1, 'Taller dispositivos de red', 'Routers, switches y hubs', 'https://cdn.kmap.edu/materiales/red101_t4_taller.pdf', 1),
(12, 60, 6, 8, 'Enlace seguridad basica', 'Curso externo de firewalls', 'https://externo.kmap.edu/curso/seguridad', 1);

-- ============================================================
-- 9. CATALOGO_TIPOS_PREGUNTA
-- ============================================================
INSERT INTO catalogo_tipos_pregunta (nombre_del_tipo, descripcion_del_tipo) VALUES
('seleccion_multiple', 'Pregunta con varias opciones y una sola correcta'),
('verdadero_falso', 'Pregunta de dos opciones'),
('respuesta_corta', 'Respuesta escrita breve'),
('ensayo', 'Respuesta extensa evaluada manualmente'),
('emparejamiento', 'Relacionar columnas'),
('completar', 'Completar espacios en blanco');

-- ============================================================
-- 10. BANCO_PREGUNTAS (103 preguntas independientes)
-- ============================================================
INSERT INTO banco_preguntas (id_tema_conocimiento, id_catalogo_tipos_pregunta, texto_de_la_pregunta, nivel_de_dificultad, esta_habilitada) VALUES
(1, 1, 'Cual es el resultado de -5 + 8?', 20, 1),
(1, 2, 'La suma de dos numeros negativos siempre es negativa.', 30, 1),
(1, 3, 'Escribe el resultado de 3/4 + 1/4', 40, 1),
(2, 1, 'Cual es el valor de 2^5?', 30, 1),
(2, 1, 'Cual es la raiz cuadrada de 81?', 30, 1),
(2, 2, 'La raiz cubica de un numero negativo es siempre negativa.', 50, 1),
(3, 1, 'Cual es la factorizacion de x^2 - 9?', 50, 1),
(3, 3, 'Simplifica 3x + 2x - x', 40, 1),
(4, 1, 'Cual es la solucion de 2x + 3 = 11?', 40, 1),
(4, 2, 'Una ecuacion lineal siempre tiene una unica solucion.', 50, 1),
(5, 1, 'Cual es el area de un rectangulo de 5 cm por 3 cm?', 30, 1),
(5, 3, 'Escribe la formula del area del circulo', 40, 1),
(6, 1, 'Cual es el producto punto de (1,2) y (3,4)?', 50, 1),
(6, 2, 'El producto punto de vectores ortogonales es cero.', 40, 1),
(7, 1, 'Cual es el determinante de la matriz [[1,2],[3,4]]?', 60, 1),
(7, 2, 'Toda matriz cuadrada tiene inversa.', 70, 1),
(8, 1, 'En el metodo de Gauss-Jordan, el objetivo es obtener una matriz identidad ampliada.', 60, 1),
(8, 3, 'Cuantas variables tiene un sistema 3x3?', 40, 1),
(9, 1, 'Un conjunto de vectores es base si son linealmente independientes y generan el espacio.', 70, 1),
(9, 2, 'La dimension de R^3 es 3.', 50, 1),
(10, 1, 'El nucleo de una transformacion lineal es siempre un subespacio.', 70, 1),
(10, 2, 'Una transformacion lineal puede no preservar la suma.', 60, 1),
(11, 1, 'Cual es el limite de (x^2 - 1)/(x - 1) cuando x tiende a 1?', 60, 1),
(11, 2, 'El limite de una funcion en un punto siempre existe.', 70, 1),
(11, 3, 'Calcula el limite de 1/x cuando x tiende a infinito', 50, 1),
(12, 1, 'Una funcion es continua en un punto si el limite existe y es igual al valor de la funcion.', 60, 1),
(12, 2, 'Toda funcion polinomica es continua en todos los reales.', 50, 1),
(13, 1, 'Cual es la derivada de x^2?', 40, 1),
(13, 1, 'Cual es la derivada de sen(x)?', 50, 1),
(13, 2, 'La derivada de una constante es cero.', 30, 1),
(14, 1, 'Para encontrar un maximo local, la derivada debe ser cero o no existir.', 60, 1),
(14, 3, 'Que prueba se usa para determinar concavidad?', 70, 1),
(15, 1, 'Un punto de inflexion ocurre donde cambia la concavidad.', 70, 1),
(15, 2, 'La segunda derivada positiva indica concavidad hacia arriba.', 60, 1),
(16, 1, 'Un objeto en MRU recorre distancias iguales en tiempos iguales.', 40, 1),
(16, 3, 'Cual es la formula de la velocidad en MRU?', 30, 1),
(17, 1, 'La segunda ley de Newton establece que F = m * a.', 40, 1),
(17, 2, 'La inercia es la resistencia al cambio de movimiento.', 50, 1),
(18, 1, 'El trabajo realizado por una fuerza conservativa depende solo de los puntos inicial y final.', 70, 1),
(18, 2, 'La energia mecanica total se conserva en sistemas conservativos.', 60, 1),
(19, 1, 'En un choque elastico se conserva el momento lineal y la energia cinetica.', 70, 1),
(19, 2, 'El impulso es igual al cambio de momento lineal.', 60, 1),
(20, 1, 'La velocidad angular se mide en radianes por segundo.', 50, 1),
(20, 3, 'Escribe la formula de la aceleracion centripeta', 60, 1),
(21, 1, 'Cuantos electrones puede tener el nivel 2?', 50, 1),
(21, 2, 'El modelo de Bohr introdujo niveles de energia cuantizados.', 60, 1),
(22, 1, 'Los metales alcalinos estan en el grupo 1 de la tabla periodica.', 50, 1),
(22, 2, 'La electronegatividad aumenta de izquierda a derecha en un periodo.', 70, 1),
(23, 1, 'Un enlace ionico se forma entre un metal y un no metal.', 60, 1),
(23, 2, 'El enlace covalente implica comparticion de electrones.', 50, 1),
(24, 1, 'Cuantos moles hay en 36 g de agua (H2O, masa molar 18 g/mol)?', 70, 1),
(24, 2, 'La estequiometria se basa en la conservacion de la masa.', 60, 1),
(25, 1, 'Una reaccion de sintesis combina dos o mas sustancias para formar una.', 50, 1),
(25, 3, 'Escribe la ecuacion balanceada de la combustion del metano', 80, 1),
(26, 1, 'La membrana celular es una bicapa lipidica.', 50, 1),
(26, 2, 'La osmosis es un tipo de transporte pasivo.', 60, 1),
(27, 1, 'Cual organelo produce ATP?', 50, 1),
(27, 3, 'Menciona dos funciones del reticulo endoplasmatico', 60, 1),
(28, 1, 'El catabolismo libera energia.', 50, 1),
(28, 2, 'La fotosintesis es un proceso anabolico.', 60, 1),
(29, 1, 'La mitosis produce dos celulas hijas identicas.', 50, 1),
(29, 2, 'La meiosis produce cuatro celulas hijas con la mitad de cromosomas.', 60, 1),
(30, 1, 'En la herencia mendeliana, los alelos dominantes enmascaran a los recesivos.', 60, 1),
(30, 3, 'Cual es el genotipo de un individuo heterocigoto?', 50, 1),
(31, 1, 'Una variable de tipo entero puede almacenar numeros decimales.', 30, 1),
(31, 3, 'Declara una variable de tipo cadena en pseudocodigo', 40, 1),
(32, 1, 'Un bucle while se ejecuta mientras la condicion sea verdadera.', 40, 1),
(32, 2, 'Una estructura if-else permite tomar decisiones.', 30, 1),
(33, 1, 'Una funcion puede retornar un valor.', 40, 1),
(33, 3, 'Escribe la diferencia entre parametro y argumento', 60, 1),
(34, 1, 'Un arreglo unidimensional almacena elementos del mismo tipo.', 40, 1),
(34, 2, 'Los indices de un arreglo siempre comienzan en 1.', 50, 1),
(35, 1, 'La busqueda binaria requiere que el arreglo este ordenado.', 60, 1),
(35, 3, 'Menciona un algoritmo de ordenamiento simple', 50, 1),
(36, 1, 'Una lista enlazada simple permite recorrido en ambos sentidos.', 60, 1),
(36, 2, 'Las listas enlazadas pueden crecer dinamicamente.', 50, 1),
(37, 1, 'Una pila sigue el principio LIFO.', 50, 1),
(37, 2, 'Una cola sigue el principio FIFO.', 50, 1),
(38, 1, 'Un arbol binario tiene como maximo dos hijos por nodo.', 50, 1),
(38, 3, 'Menciona los tres recorridos de un arbol binario', 60, 1),
(39, 1, 'BFS utiliza una cola para recorrer grafos.', 60, 1),
(39, 2, 'DFS utiliza una pila o recursion para recorrer grafos.', 60, 1),
(40, 1, 'La notacion Big-O mide el tiempo de ejecucion en el peor caso.', 70, 1),
(40, 2, 'O(1) es mejor que O(n^2) en terminos de crecimiento.', 50, 1),
(41, 1, 'En el modelo relacional, una clave primaria identifica univocamente una fila.', 50, 1),
(41, 3, 'Define clave foranea', 60, 1),
(42, 1, 'Que comando SQL se usa para consultar datos?', 40, 1),
(42, 2, 'DELETE elimina filas de una tabla.', 50, 1),
(43, 1, 'INNER JOIN devuelve solo las filas que coinciden en ambas tablas.', 60, 1),
(43, 3, 'Escribe un ejemplo de LEFT JOIN', 70, 1),
(44, 1, 'La primera forma normal elimina grupos repetidos.', 60, 1),
(44, 2, 'La tercera forma normal elimina dependencias transitivas.', 70, 1),
(45, 1, 'Un indice acelera las consultas a costa de espacio y escritura.', 60, 1),
(45, 2, 'Una vista es una tabla virtual basada en una consulta.', 50, 1),
(46, 1, 'El vocabulario tecnico incluye terminos especificos de una disciplina.', 50, 1),
(46, 3, 'Traduce al ingles: red de computadores', 40, 1),
(47, 1, 'La comprension lectora implica identificar ideas principales.', 50, 1),
(47, 2, 'Skimming es una tecnica de lectura rapida.', 60, 1),
(48, 1, 'El presente simple se usa para rutinas.', 50, 1),
(48, 2, 'El pasado simple de "run" es "runned".', 40, 1),
(49, 1, 'Un informe tecnico debe tener una estructura clara.', 50, 1),
(49, 3, 'Menciona tres partes de un informe tecnico', 60, 1),
(50, 1, 'Listening es la habilidad de comprension auditiva.', 40, 1),
(50, 2, 'Tomar notas mientras se escucha puede mejorar la comprension.', 50, 1),
(51, 1, 'La media aritmetica se calcula sumando todos los datos y dividiendo por el numero de datos.', 40, 1),
(51, 3, 'Calcula la media de 2, 4, 6, 8', 30, 1),
(52, 1, 'La varianza mide la dispersion de los datos respecto a la media.', 50, 1),
(52, 2, 'La desviacion estandar es la raiz cuadrada de la varianza.', 50, 1),
(53, 1, 'Un histograma muestra la distribucion de frecuencias.', 50, 1),
(53, 2, 'Un grafico de pastel muestra proporciones.', 40, 1),
(54, 1, 'La probabilidad de un evento seguro es 1.', 50, 1),
(54, 3, 'Cual es la probabilidad de obtener cara al lanzar una moneda?', 30, 1),
(55, 1, 'La distribucion normal es simetrica respecto a la media.', 60, 1),
(55, 2, 'La distribucion binomial modela ensayos de Bernoulli.', 60, 1),
(56, 1, 'El modelo OSI tiene siete capas.', 40, 1),
(56, 3, 'Menciona las capas del modelo OSI de abajo hacia arriba', 70, 1),
(57, 1, 'TCP es orientado a conexion.', 60, 1),
(57, 2, 'UDP garantiza la entrega de paquetes.', 70, 1),
(58, 1, 'Cuantos bits tiene una direccion IPv4?', 50, 1),
(58, 2, 'IPv6 usa direcciones de 128 bits.', 60, 1),
(59, 1, 'Un router opera en la capa de red.', 60, 1),
(59, 2, 'Un switch opera en la capa de enlace de datos.', 60, 1),
(60, 1, 'Un firewall puede filtrar trafico por puerto.', 60, 1),
(60, 3, 'Menciona un protocolo de cifrado para redes', 70, 1);

-- ============================================================
-- 11. OPCION_RESPUESTA
-- ============================================================
INSERT INTO opcion_respuesta (id_banco_preguntas, texto_de_la_opcion, orden_en_que_aparece) VALUES
(1, '3', 1), (1, '-3', 2), (1, '13', 3), (1, '-13', 4),
(2, 'Verdadero', 1), (2, 'Falso', 2),
(4, '32', 1), (4, '25', 2), (4, '10', 3), (4, '64', 4),
(5, '9', 1), (5, '8', 2), (5, '7', 3), (5, '10', 4),
(6, 'Verdadero', 1), (6, 'Falso', 2),
(7, '(x-3)(x+3)', 1), (7, '(x-9)(x+1)', 2), (7, '(x+3)^2', 3), (7, 'No factoriza', 4),
(9, 'x=4', 1), (9, 'x=3', 2), (9, 'x=5', 3), (9, 'x=-4', 4),
(10, 'Verdadero', 1), (10, 'Falso', 2),
(11, '15 cm2', 1), (11, '8 cm2', 2), (11, '16 cm2', 3), (11, '30 cm2', 4),
(13, '11', 1), (13, '10', 2), (13, '7', 3), (13, '12', 4),
(14, 'Verdadero', 1), (14, 'Falso', 2),
(15, '-2', 1), (15, '2', 2), (15, '10', 3), (15, '-10', 4),
(16, 'Falso', 1), (16, 'Verdadero', 2),
(17, 'Verdadero', 1), (17, 'Falso', 2),
(19, 'Verdadero', 1), (19, 'Falso', 2),
(20, 'Verdadero', 1), (20, 'Falso', 2),
(21, 'Verdadero', 1), (21, 'Falso', 2),
(22, 'Falso', 1), (22, 'Verdadero', 2),
(23, '0.5', 1), (23, '1', 2), (23, '0', 3), (23, 'No existe', 4),
(24, 'Falso', 1), (24, 'Verdadero', 2),
(26, 'Verdadero', 1), (26, 'Falso', 2),
(27, 'Verdadero', 1), (27, 'Falso', 2),
(28, '2x', 1), (28, 'x', 2), (28, 'x^2', 3), (28, '2', 4),
(29, 'cos(x)', 1), (29, '-cos(x)', 2), (29, 'sen(x)', 3), (29, '-sen(x)', 4),
(30, 'Verdadero', 1), (30, 'Falso', 2),
(31, 'Verdadero', 1), (31, 'Falso', 2),
(33, 'Verdadero', 1), (33, 'Falso', 2),
(34, 'Verdadero', 1), (34, 'Falso', 2),
(36, 'Verdadero', 1), (36, 'Falso', 2),
(37, 'Verdadero', 1), (37, 'Falso', 2),
(38, 'Verdadero', 1), (38, 'Falso', 2),
(39, 'Verdadero', 1), (39, 'Falso', 2),
(40, 'Verdadero', 1), (40, 'Falso', 2),
(41, 'Verdadero', 1), (41, 'Falso', 2),
(42, 'Verdadero', 1), (42, 'Falso', 2),
(43, 'Verdadero', 1), (43, 'Falso', 2),
(44, 'Verdadero', 1), (44, 'Falso', 2),
(45, 'Verdadero', 1), (45, 'Falso', 2),
(46, '8', 1), (46, '2', 2), (46, '6', 3), (46, '10', 4),
(47, 'Verdadero', 1), (47, 'Falso', 2),
(48, 'Verdadero', 1), (48, 'Falso', 2),
(49, 'Verdadero', 1), (49, 'Falso', 2),
(50, 'Verdadero', 1), (50, 'Falso', 2),
(51, 'Verdadero', 1), (51, 'Falso', 2),
(52, 'Verdadero', 1), (52, 'Falso', 2),
(53, 'Verdadero', 1), (53, 'Falso', 2),
(54, 'Verdadero', 1), (54, 'Falso', 2),
(55, 'Mitocondria', 1), (55, 'Nucleo', 2), (55, 'Ribosoma', 3), (55, 'Lisosoma', 4),
(56, 'Verdadero', 1), (56, 'Falso', 2),
(57, 'Verdadero', 1), (57, 'Falso', 2),
(58, 'Verdadero', 1), (58, 'Falso', 2),
(59, 'Verdadero', 1), (59, 'Falso', 2),
(60, 'Verdadero', 1), (60, 'Falso', 2),
(61, 'Falso', 1), (61, 'Verdadero', 2),
(62, 'Verdadero', 1), (62, 'Falso', 2),
(63, 'Verdadero', 1), (63, 'Falso', 2),
(64, 'Verdadero', 1), (64, 'Falso', 2),
(65, 'Verdadero', 1), (65, 'Falso', 2),
(66, 'Falso', 1), (66, 'Verdadero', 2),
(67, 'Verdadero', 1), (67, 'Falso', 2),
(68, 'Verdadero', 1), (68, 'Falso', 2),
(69, 'Verdadero', 1), (69, 'Falso', 2),
(70, 'Verdadero', 1), (70, 'Falso', 2),
(71, 'Verdadero', 1), (71, 'Falso', 2),
(72, 'Verdadero', 1), (72, 'Falso', 2),
(73, 'Verdadero', 1), (73, 'Falso', 2),
(74, 'Verdadero', 1), (74, 'Falso', 2),
(75, 'Verdadero', 1), (75, 'Falso', 2),
(76, 'Verdadero', 1), (76, 'Falso', 2),
(77, 'SELECT', 1), (77, 'GET', 2), (77, 'FETCH', 3), (77, 'QUERY', 4),
(78, 'Verdadero', 1), (78, 'Falso', 2),
(79, 'Verdadero', 1), (79, 'Falso', 2),
(80, 'Verdadero', 1), (80, 'Falso', 2),
(81, 'Verdadero', 1), (81, 'Falso', 2),
(82, 'Verdadero', 1), (82, 'Falso', 2),
(83, 'Verdadero', 1), (83, 'Falso', 2),
(84, 'Verdadero', 1), (84, 'Falso', 2),
(85, 'Verdadero', 1), (85, 'Falso', 2),
(86, 'runed', 1), (86, 'ran', 2), (86, 'runned', 3), (86, 'running', 4),
(87, 'Verdadero', 1), (87, 'Falso', 2),
(88, 'Verdadero', 1), (88, 'Falso', 2),
(89, 'Verdadero', 1), (89, 'Falso', 2),
(90, '5', 1), (90, '4', 2), (90, '6', 3), (90, '7', 4),
(91, 'Verdadero', 1), (91, 'Falso', 2),
(92, 'Verdadero', 1), (92, 'Falso', 2),
(93, 'Verdadero', 1), (93, 'Falso', 2),
(94, 'Verdadero', 1), (94, 'Falso', 2),
(95, '0.5', 1), (95, '1', 2), (95, '0', 3), (95, '0.25', 4),
(96, 'Verdadero', 1), (96, 'Falso', 2),
(97, 'Verdadero', 1), (97, 'Falso', 2),
(98, 'Verdadero', 1), (98, 'Falso', 2),
(99, '32 bits', 1), (99, '64 bits', 2), (99, '128 bits', 3), (99, '16 bits', 4),
(100, 'Verdadero', 1), (100, 'Falso', 2),
(101, 'Verdadero', 1), (101, 'Falso', 2),
(102, 'Verdadero', 1), (102, 'Falso', 2),
(103, 'Verdadero', 1), (103, 'Falso', 2);

-- ============================================================
-- 12. EVALUACION_QUIZ
-- ============================================================
INSERT INTO evaluacion_quiz (id_materia_asignatura, id_tema_conocimiento, titulo_del_quiz, tiempo_limite_en_milisegundos, esta_habilitado) VALUES
(1, 1, 'Quiz de numeros enteros', 600000, 1),
(1, 4, 'Quiz de algebra basica', 900000, 1),
(2, 6, 'Quiz de vectores', 1200000, 1),
(2, 8, 'Quiz de sistemas de ecuaciones', 900000, 1),
(3, 11, 'Quiz de limites y continuidad', 1200000, 1),
(3, 13, 'Quiz de derivadas', 1200000, 1),
(4, 16, 'Quiz de cinematica', 900000, 1),
(4, 17, 'Quiz de dinamica', 1200000, 1),
(5, 21, 'Quiz de estructura atomica', 900000, 1),
(5, 23, 'Quiz de enlaces quimicos', 1200000, 1),
(6, 26, 'Quiz de membrana celular', 900000, 1),
(6, 28, 'Quiz de metabolismo', 1200000, 1),
(7, 31, 'Quiz de variables y tipos', 900000, 1),
(7, 33, 'Quiz de funciones', 1200000, 1),
(8, 36, 'Quiz de listas enlazadas', 1200000, 1),
(9, 41, 'Quiz de modelo relacional', 900000, 1),
(9, 42, 'Quiz de SQL basico', 1200000, 1),
(10, 46, 'Quiz de vocabulario tecnico', 600000, 1),
(11, 51, 'Quiz de medidas de tendencia central', 900000, 1),
(12, 56, 'Quiz de modelo OSI', 900000, 1);

-- ============================================================
-- 13. PREGUNTAS_DEL_QUIZ (asignacion de preguntas a cada quiz)
-- ============================================================
INSERT INTO preguntas_del_quiz (id_evaluacion_quiz, id_banco_preguntas, orden_en_el_quiz) VALUES
-- Quiz 1 (Numeros enteros): preguntas 1,2,3
(1, 1, 1), (1, 2, 2), (1, 3, 3),
-- Quiz 2 (Algebra basica): preguntas 4,5,6,7,8
(2, 4, 1), (2, 5, 2), (2, 6, 3), (2, 7, 4), (2, 8, 5),
-- Quiz 3 (Vectores): preguntas 13,14
(3, 13, 1), (3, 14, 2),
-- Quiz 4 (Sistemas de ecuaciones): preguntas 17,18
(4, 17, 1), (4, 18, 2),
-- Quiz 5 (Limites y continuidad): preguntas 23,24,26
(5, 23, 1), (5, 24, 2), (5, 26, 3),
-- Quiz 6 (Derivadas): preguntas 28,29,30
(6, 28, 1), (6, 29, 2), (6, 30, 3),
-- Quiz 7 (Cinematica): preguntas 34,35,36
(7, 34, 1), (7, 35, 2), (7, 36, 3),
-- Quiz 8 (Dinamica): preguntas 37,38
(8, 37, 1), (8, 38, 2),
-- Quiz 9 (Estructura atomica): preguntas 41,42
(9, 41, 1), (9, 42, 2),
-- Quiz 10 (Enlaces quimicos): preguntas 46,47
(10, 46, 1), (10, 47, 2),
-- Quiz 11 (Membrana celular): preguntas 51,52
(11, 51, 1), (11, 52, 2),
-- Quiz 12 (Metabolismo): preguntas 56,57
(12, 56, 1), (12, 57, 2),
-- Quiz 13 (Variables y tipos): preguntas 61,62
(13, 61, 1), (13, 62, 2),
-- Quiz 14 (Funciones): preguntas 64,65
(14, 64, 1), (14, 65, 2),
-- Quiz 15 (Listas enlazadas): preguntas 70,71,72
(15, 70, 1), (15, 71, 2), (15, 72, 3),
-- Quiz 16 (Modelo relacional): preguntas 76,77,78
(16, 76, 1), (16, 77, 2), (16, 78, 3),
-- Quiz 17 (SQL basico): preguntas 79,80,81
(17, 79, 1), (17, 80, 2), (17, 81, 3),
-- Quiz 18 (Vocabulario tecnico): preguntas 82,83,84
(18, 82, 1), (18, 83, 2), (18, 84, 3),
-- Quiz 19 (Medidas de tendencia central): preguntas 85,86,87
(19, 85, 1), (19, 86, 2), (19, 87, 3),
-- Quiz 20 (Modelo OSI): preguntas 100,101,102
(20, 100, 1), (20, 101, 2), (20, 102, 3);

-- ============================================================
-- 14. RESPUESTA_OFICIAL_QUIZ
-- ============================================================
INSERT INTO respuesta_oficial_quiz (id_preguntas_del_quiz, id_opcion_correcta, texto_correcto) VALUES
-- Quiz 1
(1, 1, NULL),      -- pregunta 1 -> opcion 1
(2, 5, NULL),      -- pregunta 2 -> opcion 5 (Verdadero)
(3, NULL, '1'),    -- pregunta 3 -> texto
-- Quiz 2
(4, 7, NULL),      -- pregunta 4 -> opcion 7
(5, 11, NULL),     -- pregunta 5 -> opcion 11
(6, 14, NULL),     -- pregunta 6 -> opcion 14
(7, 15, NULL),     -- pregunta 7 -> opcion 15
(8, NULL, '4x'),   -- pregunta 8 -> texto
-- Quiz 3
(9, 23, NULL),     -- pregunta 13 -> opcion 23
(10, 26, NULL),    -- pregunta 14 -> opcion 26
-- Quiz 4
(11, 31, NULL),    -- pregunta 17 -> opcion 31
(12, 34, NULL),    -- pregunta 18 -> opcion 34
-- Quiz 5
(13, 35, NULL),    -- pregunta 23 -> opcion 35
(14, 38, NULL),    -- pregunta 24 -> opcion 38
(15, 39, NULL),    -- pregunta 26 -> opcion 39
-- Quiz 6
(16, 43, NULL),    -- pregunta 28 -> opcion 43
(17, 45, NULL),    -- pregunta 29 -> opcion 45
(18, NULL, '0'),   -- pregunta 30 -> texto
-- Quiz 7
(19, 47, NULL),    -- pregunta 34 -> opcion 47
(20, 50, NULL),    -- pregunta 35 -> opcion 50
(21, NULL, 'v = d / t'), -- pregunta 36 -> texto
-- Quiz 8
(22, 51, NULL),    -- pregunta 37 -> opcion 51
(23, 54, NULL),    -- pregunta 38 -> opcion 54
-- Quiz 9
(24, 57, NULL),    -- pregunta 41 -> opcion 57
(25, 59, NULL),    -- pregunta 42 -> opcion 59
-- Quiz 10
(26, 61, NULL),    -- pregunta 46 -> opcion 61
(27, 63, NULL),    -- pregunta 47 -> opcion 63
-- Quiz 11
(28, 65, NULL),    -- pregunta 51 -> opcion 65
(29, 67, NULL),    -- pregunta 52 -> opcion 67
-- Quiz 12
(30, 69, NULL),    -- pregunta 56 -> opcion 69
(31, 71, NULL),    -- pregunta 57 -> opcion 71
-- Quiz 13
(32, 75, NULL),    -- pregunta 61 -> opcion 75
(33, 77, NULL),    -- pregunta 62 -> opcion 77
-- Quiz 14
(34, 79, NULL),    -- pregunta 64 -> opcion 79
(35, 81, NULL),    -- pregunta 65 -> opcion 81
-- Quiz 15
(36, 85, NULL),    -- pregunta 70 -> opcion 85
(37, 87, NULL),    -- pregunta 71 -> opcion 87
(38, NULL, 'inorden, preorden, postorden'), -- pregunta 72
-- Quiz 16
(39, 93, NULL),    -- pregunta 76 -> opcion 93
(40, 95, NULL),    -- pregunta 77 -> opcion 95
(41, NULL, 'clave que referencia la clave primaria de otra tabla'), -- pregunta 78
-- Quiz 17
(42, 101, NULL),   -- pregunta 79 -> opcion 101
(43, 103, NULL),   -- pregunta 80 -> opcion 103
(44, NULL, 'SELECT * FROM tabla LEFT JOIN otra ON ...'), -- pregunta 81
-- Quiz 18
(45, 105, NULL),   -- pregunta 82 -> opcion 105
(46, 107, NULL),   -- pregunta 83 -> opcion 107
(47, NULL, 'computer network'), -- pregunta 84
-- Quiz 19
(48, 109, NULL),   -- pregunta 85 -> opcion 109
(49, 111, NULL),   -- pregunta 86 -> opcion 111
(50, NULL, '5'),   -- pregunta 87 -> texto
-- Quiz 20
(51, 113, NULL),   -- pregunta 100 -> opcion 113
(52, 115, NULL),   -- pregunta 101 -> opcion 115
(53, NULL, 'fisica, enlace de datos, red, transporte, sesion, presentacion, aplicacion'); -- pregunta 102

-- ============================================================
-- 15. INTENTO_DE_QUIZ
-- ============================================================
INSERT INTO intento_de_quiz (id_evaluacion_quiz, id_usuario_estudiante, fecha_en_que_inicio, fecha_en_que_termino, tiempo_total_en_milisegundos, puntaje_que_obtuvo, estado_del_intento) VALUES
(1, 8,  '2025-01-10 08:00:00', '2025-01-10 08:08:30', 510000, 85.00, 'completado'),
(1, 9,  '2025-01-10 09:00:00', '2025-01-10 09:09:10', 550000, 72.50, 'completado'),
(1, 10, '2025-01-10 10:00:00', '2025-01-10 10:07:45', 465000, 90.00, 'completado'),
(2, 8,  '2025-01-11 08:00:00', '2025-01-11 08:12:20', 740000, 78.00, 'completado'),
(2, 11, '2025-01-11 09:00:00', '2025-01-11 09:14:10', 850000, 65.00, 'completado'),
(3, 8,  '2025-01-12 08:00:00', '2025-01-12 08:16:40', 1000000, 88.00, 'completado'),
(3, 13, '2025-01-12 09:00:00', '2025-01-12 09:18:30', 1110000, 74.00, 'completado'),
(4, 14, '2025-01-13 08:00:00', '2025-01-13 08:13:20', 800000, 81.50, 'completado'),
(5, 9,  '2025-01-14 08:00:00', '2025-01-14 08:17:10', 1030000, 79.00, 'completado'),
(5, 16, '2025-01-14 09:00:00', '2025-01-14 09:19:30', 1170000, 62.00, 'completado'),
(6, 17, '2025-01-15 08:00:00', '2025-01-15 08:18:20', 1100000, 84.00, 'completado'),
(7, 10, '2025-01-16 08:00:00', '2025-01-16 08:11:30', 690000, 92.00, 'completado'),
(7, 19, '2025-01-16 09:00:00', '2025-01-16 09:12:10', 730000, 58.00, 'completado'),
(8, 20, '2025-01-17 08:00:00', '2025-01-17 08:15:40', 940000, 76.00, 'completado'),
(9, 11, '2025-01-18 08:00:00', '2025-01-18 08:10:20', 620000, 89.00, 'completado'),
(9, 22, '2025-01-18 09:00:00', '2025-01-18 09:11:10', 670000, 71.00, 'completado'),
(10, 23, '2025-01-19 08:00:00', '2025-01-19 08:14:50', 890000, 68.00, 'completado'),
(11, 12, '2025-01-20 08:00:00', '2025-01-20 08:09:30', 570000, 94.00, 'completado'),
(11, 25, '2025-01-20 09:00:00', '2025-01-20 09:10:40', 640000, 55.00, 'completado'),
(12, 26, '2025-01-21 08:00:00', '2025-01-21 08:12:50', 770000, 82.00, 'completado'),
(13, 13, '2025-01-22 08:00:00', '2025-01-22 08:11:20', 680000, 90.00, 'completado'),
(13, 28, '2025-01-22 09:00:00', '2025-01-22 09:12:30', 750000, 67.00, 'completado'),
(14, 29, '2025-01-23 08:00:00', '2025-01-23 08:14:10', 850000, 73.00, 'completado'),
(14, 30, '2025-01-23 09:00:00', '2025-01-23 09:15:20', 920000, 80.00, 'completado'),
(15, 14, '2025-01-24 08:00:00', '2025-01-24 08:13:40', 820000, 77.00, 'completado'),
(15, 37, '2025-01-24 09:00:00', '2025-01-24 09:14:50', 890000, 86.00, 'completado'),
(16, 15, '2025-01-25 08:00:00', '2025-01-25 08:09:10', 550000, 91.00, 'completado'),
(16, 40, '2025-01-25 09:00:00', '2025-01-25 09:10:20', 620000, 60.00, 'completado'),
(17, 8,  '2025-01-26 08:00:00', '2025-01-26 08:12:30', 750000, 83.00, 'completado'),
(17, 9,  '2025-01-26 09:00:00', '2025-01-26 09:13:40', 820000, 70.00, 'completado'),
(18, 16, '2025-01-27 08:00:00', '2025-01-27 08:08:20', 500000, 88.00, 'completado'),
(18, 17, '2025-01-27 09:00:00', '2025-01-27 09:09:30', 570000, 75.00, 'completado'),
(19, 18, '2025-01-28 08:00:00', '2025-01-28 08:11:40', 700000, 80.00, 'completado'),
(20, 19, '2025-01-29 08:00:00', '2025-01-29 08:10:10', 610000, 95.00, 'completado'),
(1, 12, '2025-02-01 08:00:00', NULL, NULL, 0.00, 'en_curso'),
(3, 15, '2025-02-01 09:00:00', NULL, NULL, 0.00, 'en_curso'),
(5, 18, '2025-02-02 08:00:00', NULL, NULL, 0.00, 'en_curso'),
(7, 20, '2025-02-02 09:00:00', '2025-02-02 09:05:00', 300000, 0.00, 'abandonado'),
(9, 24, '2025-02-03 08:00:00', '2025-02-03 09:06:00', 360000, 0.00, 'abandonado');

-- ============================================================
-- 16. RESPUESTA_ESTUDIANTE
-- ============================================================
INSERT INTO respuesta_estudiante (id_intento_de_quiz, id_preguntas_del_quiz, id_opcion_que_eligio, texto_que_escribio, fue_correcta_su_respuesta, tiempo_que_tardo_en_responder_milisegundos) VALUES
(1, 1, 1, NULL, 1, 15000),
(1, 2, 5, NULL, 1, 12000),
(1, 3, NULL, '1', 1, 20000),
(2, 1, 2, NULL, 0, 25000),
(2, 2, 5, NULL, 1, 14000),
(2, 3, NULL, '0.5', 0, 30000),
(3, 1, 1, NULL, 1, 10000),
(3, 2, 6, NULL, 0, 8000),
(4, 4, 7, NULL, 1, 20000),
(4, 5, 11, NULL, 1, 18000),
(5, 4, 8, NULL, 0, 25000),
(5, 5, 11, NULL, 1, 20000),
(6, 9, 23, NULL, 1, 15000),
(6, 10, 26, NULL, 1, 12000),
(7, 9, 24, NULL, 0, 20000),
(7, 10, 26, NULL, 1, 15000),
(8, 11, 31, NULL, 1, 10000),
(8, 12, 34, NULL, 1, 12000),
(9, 13, 35, NULL, 1, 18000),
(9, 14, 38, NULL, 1, 15000),
(9, 15, 39, NULL, 1, 25000),
(10, 13, 36, NULL, 0, 22000),
(10, 14, 38, NULL, 1, 20000),
(11, 16, 43, NULL, 1, 15000),
(11, 17, 45, NULL, 1, 12000),
(11, 18, NULL, '0', 1, 30000),
(12, 19, 47, NULL, 1, 8000),
(12, 20, 50, NULL, 1, 10000),
(12, 21, NULL, 'distancia/tiempo', 1, 15000),
(13, 19, 48, NULL, 0, 12000),
(13, 20, 50, NULL, 1, 14000),
(14, 22, 51, NULL, 1, 10000),
(14, 23, 54, NULL, 1, 12000),
(15, 24, 57, NULL, 1, 8000),
(15, 25, 59, NULL, 1, 10000),
(16, 24, 58, NULL, 0, 15000),
(16, 25, 59, NULL, 1, 12000),
(17, 26, 61, NULL, 1, 10000),
(17, 27, 63, NULL, 1, 12000),
(18, 26, 62, NULL, 0, 18000),
(18, 27, 63, NULL, 1, 14000),
(19, 28, 65, NULL, 1, 6000),
(19, 29, 67, NULL, 1, 8000),
(20, 28, 66, NULL, 0, 10000),
(20, 29, 67, NULL, 1, 9000),
(21, 30, 69, NULL, 1, 8000),
(21, 31, 71, NULL, 1, 10000),
(22, 30, 70, NULL, 0, 12000),
(22, 31, 71, NULL, 1, 11000),
(23, 32, 75, NULL, 1, 12000),
(23, 33, 77, NULL, 1, 14000),
(24, 32, 76, NULL, 0, 12000),
(24, 33, 77, NULL, 1, 12000),
(25, 34, 79, NULL, 1, 15000),
(25, 35, 81, NULL, 1, 18000),
(26, 34, 80, NULL, 0, 18000),
(26, 35, 81, NULL, 1, 16000),
(27, 36, 85, NULL, 1, 8000),
(27, 37, 87, NULL, 1, 10000),
(27, 38, NULL, 'inorden, preorden, postorden', 1, 15000),
(28, 36, 86, NULL, 0, 12000),
(28, 37, 87, NULL, 1, 11000),
(29, 39, 93, NULL, 1, 7000),
(29, 40, 95, NULL, 1, 9000),
(29, 41, NULL, 'clave que referencia otra tabla', 1, 12000),
(30, 39, 94, NULL, 0, 10000),
(30, 40, 95, NULL, 1, 8000),
(31, 42, 101, NULL, 1, 6000),
(31, 43, 103, NULL, 1, 8000),
(31, 44, NULL, 'ejemplo de left join', 1, 15000),
(32, 42, 102, NULL, 0, 9000),
(32, 43, 103, NULL, 1, 7000),
(33, 45, 105, NULL, 1, 10000),
(33, 46, 107, NULL, 1, 12000),
(33, 47, NULL, 'traduccion', 1, 15000),
(34, 45, 106, NULL, 0, 12000),
(34, 46, 107, NULL, 1, 14000),
(35, 51, 113, NULL, 1, 8000),
(35, 52, 115, NULL, 1, 10000),
(35, 53, NULL, 'las siete capas', 1, 12000),
(36, 51, 114, NULL, 0, 10000),
(36, 52, 115, NULL, 1, 9000);

-- ============================================================
-- 17. RANKING_POR_TEMA
-- ============================================================
INSERT INTO ranking_por_tema (id_tema_conocimiento, id_usuario_estudiante, mejor_puntaje_obtenido, mejor_tiempo_en_milisegundos, posicion_en_el_ranking) VALUES
(1, 10, 90.00, 465000, 1),
(1, 8,  85.00, 510000, 2),
(1, 9,  72.50, 550000, 3),
(1, 12, 0.00,  300000, 4),
(4, 11, 88.00, 1000000, 1),
(4, 8,  78.00, 740000, 2),
(4, 14, 81.50, 800000, 3),
(4, 13, 74.00, 1110000, 4),
(6, 8,  92.00, 690000, 1),
(6, 19, 58.00, 730000, 2),
(6, 13, 74.00, 1110000, 3),
(8, 20, 76.00, 940000, 1),
(8, 14, 81.50, 800000, 2),
(8, 10, 92.00, 690000, 3),
(11, 17, 84.00, 1100000, 1),
(11, 9,  79.00, 1030000, 2),
(11, 16, 62.00, 1170000, 3),
(13, 17, 84.00, 1100000, 1),
(13, 9,  79.00, 1030000, 2),
(16, 11, 89.00, 620000, 1),
(16, 22, 71.00, 670000, 2),
(17, 20, 76.00, 940000, 1),
(17, 19, 58.00, 730000, 2),
(21, 12, 94.00, 570000, 1),
(21, 25, 55.00, 640000, 2),
(21, 23, 68.00, 890000, 3),
(23, 23, 68.00, 890000, 1),
(23, 26, 82.00, 770000, 2),
(26, 13, 90.00, 680000, 1),
(26, 28, 67.00, 750000, 2),
(28, 29, 73.00, 850000, 1),
(28, 30, 80.00, 920000, 2),
(31, 14, 77.00, 820000, 1),
(31, 37, 86.00, 890000, 2),
(33, 15, 91.00, 550000, 1),
(33, 40, 60.00, 620000, 2),
(36, 8,  83.00, 750000, 1),
(36, 9,  70.00, 820000, 2),
(41, 16, 88.00, 500000, 1),
(41, 17, 75.00, 570000, 2),
(42, 18, 80.00, 700000, 1),
(42, 19, 95.00, 610000, 2),
(46, 19, 95.00, 610000, 1),
(46, 20, 76.00, 940000, 2),
(51, 12, 94.00, 570000, 1),
(51, 25, 55.00, 640000, 2),
(56, 13, 90.00, 680000, 1),
(56, 28, 67.00, 750000, 2);

-- ============================================================
-- 18. RESUMEN_ESTADISTICAS_MATERIA
-- ============================================================
INSERT INTO resumen_estadisticas_materia (id_materia_asignatura, total_de_estudiantes_inscritos, total_de_quices_realizados, promedio_general_de_notas, cantidad_de_aprobados, cantidad_de_reprobados) VALUES
(1, 7, 4, 81.88, 3, 1),
(2, 4, 3, 80.50, 2, 1),
(3, 4, 3, 78.33, 2, 1),
(4, 4, 3, 76.50, 2, 1),
(5, 4, 3, 74.67, 1, 2),
(6, 4, 2, 83.00, 2, 0),
(7, 4, 4, 79.50, 2, 2),
(8, 4, 2, 81.50, 2, 0),
(9, 4, 3, 79.00, 3, 0),
(10, 3, 2, 81.50, 2, 0),
(11, 3, 2, 74.50, 1, 1),
(12, 3, 2, 82.50, 2, 0);

-- ============================================================
-- 19. PROGRESO_ACTUAL
-- ============================================================
INSERT INTO progreso_actual (id_usuario_estudiante, id_tema_conocimiento, nota_actual_del_tema, seguridad_del_sistema_en_su_nota, cantidad_de_intentos, estado_de_aprendizaje) VALUES
(8, 1, 85, 80, 2, 'dominado'),
(8, 2, 70, 60, 1, 'en_progreso'),
(8, 3, 60, 50, 1, 'debil'),
(8, 4, 90, 85, 2, 'dominado'),
(9, 1, 72, 70, 1, 'en_progreso'),
(9, 2, 50, 40, 1, 'debil'),
(9, 3, 65, 60, 1, 'en_progreso'),
(10, 1, 90, 85, 1, 'dominado'),
(10, 2, 80, 75, 1, 'dominado'),
(11, 4, 65, 55, 1, 'en_progreso'),
(12, 1, 30, 20, 1, 'debil'),
(13, 6, 88, 80, 1, 'dominado'),
(13, 7, 74, 70, 1, 'en_progreso'),
(14, 8, 81, 75, 1, 'dominado'),
(15, 6, 45, 35, 1, 'debil'),
(16, 11, 79, 70, 1, 'en_progreso'),
(17, 13, 84, 80, 1, 'dominado'),
(18, 11, 62, 50, 1, 'debil'),
(19, 16, 92, 90, 1, 'dominado'),
(20, 17, 58, 45, 1, 'debil'),
(21, 16, 75, 65, 1, 'en_progreso'),
(22, 21, 89, 85, 1, 'dominado'),
(23, 23, 68, 60, 1, 'en_progreso'),
(24, 21, 55, 40, 1, 'debil'),
(25, 26, 94, 90, 1, 'dominado'),
(26, 28, 82, 78, 1, 'dominado'),
(27, 31, 67, 55, 1, 'en_progreso'),
(28, 33, 70, 60, 1, 'en_progreso'),
(29, 36, 73, 65, 1, 'en_progreso'),
(30, 38, 80, 75, 1, 'en_progreso'),
(37, 36, 86, 80, 1, 'dominado'),
(38, 38, 60, 50, 1, 'debil'),
(39, 41, 78, 70, 1, 'en_progreso'),
(40, 46, 91, 88, 1, 'dominado');

-- ============================================================
-- 20. HISTORIAL_DE_PROGRESO
-- ============================================================
INSERT INTO historial_de_progreso (id_usuario_estudiante, id_tema_conocimiento, nota_que_tenia, seguridad_del_sistema_en_su_nota, estado_de_aprendizaje, fecha_en_que_se_registro) VALUES
(8, 1, 70, 65, 'en_progreso', '2025-01-05 08:00:00'),
(8, 1, 85, 80, 'dominado', '2025-01-10 08:08:30'),
(8, 2, 70, 60, 'en_progreso', '2025-01-10 09:00:00'),
(8, 3, 60, 50, 'debil', '2025-01-11 08:00:00'),
(8, 4, 90, 85, 'dominado', '2025-01-12 08:16:40'),
(9, 1, 72, 70, 'en_progreso', '2025-01-10 09:09:10'),
(9, 2, 50, 40, 'debil', '2025-01-11 09:00:00'),
(10, 1, 90, 85, 'dominado', '2025-01-10 10:07:45'),
(11, 4, 65, 55, 'en_progreso', '2025-01-11 09:14:10'),
(12, 1, 30, 20, 'debil', '2025-02-01 08:00:00'),
(13, 6, 88, 80, 'dominado', '2025-01-12 09:18:30'),
(14, 8, 81, 75, 'dominado', '2025-01-13 08:13:20'),
(15, 6, 45, 35, 'debil', '2025-01-11 10:00:00'),
(16, 11, 79, 70, 'en_progreso', '2025-01-14 09:19:30'),
(17, 13, 84, 80, 'dominado', '2025-01-15 08:18:20'),
(18, 11, 62, 50, 'debil', '2025-02-02 08:00:00'),
(19, 16, 92, 90, 'dominado', '2025-01-16 09:12:10'),
(20, 17, 58, 45, 'debil', '2025-01-17 08:15:40'),
(22, 21, 89, 85, 'dominado', '2025-01-18 09:11:10'),
(23, 23, 68, 60, 'en_progreso', '2025-01-19 08:14:50'),
(25, 26, 94, 90, 'dominado', '2025-01-20 09:10:40'),
(26, 28, 82, 78, 'dominado', '2025-01-21 08:12:50'),
(28, 33, 70, 60, 'en_progreso', '2025-01-22 09:12:30'),
(29, 36, 73, 65, 'en_progreso', '2025-01-23 08:14:10'),
(30, 38, 80, 75, 'en_progreso', '2025-01-23 09:15:20'),
(37, 36, 86, 80, 'dominado', '2025-01-24 09:14:50'),
(39, 41, 78, 70, 'en_progreso', '2025-01-25 08:00:00'),
(40, 46, 91, 88, 'dominado', '2025-01-25 09:10:20');

-- ============================================================
-- 21. FALLA_ENCONTRADA
-- ============================================================
INSERT INTO falla_encontrada (id_usuario_estudiante, id_tema_conocimiento_que_le_falta, id_tema_conocimiento_donde_fallo, seguridad_del_sistema_en_su_falla, tipo_de_falla) VALUES
(8, 3, 1, 50, 'intermedia'),
(9, 2, 1, 40, 'raiz'),
(11, 4, 3, 35, 'intermedia'),
(12, 1, NULL, 20, 'raiz'),
(15, 6, NULL, 30, 'raiz'),
(18, 11, NULL, 45, 'raiz'),
(20, 17, 16, 40, 'intermedia'),
(21, 16, 15, 50, 'intermedia'),
(24, 21, NULL, 30, 'raiz'),
(27, 31, NULL, 35, 'raiz'),
(30, 38, 37, 45, 'intermedia'),
(38, 38, 37, 40, 'intermedia');

-- ============================================================
-- 22. RUTAS_DE_APRENDIZAJE Y PASOS_DEL_CAMINO
-- ============================================================
INSERT INTO rutas_de_aprendizaje (id_usuario_estudiante, id_materia_asignatura, estado_de_la_ruta) VALUES
(8, 1, 'activa'),
(9, 1, 'activa'),
(10, 1, 'completada'),
(11, 1, 'activa'),
(12, 1, 'activa'),
(13, 2, 'activa'),
(14, 2, 'activa'),
(15, 2, 'activa'),
(16, 3, 'activa'),
(17, 3, 'activa'),
(18, 3, 'activa'),
(19, 4, 'activa'),
(20, 4, 'activa'),
(21, 4, 'activa'),
(22, 5, 'activa'),
(23, 5, 'activa'),
(24, 5, 'activa'),
(25, 6, 'activa'),
(26, 6, 'activa'),
(27, 7, 'activa'),
(28, 7, 'activa'),
(29, 8, 'activa'),
(30, 8, 'activa'),
(37, 8, 'activa'),
(38, 8, 'activa'),
(39, 9, 'activa'),
(40, 9, 'activa'),
(8, 9, 'activa'),
(9, 9, 'activa'),
(10, 10, 'activa');

INSERT INTO pasos_del_camino (id_rutas_de_aprendizaje, id_tema_conocimiento, numero_de_paso, estado_del_paso, fecha_en_que_lo_completo) VALUES
(1, 1, 1, 'completado', '2025-01-10 08:08:30'),
(1, 2, 2, 'en_progreso', NULL),
(1, 3, 3, 'pendiente', NULL),
(1, 4, 4, 'pendiente', NULL),
(1, 5, 5, 'pendiente', NULL),
(2, 1, 1, 'en_progreso', NULL),
(2, 2, 2, 'pendiente', NULL),
(2, 3, 3, 'pendiente', NULL),
(3, 1, 1, 'completado', '2025-01-10 10:07:45'),
(3, 2, 2, 'completado', '2025-01-11 10:00:00'),
(3, 3, 3, 'completado', '2025-01-12 10:00:00'),
(3, 4, 4, 'completado', '2025-01-13 10:00:00'),
(3, 5, 5, 'completado', '2025-01-14 10:00:00'),
(4, 1, 1, 'en_progreso', NULL),
(4, 2, 2, 'pendiente', NULL),
(4, 3, 3, 'pendiente', NULL),
(5, 1, 1, 'en_progreso', NULL),
(6, 6, 1, 'completado', '2025-01-12 09:18:30'),
(6, 7, 2, 'en_progreso', NULL),
(6, 8, 3, 'pendiente', NULL),
(6, 9, 4, 'pendiente', NULL),
(6, 10, 5, 'pendiente', NULL),
(7, 8, 1, 'completado', '2025-01-13 08:13:20'),
(7, 9, 2, 'en_progreso', NULL),
(7, 10, 3, 'pendiente', NULL),
(8, 6, 1, 'en_progreso', NULL),
(8, 7, 2, 'pendiente', NULL),
(9, 11, 1, 'completado', '2025-01-14 09:19:30'),
(9, 12, 2, 'en_progreso', NULL),
(9, 13, 3, 'pendiente', NULL),
(9, 14, 4, 'pendiente', NULL),
(9, 15, 5, 'pendiente', NULL),
(10, 13, 1, 'completado', '2025-01-15 08:18:20'),
(10, 14, 2, 'en_progreso', NULL),
(10, 15, 3, 'pendiente', NULL),
(11, 11, 1, 'en_progreso', NULL),
(11, 12, 2, 'pendiente', NULL),
(12, 16, 1, 'completado', '2025-01-16 09:12:10'),
(12, 17, 2, 'en_progreso', NULL),
(12, 18, 3, 'pendiente', NULL),
(12, 19, 4, 'pendiente', NULL),
(12, 20, 5, 'pendiente', NULL),
(13, 17, 1, 'en_progreso', NULL),
(13, 18, 2, 'pendiente', NULL),
(14, 16, 1, 'en_progreso', NULL),
(14, 17, 2, 'pendiente', NULL),
(15, 21, 1, 'completado', '2025-01-18 09:11:10'),
(15, 22, 2, 'en_progreso', NULL),
(15, 23, 3, 'pendiente', NULL),
(15, 24, 4, 'pendiente', NULL),
(15, 25, 5, 'pendiente', NULL),
(16, 23, 1, 'en_progreso', NULL),
(16, 24, 2, 'pendiente', NULL),
(17, 21, 1, 'en_progreso', NULL),
(18, 26, 1, 'completado', '2025-01-20 09:10:40'),
(18, 27, 2, 'en_progreso', NULL),
(18, 28, 3, 'pendiente', NULL),
(18, 29, 4, 'pendiente', NULL),
(18, 30, 5, 'pendiente', NULL),
(19, 28, 1, 'completado', '2025-01-21 08:12:50'),
(19, 29, 2, 'en_progreso', NULL),
(19, 30, 3, 'pendiente', NULL),
(20, 31, 1, 'en_progreso', NULL),
(20, 32, 2, 'pendiente', NULL),
(21, 33, 1, 'en_progreso', NULL),
(22, 36, 1, 'en_progreso', NULL),
(23, 38, 1, 'en_progreso', NULL),
(24, 36, 1, 'completado', '2025-01-24 09:14:50'),
(24, 37, 2, 'en_progreso', NULL),
(25, 38, 1, 'en_progreso', NULL),
(26, 41, 1, 'en_progreso', NULL),
(27, 46, 1, 'completado', '2025-01-25 09:10:20'),
(28, 47, 1, 'en_progreso', NULL),
(29, 51, 1, 'en_progreso', NULL),
(30, 56, 1, 'en_progreso', NULL);

-- ============================================================
-- 23. CONVERSACION_CHAT, MIEMBRO_CHAT Y MENSAJE_CHAT
-- ============================================================
INSERT INTO conversacion_chat (asunto_del_chat, tipo_de_chat, id_usuario_creador, clave_de_idempotencia, estado_del_chat) VALUES
('Dudas sobre ecuaciones', 'directa', 8, '550e8400-e29b-41d4-a716-446655440001', 'activa'),
('Consulta de matrices', 'directa', 9, '550e8400-e29b-41d4-a716-446655440002', 'activa'),
('Grupo de estudio Calculo', 'grupal', 10, '550e8400-e29b-41d4-a716-446655440003', 'activa'),
('Soporte plataforma', 'sistema', 1, '550e8400-e29b-41d4-a716-446655440004', 'activa'),
('Dudas de programacion', 'directa', 13, '550e8400-e29b-41d4-a716-446655440005', 'activa'),
('Grupo de Bases de Datos', 'grupal', 15, '550e8400-e29b-41d4-a716-446655440006', 'activa'),
('Consulta de fisica', 'directa', 19, '550e8400-e29b-41d4-a716-446655440007', 'archivada'),
('Dudas de ingles', 'directa', 16, '550e8400-e29b-41d4-a716-446655440008', 'activa'),
('Grupo de Estadistica', 'grupal', 17, '550e8400-e29b-41d4-a716-446655440009', 'activa'),
('Soporte tecnico', 'sistema', 1, '550e8400-e29b-41d4-a716-446655440010', 'activa');

INSERT INTO miembro_chat (id_conversacion_chat, id_usuario, ultima_vez_que_leyo) VALUES
(1, 8, '2025-01-10 10:00:00'), (1, 3, '2025-01-10 10:05:00'),
(2, 9, '2025-01-11 09:00:00'), (2, 3, '2025-01-11 09:10:00'),
(3, 10, '2025-01-12 08:00:00'), (3, 11, '2025-01-12 08:05:00'), (3, 12, '2025-01-12 08:10:00'), (3, 4, '2025-01-12 08:15:00'),
(4, 1, '2025-01-13 08:00:00'), (4, 8, '2025-01-13 08:10:00'),
(5, 13, '2025-01-14 09:00:00'), (5, 6, '2025-01-14 09:10:00'),
(6, 15, '2025-01-15 08:00:00'), (6, 16, '2025-01-15 08:05:00'), (6, 17, '2025-01-15 08:10:00'), (6, 7, '2025-01-15 08:15:00'),
(7, 19, '2025-01-16 08:00:00'), (7, 4, '2025-01-16 08:10:00'),
(8, 16, '2025-01-17 08:00:00'), (8, 7, '2025-01-17 08:10:00'),
(9, 17, '2025-01-18 08:00:00'), (9, 18, '2025-01-18 08:05:00'), (9, 3, '2025-01-18 08:10:00'),
(10, 1, '2025-01-19 08:00:00'), (10, 20, '2025-01-19 08:10:00');

INSERT INTO mensaje_chat (id_conversacion_chat, id_usuario_emisor, texto_del_mensaje, clave_de_idempotencia) VALUES
(1, 8, 'Hola profesor, tengo una duda con la ecuacion 2x+3=11', '660e8400-e29b-41d4-a716-446655440001'),
(1, 3, 'Hola Juan, debes restar 3 a ambos lados y luego dividir entre 2', '660e8400-e29b-41d4-a716-446655440002'),
(1, 8, 'Entendido, muchas gracias', '660e8400-e29b-41d4-a716-446655440003'),
(2, 9, 'Profesora, como se calcula el determinante de una matriz 3x3?', '660e8400-e29b-41d4-a716-446655440004'),
(2, 3, 'Se usa la regla de Sarrus o expansion por cofactores', '660e8400-e29b-41d4-a716-446655440005'),
(3, 10, 'Companeros, repasemos derivadas manana', '660e8400-e29b-41d4-a716-446655440006'),
(3, 11, 'Me parece bien, a las 10 am?', '660e8400-e29b-41d4-a716-446655440007'),
(3, 12, 'Perfecto, llevo los apuntes', '660e8400-e29b-41d4-a716-446655440008'),
(3, 4, 'Recuerden practicar la regla de la cadena', '660e8400-e29b-41d4-a716-446655440009'),
(4, 8, 'No puedo iniciar sesion en mi cuenta', '660e8400-e29b-41d4-a716-446655440010'),
(4, 1, 'Hemos reiniciado tu contrasena, revisa tu correo', '660e8400-e29b-41d4-a716-446655440011'),
(5, 13, 'Profe, como declaro un arreglo en pseudocodigo?', '660e8400-e29b-41d4-a716-446655440012'),
(5, 6, 'Se declara con la palabra reservada y el tamano entre corchetes', '660e8400-e29b-41d4-a716-446655440013'),
(6, 15, 'Grupo, el quiz de SQL es el viernes', '660e8400-e29b-41d4-a716-446655440014'),
(6, 16, 'Gracias por avisar', '660e8400-e29b-41d4-a716-446655440015'),
(6, 17, 'Hay que repasar joins', '660e8400-e29b-41d4-a716-446655440016'),
(6, 7, 'Les recomiendo practicar con la guia de normalizacion', '660e8400-e29b-41d4-a716-446655440017'),
(7, 19, 'Profesor, no entiendo el diagrama de cuerpo libre', '660e8400-e29b-41d4-a716-446655440018'),
(7, 4, 'Revisa el video de leyes de Newton, ahi lo explico paso a paso', '660e8400-e29b-41d4-a716-446655440019'),
(8, 16, 'Teacher, how can I improve my listening?', '660e8400-e29b-41d4-a716-446655440020'),
(8, 7, 'Practice with the audio material and take notes', '660e8400-e29b-41d4-a716-446655440021'),
(9, 17, 'Companeros, el taller de probabilidad es para el lunes', '660e8400-e29b-41d4-a716-446655440022'),
(9, 18, 'Gracias, ya lo complete', '660e8400-e29b-41d4-a716-446655440023'),
(9, 3, 'Muy bien, recuerden revisar la distribucion normal', '660e8400-e29b-41d4-a716-446655440024'),
(10, 20, 'El sistema no me muestra el quiz de redes', '660e8400-e29b-41d4-a716-446655440025'),
(10, 1, 'Estamos revisando el problema, en breve estara disponible', '660e8400-e29b-41d4-a716-446655440026');

-- ============================================================
-- 24. REGISTRO_AUDITORIA
-- ============================================================
INSERT INTO registro_auditoria (id_usuario, accion_realizada, tabla_afectada, id_del_registro_afectado, fecha_de_la_accion) VALUES
(1, 'INSERT', 'usuario', 1, '2025-01-01 08:00:00'),
(1, 'INSERT', 'usuario', 2, '2025-01-01 08:05:00'),
(1, 'INSERT', 'catalogo_roles', 1, '2025-01-01 08:00:00'),
(1, 'INSERT', 'catalogo_roles', 2, '2025-01-01 08:00:01'),
(3, 'INSERT', 'materia_asignatura', 1, '2025-01-02 09:00:00'),
(3, 'INSERT', 'materia_asignatura', 2, '2025-01-02 09:05:00'),
(4, 'INSERT', 'materia_asignatura', 3, '2025-01-02 09:10:00'),
(3, 'INSERT', 'tema_conocimiento', 1, '2025-01-03 08:00:00'),
(3, 'INSERT', 'tema_conocimiento', 2, '2025-01-03 08:01:00'),
(3, 'INSERT', 'tema_conocimiento', 3, '2025-01-03 08:02:00'),
(3, 'INSERT', 'material_estudio', 1, '2025-01-04 08:00:00'),
(4, 'INSERT', 'material_estudio', 11, '2025-01-04 09:00:00'),
(3, 'INSERT', 'banco_preguntas', 1, '2025-01-05 08:00:00'),
(3, 'INSERT', 'banco_preguntas', 2, '2025-01-05 08:01:00'),
(4, 'INSERT', 'banco_preguntas', 23, '2025-01-05 09:00:00'),
(6, 'INSERT', 'banco_preguntas', 46, '2025-01-05 10:00:00'),
(3, 'INSERT', 'evaluacion_quiz', 1, '2025-01-06 08:00:00'),
(4, 'INSERT', 'evaluacion_quiz', 7, '2025-01-06 09:00:00'),
(3, 'INSERT', 'preguntas_del_quiz', 1, '2025-01-06 10:00:00'),
(4, 'INSERT', 'preguntas_del_quiz', 4, '2025-01-06 10:05:00'),
(3, 'INSERT', 'respuesta_oficial_quiz', 1, '2025-01-06 11:00:00'),
(4, 'INSERT', 'respuesta_oficial_quiz', 4, '2025-01-06 11:05:00'),
(8, 'INSERT', 'intento_de_quiz', 1, '2025-01-10 08:00:00'),
(9, 'INSERT', 'intento_de_quiz', 2, '2025-01-10 09:00:00'),
(10, 'INSERT', 'intento_de_quiz', 3, '2025-01-10 10:00:00'),
(8, 'INSERT', 'respuesta_estudiante', 1, '2025-01-10 08:08:30'),
(9, 'INSERT', 'respuesta_estudiante', 4, '2025-01-10 09:09:10'),
(10, 'INSERT', 'respuesta_estudiante', 7, '2025-01-10 10:07:45'),
(3, 'UPDATE', 'progreso_actual', 1, '2025-01-10 08:08:30'),
(9, 'UPDATE', 'progreso_actual', 5, '2025-01-10 09:09:10'),
(8, 'INSERT', 'conversacion_chat', 1, '2025-01-10 10:00:00'),
(3, 'INSERT', 'mensaje_chat', 2, '2025-01-10 10:05:00'),
(8, 'INSERT', 'rutas_de_aprendizaje', 1, '2025-01-10 08:10:00'),
(9, 'INSERT', 'rutas_de_aprendizaje', 2, '2025-01-10 09:10:00'),
(3, 'INSERT', 'resumen_estadisticas_materia', 1, '2025-01-31 08:00:00'),
(4, 'INSERT', 'resumen_estadisticas_materia', 5, '2025-01-31 09:00:00'),
(1, 'UPDATE', 'usuario', 8, '2025-01-10 08:08:30'),
(1, 'UPDATE', 'usuario', 10, '2025-01-10 10:07:45'),
(1, 'DELETE', 'material_estudio', 60, '2025-01-30 08:00:00'),
(1, 'UPDATE', 'materia_asignatura', 1, '2025-01-15 08:00:00'),
(1, 'UPDATE', 'evaluacion_quiz', 1, '2025-01-16 08:00:00'),
(3, 'UPDATE', 'material_estudio', 1, '2025-01-17 08:00:00'),
(4, 'UPDATE', 'evaluacion_quiz', 7, '2025-01-18 08:00:00'),
(8, 'UPDATE', 'progreso_actual', 2, '2025-01-11 08:00:00'),
(9, 'UPDATE', 'progreso_actual', 6, '2025-01-11 09:00:00'),
(10, 'UPDATE', 'progreso_actual', 8, '2025-01-11 10:00:00'),
(11, 'INSERT', 'falla_encontrada', 1, '2025-01-11 09:20:00'),
(12, 'INSERT', 'falla_encontrada', 4, '2025-02-01 08:05:00'),
(8, 'INSERT', 'ranking_por_tema', 1, '2025-01-10 08:08:30'),
(9, 'INSERT', 'ranking_por_tema', 2, '2025-01-10 09:09:10'),
(10, 'INSERT', 'ranking_por_tema', 3, '2025-01-10 10:07:45'),
(13, 'INSERT', 'ranking_por_tema', 13, '2025-01-12 09:18:30'),
(14, 'INSERT', 'ranking_por_tema', 16, '2025-01-13 08:13:20');

SET FOREIGN_KEY_CHECKS = 1;
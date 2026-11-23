# Módulo de Base de Datos - `bd_kmap`

Base de datos relacional oficial de **Plan Kmap** diseñada para MySQL / MariaDB (XAMPP).

---

## 1. Archivos SQL

| Archivo Estándar | Archivo Original | Descripción |
| :--- | :--- | :--- |
| **`01_schema.sql`** | `bd_kmap` | Creación de base de datos `kmap` y las 26 tablas relacionales. |
| **`02_data.sql`** | `bd.ins` | Inserción de catálogos base, usuarios iniciales, materias, temas, preguntas y opciones. |
| **`03_triggers.sql`** | `bd_trigger` | Triggers de validación anti-ciclos DAG, auditoría y actualización automática de rankings. |
| **`diagrama_kmap.png`** | - | Diagrama Entidad-Relación visual del esquema completo. |

---

## 2. Orden de Importación

Para inicializar la base de datos completa en MySQL / XAMPP, ejecuta en orden:

```bash
# Paso 1: Crear e inicializar tablas
mysql -u root -p < bd_kmap/01_schema.sql

# Paso 2: Cargar datos iniciales
mysql -u root -p < bd_kmap/02_data.sql

# Paso 3: Registrar triggers de integridad
mysql -u root -p < bd_kmap/03_triggers.sql
```

---

## 3. Módulos y Tablas Principales

1. **Usuarios y Roles:**
   - `catalogo_roles`: Roles (`administrador`, `docente`, `estudiante`, `tutor`, `auditor`, `invitado`).
   - `usuario`: Usuarios del sistema con contraseña encriptada, correo, carnet/código SIS y foto.
2. **Académico y Grafos de Conocimiento:**
   - `materia_asignatura`: Materias dictadas y códigos de matriculación.
   - `inscripcion_materia`: Inscripción de estudiantes a materias.
   - `tema_conocimiento`: Nodos del grafo con título, descripción y ponderación.
   - `requisito_entre_temas`: Aristas dirigidas del grafo (prerrequisitos).
   - `material_estudio`: Archivos PDF, enlaces y recursos asociados a cada tema.
   - `catalogo_tipos_archivo`: Tipos de recursos (`PDF`, `DOCX`, `Video`, `Enlace`, etc.).
3. **Evaluaciones y Banco de Preguntas:**
   - `banco_preguntas`: Preguntas asociadas a temas.
   - `opcion_respuesta`: Opciones de opción múltiple.
   - `evaluacion_quiz`: Quizzes creados manualmente o generados con BITSIBOOT.
   - `preguntas_del_quiz`: Asociación ordenada de preguntas en cada evaluación.
   - `respuesta_oficial_quiz`: Respuesta correcta de cada pregunta.
4. **Resultados, Progreso y Rutas de Aprendizaje:**
   - `intento_de_quiz`: Intentos de evaluación y notas obtenidas.
   - `respuesta_estudiante`: Respuestas específicas marcadas por el estudiante.
   - `ranking_por_tema`: Puntuaciones máximas y orden de estudiantes por tema.
   - `resumen_estadisticas_materia`: Estadísticas globales de aprobación y promedio.
   - `progreso_actual`: Estado de dominio de cada tema (`sin_evaluar`, `debil`, `en_progreso`, `dominado`).
   - `historial_de_progreso`: Auditoría histórica de cambios de nota.
   - `falla_encontrada`: Detección de tema raíz donde se originó la dificultad.
   - `rutas_de_aprendizaje` y `pasos_del_camino`: Rutas de recuperación generadas por el grafo.
5. **Mensajería y Auditoría:**
   - `conversacion_chat`, `miembro_chat`, `mensaje_chat`: Canales de comunicación.
   - `registro_auditoria`: Bitácora inmutable de eventos del sistema.

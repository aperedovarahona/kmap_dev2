# Backend - Plan Kmap (PHP CodeIgniter 3 MVC)

Backend RESTful desarrollado en PHP 8 bajo la arquitectura MVC estándar de **CodeIgniter 3**, conectado a la base de datos MySQL `bd_kmap`.

---

## 1. Estructura de Carpetas

```
backend/
├── application/
│   ├── config/
│   │   ├── config.php          # Configuración de URLs, rutas y secreto JWT
│   │   └── database.php        # Configuración de base de datos MySQL (Query Builder)
│   ├── controllers/            # Controladores delgados (Thin Controllers)
│   │   ├── Health.php          # Estado del servicio y base de datos
│   │   ├── Auth.php            # Login, registro y sesión JWT
│   │   ├── Admin.php           # CRUD de docentes, asignaturas y asignaciones
│   │   ├── Teacher.php         # Materias asignadas y códigos de matriculación
│   │   ├── Student.php         # Inscripción con código y listado de materias
│   │   ├── Subjects.php        # API de grafo (React Flow) y mapa de calor
│   │   ├── Nodes.php           # Detalle de temas, materiales y quizzes
│   │   ├── Quizzes.php         # Realización, evaluación y eliminación de quizzes
│   │   ├── Materials.php       # Eliminación de materiales de estudio
│   │   └── Kmap.php            # Sincronización de estado, subida de archivos e IA
│   ├── models/                 # Modelos con lógica de acceso a datos ($this->db)
│   │   ├── Usuario_model.php   # Consultas a tablas `usuario` y `catalogo_roles`
│   │   ├── Materia_model.php   # Consultas a `materia_asignatura` e `inscripcion_materia`
│   │   ├── Tema_model.php      # Consultas a `tema_conocimiento` y validación DAG
│   │   ├── Quiz_model.php      # Consultas a `evaluacion_quiz` y `banco_preguntas`
│   │   ├── Evaluacion_model.php# Calificación, ranking y estadísticas de mapa de calor
│   │   └── Kmap_model.php      # Sincronización de estado y diagnóstico de temas raíz
│   └── libraries/              # Librerías de soporte
│       ├── Jwt_lib.php         # Emisión y verificación de tokens JWT HMAC-SHA256
│       └── Gemini_ai.php       # Cliente de IA para generación de evaluaciones
├── data/                       # Almacenamiento persistente de respaldo (`kmap-state.json`)
├── system/                     # Núcleo MVC y Query Builder de CodeIgniter 3
├── uploads/                    # Directorio de archivos y documentos subidos
├── index.php                   # Punto de entrada de la aplicación
└── router.php                  # Enrutador para servidor de desarrollo PHP CLI
```

---

## 2. Principios de Diseño

1. **Controladores delgados (Thin Controllers):** Los controladores únicamente validan los parámetros de entrada y delegan la lógica de consulta y persistencia a los Modelos correspondientes.
2. **Query Builder `$this->db`:** Todas las operaciones de base de datos emplean el Query Builder estándar (`$this->db->get()`, `$this->db->where()`, `$this->db->insert()`, `$this->db->update()`, etc.).
3. **Respuestas JSON limpias:** Todos los endpoints devuelven respuestas estructuradas en JSON utilizando `$this->output->set_content_type('application/json')`.
4. **Validación de Grafos (DAG):** Antes de persistir un grafo, `Tema_model` aplica el algoritmo de Kahn para verificar que no existan ciclos entre prerrequisitos.

---

## 3. Ejecución Independiente (Opcional)

Si deseas correr únicamente el servidor backend:
```bash
php -S 0.0.0.0:4000 router.php
```
*(Nota: El comando global `npm run dev` desde `front/` o la raíz ya levanta automáticamente este backend junto al frontend).*

# PLAN KMAP - BIT ACADEMY

Plataforma educativa web basada en grafos de conocimiento, diagnóstico de prerrequisitos, rutas de aprendizaje adaptativas y asistencia con Inteligencia Artificial (**BITSIBOOT**).

---

## 1. Arquitectura General del Repositorio

El proyecto se encuentra organizado en tres módulos independientes, limpios y autodocumentados:

```
kmap_dev2/
├── backend/            # Backend en PHP (Arquitectura MVC CodeIgniter 3)
│   ├── application/    # Controladores delgados, modelos con $this->db y librerías
│   ├── system/         # Núcleo MVC y Query Builder de CodeIgniter 3
│   ├── uploads/        # Recursos y materiales educativos subidos
│   ├── index.php       # Punto de entrada de la aplicación PHP
│   ├── router.php      # Enrutador para servidor de desarrollo PHP
│   └── README.md       # Documentación técnica del Backend
├── bd_kmap/            # Scripts SQL oficiales de la base de datos MySQL
│   ├── 01_schema.sql   # DDL: Estructura de las 26 tablas relacionales (bd_kmap)
│   ├── 02_data.sql     # DML: Catálogos, usuarios, temas y preguntas (bd.ins)
│   ├── 03_triggers.sql # DDL: Triggers anti-ciclos DAG, auditoría y ranking (bd_trigger)
│   ├── diagrama_kmap.png # Diagrama Entidad-Relación visual
│   └── README.md       # Documentación del esquema y modelos de datos
├── front/              # Frontend en React 18 + Vite + Tailwind CSS
│   ├── src/            # Componentes, vistas por rol, alertas y estado reactivo
│   ├── dev.js          # Orquestador que inicia en simultáneo PHP (4000) y Vite (5173)
│   ├── package.json    # Dependencias de React y scripts de compilación
│   └── README.md       # Documentación de la arquitectura del Frontend
├── package.json        # Script raíz para arrancar todo el proyecto con un único comando
└── README.md           # Guía general de instalación, uso y despliegue
```

---

## 2. Requisitos Previos

* **PHP:** Versión 8.0 o superior (disponible en XAMPP o en el `PATH` del sistema).
* **MySQL:** Servidor MySQL activo (puerto 3306 por defecto).
* **Node.js:** Versión 18 o superior y npm.

---

## 3. Base de Datos (`bd_kmap`)

Para inicializar la base de datos en MySQL / XAMPP, ejecuta los scripts en orden desde tu terminal:

```bash
# 1. Crear la base de datos 'kmap' y sus 26 tablas
mysql -u root -p < bd_kmap/01_schema.sql

# 2. Cargar los datos iniciales y catálogos
mysql -u root -p < bd_kmap/02_data.sql

# 3. Registrar los triggers de integridad y cálculo
mysql -u root -p < bd_kmap/03_triggers.sql
```
*(También puedes usar los nombres de archivo originales `bd_kmap`, `bd.ins` y `bd_trigger` que se mantienen disponibles).*

---

## 4. Ejecución del Proyecto (Comando Único)

El proyecto se levanta en su totalidad (Backend PHP en puerto 4000 + Frontend Vite en puerto 5173) mediante un único comando:

### Desde la carpeta `front/`:
```bash
cd front
npm install   # (solo la primera vez)
npm run dev
```

### O desde la raíz del proyecto:
```bash
npm run dev
```

Ambos servicios quedarán disponibles automáticamente:
* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:4000` (las llamadas `/api/*` y `/uploads/*` son redirigidas por Vite mediante proxy).

---

## 5. Compilación y Construcción para Producción

Para compilar el frontend listo para producción:

```bash
cd front
npm run build
```

Los artefactos optimizados se generarán en la carpeta `front/dist/`. Para previsualizarlos localmente:
```bash
npm run preview
```

---

## 6. Cuentas de Acceso de Demostración

| Rol | Usuario / Correo | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@demo.com` o `admin` | `admin123` |
| **Docente** | `docente@demo.com` o `docente` | `1234567` |
| **Estudiante** | `jhoselyn@est.umss.edu` o `202012345` | `123456` |

**Códigos de Matrícula de Demostración:**
* `BDD3K9` (Bases de Datos)
* `PRG4M9` (Programación)
* `CAL101` (Cálculo I)

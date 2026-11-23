# Frontend - Plan Kmap (React + Vite)

Cliente web interactivo desarrollado con **React 18**, **Vite** y **Tailwind CSS**.

---

## 1. Estructura de Carpetas

```
front/
├── public/                 # Recursos estáticos (logos, avatares, favicon)
├── src/
│   ├── components/         # Componentes reutilizables de UI
│   │   ├── teacher/        # Componentes del panel docente (Editor de Grafo, Mapa de Calor)
│   │   │   ├── GraphEditor.jsx   # Editor visual de nodos y aristas DAG
│   │   │   ├── HeatPanel.jsx     # Visualización de mapa de calor por tema
│   │   │   └── TopicsManager.jsx # Gestión de materiales y preguntas con IA
│   │   ├── KnowledgeGraph.jsx    # Visualizador de grafo de conocimiento para estudiantes
│   │   ├── RobotMascot.jsx       # Asistente virtual BITSIBOOT
│   │   ├── Layout.jsx            # Estructura general con barra superior y navegación
│   │   └── ui.jsx                # Botones, tarjetas y modales base
│   ├── lib/
│   │   ├── db.js           # Estado reactivo y sincronización de datos con el backend
│   │   └── logic.js        # Lógica de cálculo, algoritmo de Kahn y llamadas a IA
│   ├── pages/              # Vistas principales de la aplicación por rol
│   │   ├── AdminHome.jsx   # Panel de administración (docentes y materias)
│   │   ├── TeacherHome.jsx # Panel del docente (materias y códigos)
│   │   ├── StudentHome.jsx # Panel del estudiante (asignaturas matriculadas)
│   │   ├── Quiz.jsx        # Pantalla de resolución de evaluaciones
│   │   ├── Login.jsx       # Inicio de sesión unificado
│   │   └── Profile.jsx     # Perfil de usuario y cambio de contraseña
│   ├── alerts.js           # Notificaciones y modales estilizados con SweetAlert2
│   ├── auth.jsx            # Contexto de autenticación y protección de rutas
│   ├── App.jsx             # Enrutador principal (React Router DOM)
│   └── main.jsx            # Punto de entrada de React
├── dev.js                  # Script de arranque unificado (Backend PHP + Vite)
├── package.json            # Dependencias y scripts de ejecución
├── tailwind.config.js      # Configuración de estilos y tema visual
└── vite.config.js          # Configuración de Vite y proxy hacia puerto 4000
```

---

## 2. Comandos Disponibles

```bash
# Iniciar backend PHP + frontend Vite en un solo comando
npm run dev

# Compilar para producción (genera carpeta dist/)
npm run build

# Previsualizar la compilación de producción
npm run preview
```

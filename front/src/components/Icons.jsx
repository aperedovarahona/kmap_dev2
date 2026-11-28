import React from 'react';

// ============================================================================
// ICONOS VECTORIALES SVG DE ALTA DEFINICIÓN (KMapGraph)
// Todos los iconos usan SVG puro, viewBox="0 0 24 24", stroke/fill adaptativo
// ============================================================================

/** Icono de Libros / Materias (reemplaza 📚) */
export function BooksIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" strokeWidth="2" />
      <path d="M8 11h6" strokeWidth="2" />
    </svg>
  );
}

/** Icono de Base de Datos (reemplaza 🗄️) */
export function DatabaseIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

/** Icono de Código / Programación (reemplaza </>) */
export function CodeIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

/** Icono de Matemáticas / Escuadra / Álgebra (reemplaza 📐 y 🧮) */
export function MathIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M21.3 8.7 8.7 21.3c-.4.4-1 .4-1.4 0l-5-5c-.4-.4-.4-1 0-1.4L14.9 2.3c.4-.4 1-.4 1.4 0l5 5c.4.4.4 1 0 1.4z" />
      <path d="m9.6 14.4 4.8-4.8" />
      <path d="M6 18h.01" />
      <path d="M9 15h.01" />
      <path d="M12 12h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}

/** Icono de Docente / Mentor (reemplaza 👨‍🏫) */
export function TeacherIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      <circle cx="12" cy="7" r="2.5" />
    </svg>
  );
}

/** Icono de Estudiante / Birrete (reemplaza 🎓) */
export function StudentIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

/** Icono de Administrador / Herramientas (reemplaza 🛠️) */
export function AdminIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** Icono de Estrella / Promedio (reemplaza ⭐) */
export function StarIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/** Icono de Trofeo / Clasificación (reemplaza 🏆) */
export function TrophyIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
      <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

/** Icono de Check / Cuestionarios Completados (reemplaza ✅) */
export function CheckCircleIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/** Icono de Corona / Ranking General (reemplaza 👑) */
export function CrownIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

/** Icono de Medalla de Podio (reemplaza 🥇, 🥈, 🥉) */
export function MedalIcon({ rank = 1, className = 'w-5 h-5', style }) {
  const colors = {
    1: '#ffd700',
    2: '#c0c0c0',
    3: '#cd7f32',
  };
  const c = colors[rank] || 'currentColor';
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="14" r="7" />
      <path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.12" />
      <text x="12" y="16.5" textAnchor="middle" fill={c} stroke="none" fontSize="8" fontWeight="bold">
        {rank}
      </text>
    </svg>
  );
}

/** Icono de Gráfico de Progreso (reemplaza 📊) */
export function ChartBarIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

/** Icono de Escudo Anticopia Activo (reemplaza 🛡️) */
export function ShieldSecurityIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Icono de Candado Abierto (reemplaza 🔓) */
export function LockOpenIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

/** Icono de Candado Cerrado (reemplaza 🔒) */
export function LockIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/** Icono de Llave / Contraseña (reemplaza 🔑) */
export function KeyIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3" />
      <path d="m18.5 4.5 3 3" />
    </svg>
  );
}

/** Icono de Portapapeles / Copiar (reemplaza 📋) */
export function ClipboardIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

/** Icono de Chispas / IA / Destacado (reemplaza ✨) */
export function SparklesIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} style={style}>
      <path d="m12 3 1.912 5.885L19.797 10.8 13.912 12.715 12 18.6l-1.912-5.885L4.203 10.8l5.885-1.915L12 3z" />
      <path d="m19 16 .956 2.943L22.899 19.9l-2.943.957L19 23.8l-.956-2.943-2.943-.957 2.943-.957L19 16z" opacity="0.8" />
    </svg>
  );
}

/** Icono de Archivo / Documento (reemplaza 📄) */
export function DocumentIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

/** Icono de Enlace / Link (reemplaza 🔗) */
export function LinkIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/** Icono de Paleta de Color / Personalización (reemplaza 🎨) */
export function PaletteIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.996 6.5 17.5 2 12 2z" />
    </svg>
  );
}

/** Icono de Rayo / Auto-organizar (reemplaza ⚡) */
export function LightningIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} style={style}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/** Icono de Disquete / Guardar (reemplaza 💾) */
export function SaveIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

/** Icono de Bombilla / Ayuda (reemplaza 💡) */
export function LightbulbIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

/** Icono de Grafo / Red de Conocimiento (reemplaza 🕸️) */
export function KnowledgeNetIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="8.5" y1="7.5" x2="15.5" y2="16.5" />
      <line x1="15.5" y1="7.5" x2="8.5" y2="16.5" />
      <line x1="6" y1="9" x2="6" y2="15" />
      <line x1="18" y1="9" x2="18" y2="15" />
    </svg>
  );
}

/** Icono de Fuego / Mapa de Calor (reemplaza 🔥) */
export function FireIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} style={style}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

/** Icono de Cuestionario / Temas y Quiz (reemplaza 📝) */
export function QuizQuizIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

/** Icono de Avatar Cyber Alumno (dev-boy) */
export function CyberBoyIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      <path d="m9 11 1.5 1.5L12 11" strokeWidth="1.5" />
      <line x1="10" y1="5" x2="14" y2="5" />
    </svg>
  );
}

/** Icono de Avatar Cyber Alumna (dev-girl) */
export function CyberGirlIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      <path d="M6 10c0 3 2 5 2 5s2-2 2-5" />
      <path d="M18 10c0 3-2 5-2 5s-2-2-2-5" />
    </svg>
  );
}

/** Icono de Avatar Robot Bot */
export function RobotBotIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <line x1="12" y1="4" x2="12" y2="8" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}

/** Icono de Avatar Hacker / Cyber */
export function HackerIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z" />
      <line x1="9" y1="14" x2="15" y2="14" strokeWidth="2.5" />
    </svg>
  );
}

/** Icono de Gema Neón (reemplaza 💎) */
export function GemIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polygon points="6 3 18 3 22 9 12 22 2 9" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="12" y1="22" x2="6" y2="9" />
      <line x1="12" y1="22" x2="18" y2="9" />
      <line x1="6" y1="3" x2="10" y2="9" />
      <line x1="18" y1="3" x2="14" y2="9" />
    </svg>
  );
}

/** Icono de Cyber Cat (reemplaza 🐱) */
export function CyberCatIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 5c-5 0-8 3-8 8 0 5 3 8 8 8s8-3 8-8c0-5-3-8-8-8z" />
      <polygon points="5 6 4 11 8 8" fill="currentColor" />
      <polygon points="19 6 20 11 16 8" fill="currentColor" />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" />
      <circle cx="15" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ============================================================================
// RENDERIZADOR UNIVERSAL DE ICONOS (Mapea emojis o cadenas a SVG Vectorial)
// ============================================================================
export function SmartIcon({ icon, name, className = 'w-5 h-5', style }) {
  const str = String(icon || name || '').trim();

  // Mapeo por emoji o símbolo clásico
  if (str === '🗄️' || str.toLowerCase().includes('base') || str.toLowerCase().includes('data')) {
    return <DatabaseIcon className={className} style={style} />;
  }
  if (str === '</>' || str.toLowerCase().includes('prog') || str.toLowerCase().includes('code')) {
    return <CodeIcon className={className} style={style} />;
  }
  if (str === '📐' || str === '🧮' || str.toLowerCase().includes('alg') || str.toLowerCase().includes('mat')) {
    return <MathIcon className={className} style={style} />;
  }
  if (str === '📚' || str === '📘' || str.toLowerCase().includes('materia')) {
    return <BooksIcon className={className} style={style} />;
  }
  if (str === '👨‍🏫' || str === '🧑‍🏫' || str.toLowerCase().includes('docente')) {
    return <TeacherIcon className={className} style={style} />;
  }
  if (str === '🎓' || str.toLowerCase().includes('estudiante')) {
    return <StudentIcon className={className} style={style} />;
  }
  if (str === '🛠️' || str.toLowerCase().includes('admin')) {
    return <AdminIcon className={className} style={style} />;
  }
  if (str === '⭐') {
    return <StarIcon className={className} style={style} />;
  }
  if (str === '🏆') {
    return <TrophyIcon className={className} style={style} />;
  }
  if (str === '✅' || str === '✓') {
    return <CheckCircleIcon className={className} style={style} />;
  }
  if (str === '👑') {
    return <CrownIcon className={className} style={style} />;
  }
  if (str === '🥇') {
    return <MedalIcon rank={1} className={className} style={style} />;
  }
  if (str === '🥈') {
    return <MedalIcon rank={2} className={className} style={style} />;
  }
  if (str === '🥉') {
    return <MedalIcon rank={3} className={className} style={style} />;
  }
  if (str === '📊') {
    return <ChartBarIcon className={className} style={style} />;
  }
  if (str === '🛡️') {
    return <ShieldSecurityIcon className={className} style={style} />;
  }
  if (str === '🔓') {
    return <LockOpenIcon className={className} style={style} />;
  }
  if (str === '🔒') {
    return <LockIcon className={className} style={style} />;
  }
  if (str === '🔑') {
    return <KeyIcon className={className} style={style} />;
  }
  if (str === '📋') {
    return <ClipboardIcon className={className} style={style} />;
  }
  if (str === '✨') {
    return <SparklesIcon className={className} style={style} />;
  }
  if (str === '📄') {
    return <DocumentIcon className={className} style={style} />;
  }
  if (str === '🔗') {
    return <LinkIcon className={className} style={style} />;
  }
  if (str === '🎨') {
    return <PaletteIcon className={className} style={style} />;
  }
  if (str === '⚡') {
    return <LightningIcon className={className} style={style} />;
  }
  if (str === '💾') {
    return <SaveIcon className={className} style={style} />;
  }
  if (str === '💡') {
    return <LightbulbIcon className={className} style={style} />;
  }
  if (str === '🕸️') {
    return <KnowledgeNetIcon className={className} style={style} />;
  }
  if (str === '🔥') {
    return <FireIcon className={className} style={style} />;
  }
  if (str === '📝') {
    return <QuizQuizIcon className={className} style={style} />;
  }
  if (str === '🧑‍💻' || str === 'dev-boy') {
    return <CyberBoyIcon className={className} style={style} />;
  }
  if (str === '👩‍💻' || str === 'dev-girl') {
    return <CyberGirlIcon className={className} style={style} />;
  }
  if (str === '🤖' || str === 'robot-bot') {
    return <RobotBotIcon className={className} style={style} />;
  }
  if (str === '🕵️' || str === 'hacker') {
    return <HackerIcon className={className} style={style} />;
  }
  if (str === '💎' || str === 'gem') {
    return <GemIcon className={className} style={style} />;
  }
  if (str === '🐱' || str === 'fox' || str === 'cat') {
    return <CyberCatIcon className={className} style={style} />;
  }

  // Fallback si es un elemento React ya construido
  if (React.isValidElement(icon)) {
    return icon;
  }

  // Fallback genérico a libro/conocimiento
  return <BooksIcon className={className} style={style} />;
}

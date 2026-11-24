import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useDb } from '../lib/db.js';
import { topicsOf } from '../lib/logic.js';
import { info } from '../alerts.js';
import UserMenu from './UserMenu.jsx';
import ThemeSelector from './ThemeSelector.jsx';
import './Page.css';

export default function Page({ title, subtitle, crumb, backTo, icon, actions, children }) {
  const { user } = useAuth();
  const db = useDb();
  const nav = useNavigate();

  const handleQuickQuiz = () => {
    if (user?.role === 'estudiante') {
      const enrolled = db.enrollments.find((e) => e.userId === user.id);
      const sid = enrolled?.subjectId || db.subjects[0]?.id;
      const firstTopic = sid ? topicsOf(db, sid)[0] : null;
      if (sid && firstTopic) {
        nav(`/materia/${sid}/tema/${firstTopic.id}/quiz`);
        return;
      }
    }
    info(
      'Quiz Rápido · KMapGraph',
      'Iniciando evaluación rápida de conocimientos adaptativos de KMapGraph.'
    );
  };

  const handleViewCourses = () => {
    if (user?.role === 'estudiante') {
      nav('/panel?vista=materias');
    } else {
      nav('/panel');
    }
  };

  const crumbParts = crumb ? crumb.split(/›|❯/).map((c) => c.trim()) : ['KMapGraph', 'Inicio'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col flex-1 w-full"
    >
      {/* Top Header Bar (Persistente / Sticky adaptable a toda pantalla) */}
      <header className="top-header">
        {/* Left Breadcrumbs & Quick Actions Pill Card */}
        <div className="header-breadcrumbs-card">
          <div className="header-brand-content">
            <div className="breadcrumbs">
              {crumbParts.map((part, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5">
                  {idx > 0 && <span className="separator">❯</span>}
                  <span>{part}</span>
                </span>
              ))}
            </div>
            <div
              className="header-logo-box cursor-pointer"
              onClick={() => nav('/panel')}
              title="KMapGraph · Ir al Inicio"
            >
              <img
                src="/assets/images/logo.svg"
                alt="KMapGraph"
                className="header-card-logo"
              />
              {title && title !== 'KMapGraph' && (
                <span className="header-title-addon">· {title}</span>
              )}
            </div>
          </div>

          <div className="header-actions">
            {actions}
            {user?.role === 'estudiante' && (
              <>
                <button className="btn-quiz" type="button" onClick={handleQuickQuiz}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Quiz</span>
                </button>
                <button className="btn-courses" type="button" onClick={handleViewCourses}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
                  </svg>
                  <span>Ver cursos</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right User & Utility Controls */}
        <div className="header-user-controls">
          <ThemeSelector />
          <button
            className="control-btn"
            title="Configuración de Perfil"
            type="button"
            onClick={() => nav('/perfil')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>

          <UserMenu />
        </div>
      </header>

      {/* Sub-header con botón Volver cuando estamos dentro de una materia/tema */}
      {backTo && (
        <div className="card-glow flex flex-wrap items-center justify-between gap-3.5 py-3.5 px-5 mb-5">
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => nav(backTo)}
              className="btn-pill px-4 py-1.5 text-xs sm:text-sm"
            >
              <span>←</span> Volver
            </button>
            {icon && (
              <div className="card-icon-badge !w-11 !h-11 !mb-0 !text-xl">{icon}</div>
            )}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">{title}</h2>
              {subtitle && <p className="text-xs sm:text-sm text-[#8ca5c9]">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 flex-1">{children}</div>
    </motion.div>
  );
}
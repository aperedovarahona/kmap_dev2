import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { info } from '../alerts.js';
import PanelBot from './PanelBot.jsx';
import UserMenu from './UserMenu.jsx';
import './Layout.css';

export default function Layout() {
  const { user } = useAuth();
  const { pathname, search } = useLocation();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isItemActive = (to) => {
    if (to === '/perfil') return pathname === '/perfil';
    if (to.includes('?vista=')) {
      const v = to.split('?vista=')[1];
      return pathname === '/panel' && search === `?vista=${v}`;
    }
    if (to === '/panel') {
      if (user.role === 'estudiante') {
        return (pathname === '/panel' && !search) || pathname.startsWith('/materia');
      }
      return pathname === '/panel' || pathname.startsWith('/materia');
    }
    return pathname === to;
  };

  const openToolModal = (title, msg) => {
    setMobileOpen(false);
    info(title, `<p class="text-sm text-cyan-100 leading-relaxed">${msg}</p>`);
  };

  const isStudent = user?.role === 'estudiante';

  return (
    <div className={`dashboard-layout ${isStudent ? 'no-sidebar' : ''}`}>
      {/* Barra móvil para pantallas pequeñas (solo cuando hay sidebar para docente/admin) */}
      {!isStudent && (
        <>
          <div
            className="md:hidden fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between backdrop-blur-md z-50 border-b"
            style={{
              background: 'rgba(var(--bg-secondary-rgb, 6, 18, 37), 0.95)',
              borderColor: 'rgba(var(--primary-rgb), 0.25)',
            }}
          >
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="btn-ghost w-10 h-10 p-0 grid place-items-center text-lg font-black"
              aria-label="Menú"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
            <img
              src="/assets/images/logo.svg"
              alt="KMapGraph"
              className="h-10 w-auto cursor-pointer"
              onClick={() => nav('/panel')}
            />
            <UserMenu size="sm" />
          </div>

          {mobileOpen && (
            <div
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
            />
          )}

          {/* ====================================================================
              1. SIDEBAR (Solo para gestión Docente / Admin)
              ==================================================================== */}
          <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
            {/* Brand Logo */}
            <div
              className="sidebar-logo"
              onClick={() => {
                setMobileOpen(false);
                nav('/panel');
              }}
            >
              <img src="/assets/images/logo.svg" alt="KMapGraph Logo" />
            </div>

            {user.role === 'docente' && (
              <div className="nav-section">
                <div className="section-label">Gestión Docente</div>
                <ul className="nav-list">
                  <li className={`nav-item ${isItemActive('/panel') ? 'active' : ''}`}>
                    <NavLink to="/panel" onClick={() => setMobileOpen(false)} className="nav-link">
                      <span className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                        </svg>
                      </span>
                      <span className="nav-text">Mis Materias</span>
                      <span className="chevron">❯</span>
                    </NavLink>
                  </li>
                  <li className={`nav-item ${isItemActive('/perfil') ? 'active' : ''}`}>
                    <NavLink to="/perfil" onClick={() => setMobileOpen(false)} className="nav-link">
                      <span className="nav-icon icon-purple">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                      </span>
                      <span className="nav-text">Mi Perfil</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}

            {user.role === 'admin' && (
              <div className="nav-section">
                <div className="section-label">Administración</div>
                <ul className="nav-list">
                  <li className={`nav-item ${isItemActive('/panel') ? 'active' : ''}`}>
                    <NavLink to="/panel" onClick={() => setMobileOpen(false)} className="nav-link">
                      <span className="nav-icon icon-gold">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </span>
                      <span className="nav-text">Panel Admin</span>
                      <span className="chevron">❯</span>
                    </NavLink>
                  </li>
                  <li className={`nav-item ${isItemActive('/perfil') ? 'active' : ''}`}>
                    <NavLink to="/perfil" onClick={() => setMobileOpen(false)} className="nav-link">
                      <span className="nav-icon icon-purple">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                      </span>
                      <span className="nav-text">Mi Perfil</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}

            {/* Espacio inferior limpio en sidebar */}
            <div className="mt-auto py-2" />
          </aside>
        </>
      )}

      {/* ====================================================================
          2. MAIN DASHBOARD CONTENT AREA
          ==================================================================== */}
      <main className={`main-wrapper ${!isStudent ? 'mt-14 md:mt-0' : ''}`}>
        <Outlet />
      </main>

      {/* ====================================================================
          3. BOT ASISTENTE INDEPENDIENTE PARA PANELES
          ==================================================================== */}
      <PanelBot />
    </div>
  );
}

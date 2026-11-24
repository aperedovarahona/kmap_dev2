import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { ask, ok } from '../alerts.js';
import './UserMenu.css';

export default function UserMenu({ size = 'md', className = '' }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const nav = useNavigate();

  // Cerrar al hacer clic fuera o presionar tecla Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    const confirmed = await ask(
      '¿Cerrar sesión?',
      `¿Deseas salir de la cuenta de ${user?.name || 'usuario'}?`,
      'Cerrar sesión'
    );
    if (confirmed) {
      logout();
      nav('/');
      ok('Sesión finalizada', '¡Hasta luego!');
    }
  };

  const handleGoProfile = () => {
    setOpen(false);
    nav('/perfil');
  };

  const handleGoLanding = () => {
    setOpen(false);
    nav('/');
  };

  const avatarSizeClass = size === 'sm' ? '!w-9 !h-9' : 'w-11 h-11';

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {/* Botón Avatar de usuario con efectos interactivos */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`user-avatar-wrap ${avatarSizeClass} p-0 bg-transparent border-none outline-none focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] rounded-full transition-transform duration-200 active:scale-95 cursor-pointer`}
        title={`Cuenta de ${user?.name || 'Usuario'}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user?.avatar ? (
          <span className="user-avatar-custom pointer-events-none select-none">
            {user.avatar}
          </span>
        ) : (
          <img
            src="/assets/images/avatar.svg"
            alt={user?.name || 'Avatar'}
            className="w-full h-full rounded-full object-cover pointer-events-none"
          />
        )}
        {/* Indicador de estado en línea */}
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#030c1c]"
          title="Conectado"
        />
      </button>

      {/* Menú Dropdown estilizado con estética Cyber Neón */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2.5 w-60 max-h-[85vh] overflow-y-auto rounded-2xl backdrop-blur-xl border p-3 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right text-slate-100"
          style={{
            background: 'rgba(var(--bg-secondary-rgb, 6, 20, 41), 0.96)',
            borderColor: 'rgba(var(--primary-rgb), 0.35)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(var(--primary-rgb), 0.2)',
          }}
        >
          {/* Tarjeta de información del usuario */}
          <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: 'rgba(var(--primary-rgb), 0.15)' }}>
            <div className="w-10 h-10 rounded-full overflow-hidden border shrink-0 flex items-center justify-center" style={{ borderColor: 'var(--cyan)' }}>
              {user?.avatar ? (
                <span className="text-xl select-none">{user.avatar}</span>
              ) : (
                <img
                  src="/assets/images/avatar.svg"
                  alt={user?.name || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-white truncate" title={user?.name}>
                {user?.name || 'Usuario'}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{
                    background: 'rgba(var(--primary-rgb), 0.12)',
                    color: 'var(--cyan)',
                    borderColor: 'rgba(var(--primary-rgb), 0.3)',
                  }}
                >
                  {user?.role === 'admin'
                    ? 'Administrador'
                    : user?.role === 'docente'
                      ? 'Docente'
                      : 'Estudiante'}
                </span>
              </div>
            </div>
          </div>

          {/* ==========================================
              ACCIONES DE CUENTA
              ========================================== */}
          <div className="pt-2 space-y-1">
            <button
              type="button"
              onClick={handleGoProfile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:text-white transition-all duration-150 cursor-pointer text-left"
              style={{ color: 'var(--text-light)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.15)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-light)';
              }}
            >
              <svg className="w-4 h-4" style={{ color: 'var(--cyan)' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>Mi Perfil</span>
            </button>

            <button
              type="button"
              onClick={handleGoLanding}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:text-white transition-all duration-150 cursor-pointer text-left"
              style={{ color: 'var(--text-light)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.15)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-light)';
              }}
            >
              <svg className="w-4 h-4" style={{ color: 'var(--cyan)' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Portada / Landing</span>
            </button>

            {/* BOTÓN CERRAR SESIÓN */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-500/25 border border-transparent hover:border-rose-500/40 transition-all duration-150 cursor-pointer text-left"
            >
              <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

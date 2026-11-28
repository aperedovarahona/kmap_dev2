import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth.jsx';
import { update } from '../lib/db.js';
import { fail, ok } from '../alerts.js';
import Page from '../components/Page.jsx';
import {
  CheckCircleIcon,
  LockIcon,
  KeyIcon,
  PaletteIcon,
  SmartIcon,
} from '../components/Icons.jsx';
import './Profile.css';

/* ---------- Componente Robot Ojo ---------- */
function RobotEye({ hidden }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="robot-eye-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Cabeza del robot */}
      <rect x="4" y="6" width="16" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
      {/* Antena */}
      <path d="M12 6V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="2.5" r="1.5" fill="currentColor" />
      
      {hidden ? (
        /* Ojos cerrados / tapados (líneas horizontales) */
        <>
          <line x1="8" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="14" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* Manitas tapando */}
          <path d="M7 10.5C7 10.5 8 15 12 15C16 15 17 10.5 17 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : (
        /* Ojos abiertos y brillantes */
        <>
          <circle cx="9" cy="12" r="1.5" fill="currentColor" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          <path d="M12 14.5C12.5 15 13.5 15 14 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ---------- utilidades de fortaleza ---------- */
const RULES = [
  { id: 'len',   label: 'Mínimo 6 caracteres',            test: (v) => v.length >= 6 },
  { id: 'upper', label: 'Una mayúscula',                  test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Una minúscula',                  test: (v) => /[a-z]/.test(v) },
  { id: 'num',   label: 'Un número',                      test: (v) => /\d/.test(v) },
  { id: 'sym',   label: 'Un símbolo (!@#$…)',             test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function useStrength(pwd) {
  return useMemo(() => {
    const passed = RULES.map((r) => ({ ...r, ok: r.test(pwd) }));
    const score = passed.filter((r) => r.ok).length;
    let level = 0;
    if (pwd.length > 0) {
      if (score <= 1) level = 1;
      else if (score === 2) level = 2;
      else if (score === 3) level = 3;
      else if (score >= 4) level = 4;
    }
    const meta = [
      { label: 'Sin contraseña', color: '#3b4a63', pct: 0 },
      { label: 'Muy débil',      color: '#ff4d6d', pct: 25 },
      { label: 'Débil',          color: '#ffbe0b', pct: 50 },
      { label: 'Buena',          color: 'var(--cyan)', pct: 75 },
      { label: 'Muy segura',     color: '#00e676', pct: 100 },
    ][level];
    return { rules: passed, level, meta };
  }, [pwd]);
}

const AVATAR_OPTIONS = [
  { id: 'default', label: 'Por Defecto', icon: null },
  { id: 'dev-boy', label: 'Cyber Alumno', icon: '🧑‍💻' },
  { id: 'dev-girl', label: 'Cyber Alumna', icon: '👩‍💻' },
  { id: 'neon-grad', label: 'Graduado Neón', icon: '🎓' },
  { id: 'teacher', label: 'Docente Mentor', icon: '🧑‍🏫' },
  { id: 'scientist', label: 'Científica', icon: '👩‍🔬' },
  { id: 'astronaut', label: 'Cosmonauta', icon: '👨‍🚀' },
  { id: 'hacker', label: 'Ciber Hacker', icon: '🕵️' },
  { id: 'robot-bot', label: 'Dron Bot', icon: '🤖' },
  { id: 'wizard', label: 'Hechicero Dev', icon: '🧙' },
  { id: 'artist', label: 'Creativo Digital', icon: '🎨' },
  { id: 'fire', label: 'Fénix Neón', icon: '🔥' },
  { id: 'lightning', label: 'Chispa Cuántica', icon: '⚡' },
  { id: 'shield', label: 'Centinela', icon: '🛡️' },
  { id: 'star', label: 'Estrella Nova', icon: '⭐' },
  { id: 'cat', label: 'Cyber Neko', icon: '🐱' },
  { id: 'fox', label: 'Zorro Digital', icon: '🦊' },
  { id: 'gem', label: 'Gema Neón', icon: '💎' },
];

export default function Profile() {
  const { user } = useAuth();
  const [f, setF] = useState({ cur: '', next: '', rep: '' });
  const [show, setShow] = useState({ cur: false, next: false, rep: false });

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (k) => () => setShow((s) => ({ ...s, [k]: !s[k] }));

  const strength = useStrength(f.next);
  const match = f.rep.length > 0 && f.rep === f.next;
  const mismatch = f.rep.length > 0 && f.rep !== f.next;

  const selectAvatar = (iconOrNull) => {
    update((d) => {
      const u = d.users.find((x) => x.id === user.id);
      if (u) {
        u.avatar = iconOrNull;
      }
    });
    if (user) {
      user.avatar = iconOrNull;
    }
    ok('Avatar actualizado', 'Tu nuevo icono de perfil ha sido guardado con éxito.');
  };

  const submit = (e) => {
    e.preventDefault();
    if (f.cur !== user.password) return fail('La contraseña actual no es correcta');
    if (f.next.length < 6) return fail('La nueva contraseña necesita al menos 6 caracteres');
    if (f.next !== f.rep) return fail('Las contraseñas nuevas no coinciden');
    update((d) => {
      const u = d.users.find((x) => x.id === user.id);
      u.password = f.next;
      delete u.mustChange;
    });
    setF({ cur: '', next: '', rep: '' });
    ok('Contraseña actualizada');
  };

  const rows = [
    ['Nombre', user.name],
    ['Rol', user.role],
    user.sis && ['Código SIS', user.sis],
    user.email && ['Correo', user.email],
    user.carnet && ['Carnet', user.carnet],
  ].filter(Boolean);

  const initial = (user.name || '?').trim().charAt(0).toUpperCase();

  return (
    <Page crumb="KMapGraph › Perfil" title="Mi perfil">
      <div className="profile-grid">
        {/* ---------- Tarjeta de identidad y Avatar ---------- */}
        <motion.div
          className="profile-card profile-card--glow-border flex flex-col gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-hero">
            <div className="profile-avatar-ring">
              <div className="profile-avatar flex items-center justify-center select-none" style={{ background: 'var(--bg-secondary)', color: 'var(--cyan)' }}>
                {user.avatar ? <SmartIcon icon={user.avatar} className="w-8 h-8" /> : initial}
              </div>
            </div>
            <div className="profile-hero-text">
              <h2>{user.name}</h2>
              <span className="profile-role-pill">{user.role}</span>
            </div>
          </div>

          <div className="profile-rows">
            {rows.map(([k, v]) => (
              <div key={k} className="profile-row">
                <span className="profile-row-k">{k}</span>
                <b className="profile-row-v capitalize">{v}</b>
              </div>
            ))}
          </div>

          <div className="profile-badge-strip">
            <span className="chip chip-green inline-flex items-center gap-1.5">
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cuenta activa</span>
            </span>
            <span className="chip chip-cyan inline-flex items-center gap-1.5">
              <LockIcon className="w-3.5 h-3.5" />
              <span>Acceso seguro</span>
            </span>
          </div>

          {/* Galería de Iconos de Perfil Personalizables */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-wider uppercase inline-flex items-center gap-1.5">
                <PaletteIcon className="w-4 h-4 text-cyan-400" />
                <span>Icono de Perfil Personalizado</span>
              </span>
              <span className="text-[11px] text-[#8ca5c9]">
                {user.avatar ? 'Personalizado' : 'Iniciales'}
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {AVATAR_OPTIONS.map((av) => {
                const isSelected = (!user.avatar && av.id === 'default') || user.avatar === av.icon;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => selectAvatar(av.icon)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 cursor-pointer border"
                    style={{
                      background: isSelected
                        ? 'rgba(var(--primary-rgb), 0.25)'
                        : 'rgba(255, 255, 255, 0.04)',
                      borderColor: isSelected
                        ? 'var(--cyan)'
                        : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: isSelected
                        ? '0 0 12px rgba(var(--primary-rgb), 0.5)'
                        : 'none',
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                      color: isSelected ? 'var(--cyan)' : '#8da6c9',
                    }}
                    title={av.label}
                  >
                    {av.icon ? (
                      <SmartIcon icon={av.icon} className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-black opacity-80">{initial}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ---------- Formulario contraseña ---------- */}
        <motion.form
          onSubmit={submit}
          className="profile-card profile-card--glow-border profile-form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="profile-form-head">
            <b className="inline-flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-amber-400" />
              <span>Cambiar contraseña</span>
            </b>
            <span className="profile-form-sub">Refuerza tu seguridad</span>
          </div>

          {/* actual */}
          <div className="profile-field">
            <label>Contraseña actual</label>
            <div className="profile-input-wrap">
              <input
                className="input"
                type={show.cur ? 'text' : 'password'}
                placeholder="••••••••"
                value={f.cur}
                onChange={set('cur')}
              />
              <button type="button" className="eye-btn" onClick={toggle('cur')} aria-label="Mostrar">
                <RobotEye hidden={show.cur} />
              </button>
            </div>
          </div>

          {/* nueva */}
          <div className="profile-field">
            <label>Nueva contraseña</label>
            <div className="profile-input-wrap">
              <input
                className="input"
                type={show.next ? 'text' : 'password'}
                placeholder="••••••••"
                value={f.next}
                onChange={set('next')}
              />
              <button type="button" className="eye-btn" onClick={toggle('next')} aria-label="Mostrar">
                <RobotEye hidden={show.next} />
              </button>
            </div>

            {/* Barra de fortaleza */}
            <div className="strength">
              <div className="strength-track">
                <motion.div
                  className="strength-fill"
                  animate={{ width: `${strength.meta.pct}%`, background: strength.meta.color }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </div>
              <span className="strength-label" style={{ color: strength.meta.color }}>
                {strength.meta.label}
              </span>
            </div>

            {/* Checklist */}
            <ul className="rules">
              {strength.rules.map((r) => (
                <li key={r.id} className={r.ok ? 'rule ok' : 'rule'}>
                  <span className="rule-dot">{r.ok ? '✓' : '○'}</span>
                  {r.label}
                </li>
              ))}
            </ul>
          </div>

          {/* repetir */}
          <div className="profile-field">
            <label>Repite la nueva contraseña</label>
            <div className="profile-input-wrap">
              <input
                className="input"
                type={show.rep ? 'text' : 'password'}
                placeholder="••••••••"
                value={f.rep}
                onChange={set('rep')}
              />
              <button type="button" className="eye-btn" onClick={toggle('rep')} aria-label="Mostrar">
                <RobotEye hidden={show.rep} />
              </button>
            </div>
            {match && <span className="match-msg ok">✓ Las contraseñas coinciden</span>}
            {mismatch && <span className="match-msg bad">✕ No coinciden</span>}
          </div>

          <button className="btn profile-submit" type="submit">
            Guardar cambios
          </button>
        </motion.form>
      </div>
    </Page>
  );
}
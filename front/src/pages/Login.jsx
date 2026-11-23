import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth.jsx';
import { fail, info } from '../alerts.js';
import { Tabs } from '../components/ui.jsx';
import RobotMascotStatic from '../components/RobotMascotStatic.jsx';
import { BitLogo, Line } from '../components/FX.jsx';
import './Login.css';

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState('estudiante');
  const [mode, setMode] = useState('login');
  const [passFocus, setPassFocus] = useState(false);
  const [f, setF] = useState({
    ident: '',
    password: '',
    name: '',
    sis: '',
    email: '',
    confirm: '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const reg = role === 'estudiante' && mode === 'register';

  const submit = (e) => {
    e.preventDefault();
    try {
      const u = reg ? register(f) : login(role, f.ident, f.password);
      if (u.mustChange)
        info(
          'Contraseña por defecto',
          'Tu contraseña inicial es tu carnet. Cámbiala desde <b>Mi Perfil</b>.'
        );
      nav('/panel');
    } catch (err) {
      fail(err.message);
    }
  };

  const quickLogin = (r, ident, pass) => {
    setRole(r);
    setMode('login');
    setF((prev) => ({ ...prev, ident, password: pass }));
    try {
      login(r, ident, pass);
      nav('/panel');
    } catch (err) {
      fail(err.message);
    }
  };

  const badgeText = passFocus
    ? '🙈 ¡No miro tu contraseña!'
    : '🤖 ¡Hola! Soy tu tutor interactivo KMAP';

  return (
    <div className="login-page-wrapper">
      <div className="login-content-grid">
        {/* Lado izquierdo: mascota estática compartida con la landing */}
        <div className="login-mascot-column">
          <div className="login-mascot-float">
            <RobotMascotStatic size="xl" />
          </div>
          <div className="login-mascot-badge mt-4">
            <span className="text-xs font-bold text-cyan-200 tracking-wide">
              <Line text={badgeText} kind="" />
            </span>
          </div>
        </div>

        {/* Lado derecho: tarjeta de formulario */}
        <div className="login-form-column">
          <motion.form
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={submit}
            className="card-glow w-full flex flex-col gap-4 p-7"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Logo animado: se escribe solo y cada letra salta al pasar el cursor */}
              <BitLogo onClick={() => nav('/')} title="Volver a la portada" />
              <button
                type="button"
                onClick={() => nav('/')}
                className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-none p-0"
                title="Volver a la página principal"
              >
                ← Volver al inicio
              </button>
            </div>

            <h1 className="login-title">
              <Line text={reg ? 'Crea tu cuenta' : '¡Hola de nuevo!'} kind="l-wave" />
            </h1>

            <p className="text-[#8ca5c9] text-sm">
              Explora tu grafo de conocimiento, realiza quizzes adaptativos y descubre tu ruta de
              aprendizaje con nuestro bot tutor ✨
            </p>

            <Tabs
              tabs={[
                ['estudiante', '🎓 Estudiante'],
                ['docente', '👨‍🏫 Docente'],
                ['admin', '🛠️ Admin'],
              ]}
              value={role}
              onChange={(r) => {
                setRole(r);
                setMode('login');
              }}
            />

            {reg && (
              <>
                <input
                  className="input"
                  placeholder="Nombre completo"
                  value={f.name}
                  onChange={set('name')}
                  required
                />
                <input
                  className="input"
                  placeholder="Código SIS (ej. 202012345)"
                  inputMode="numeric"
                  value={f.sis}
                  onChange={set('sis')}
                  required
                />
                <input
                  className="input"
                  type="email"
                  placeholder="Correo institucional (@est.umss.edu)"
                  value={f.email}
                  onChange={set('email')}
                  required
                />
              </>
            )}

            {!reg && (
              <input
                className="input"
                placeholder={
                  role === 'estudiante'
                    ? 'Código SIS o correo (ej. 202012345)'
                    : role === 'docente'
                    ? 'Usuario, correo o carnet (ej. Prof. Rivera o docente@demo.com)'
                    : 'Usuario admin (ej. admin)'
                }
                value={f.ident}
                onChange={set('ident')}
                required
              />
            )}

            <input
              className="input"
              type="password"
              placeholder="Contraseña"
              value={f.password}
              onChange={set('password')}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              required
            />

            {reg && (
              <input
                className="input"
                type="password"
                placeholder="Repite la contraseña"
                value={f.confirm}
                onChange={set('confirm')}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                required
              />
            )}

            <button type="submit" className="btn w-full mt-1">
              {reg ? 'Crear cuenta ❯' : 'Iniciar sesión ❯'}
            </button>

            {role === 'estudiante' && (
              <button
                type="button"
                className="text-sm text-[#00d2ff] hover:underline"
                onClick={() => setMode(reg ? 'login' : 'register')}
              >
                {reg ? 'Ya tengo cuenta · Iniciar sesión' : 'Registrarme como nuevo estudiante'}
              </button>
            )}

            <div className="border-t border-[#00d2ff]/20 pt-3 mt-1">
              <div className="text-xs text-[#8ca5c9] mb-2 font-semibold">
                Acceso rápido cuentas Demo (1 clic):
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => quickLogin('estudiante', '202012345', '123456')}
                  className="btn-ghost text-xs py-2 flex flex-col items-center gap-0.5"
                >
                  <span className="text-[#00f2fe] font-bold">Estudiante</span>
                  <span className="text-[11px] text-[#8ca5c9]">202012345</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('docente', 'Prof. Rivera', '1234567')}
                  className="btn-ghost text-xs py-2 flex flex-col items-center gap-0.5"
                >
                  <span className="text-[#00f2fe] font-bold">Docente</span>
                  <span className="text-[11px] text-[#8ca5c9]">Prof. Rivera</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('admin', 'admin', 'admin123')}
                  className="btn-ghost text-xs py-2 flex flex-col items-center gap-0.5"
                >
                  <span className="text-[#00f2fe] font-bold">Admin</span>
                  <span className="text-[11px] text-[#8ca5c9]">admin</span>
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
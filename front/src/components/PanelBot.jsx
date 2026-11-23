import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth.jsx';

/**
 * ============================================================================
 * PANEL BOT · Asistente IA Modular e Independiente para Dashboards (KMAP)
 * Módulo unificado que encapsula su lógica JSX y estilos CSS en un solo archivo .js
 * ============================================================================
 */

const PANEL_BOT_STYLES = `
/* ---------- Contenedor principal flotante ---------- */
.pbot-container {
  position: fixed;
  bottom: 22px;
  right: 24px;
  z-index: 9999;
  user-select: none;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  touch-action: none;
}

/* ---------- Orbe Dron Principal ---------- */
.pbot-core {
  position: relative;
  width: 130px;
  height: 140px;
  cursor: grab;
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 25px rgba(0, 242, 254, 0.35));
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.pbot-core:active {
  cursor: grabbing;
  transform: scale(0.97);
}

/* Levitación continua suave */
.pbot-hover-anim {
  animation: pbot-float 5s ease-in-out infinite;
}
@keyframes pbot-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}

/* SVG del Dron */
.pbot-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Anillos orbitales giratorios */
.pbot-ring-outer {
  transform-origin: 65px 70px;
  animation: pbot-spin 12s linear infinite;
}
.pbot-ring-inner {
  transform-origin: 65px 70px;
  animation: pbot-spin-reverse 8s linear infinite;
}
@keyframes pbot-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pbot-spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Pulso del propulsor inferior */
.pbot-thruster {
  transform-origin: 65px 120px;
  animation: pbot-thrust 1.6s ease-in-out infinite alternate;
}
@keyframes pbot-thrust {
  0% { transform: scaleY(0.85); opacity: 0.6; }
  100% { transform: scaleY(1.25); opacity: 1; }
}

/* ---------- Burbuja de diálogo contextual ---------- */
.pbot-speech-bubble {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  max-width: 250px;
  min-width: 190px;
  background: rgba(var(--bg-secondary-rgb, 6, 18, 38), 0.94);
  border: 1px solid rgba(var(--primary-rgb), 0.5);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(var(--primary-rgb), 0.25);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 10px 14px;
  border-radius: 16px;
  color: #e2f1ff;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.35;
  pointer-events: auto;
  opacity: 0;
  transform: translateY(10px) scale(0.92);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pbot-speech-bubble.active {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.pbot-bubble-tail {
  position: absolute;
  bottom: -6px;
  right: 48px;
  width: 12px;
  height: 12px;
  background: rgba(var(--bg-secondary-rgb, 6, 18, 38), 0.94);
  border-right: 1px solid rgba(var(--primary-rgb), 0.5);
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.5);
  transform: rotate(45deg);
}
.pbot-bubble-badge {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--cyan);
  display: flex;
  align-items: center;
  gap: 5px;
}
.pbot-bubble-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
  animation: pbot-blink 1.4s infinite;
}
@keyframes pbot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ---------- Menú Interactivo al hacer clic ---------- */
.pbot-quick-menu {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: rgba(3, 13, 30, 0.96);
  border: 1px solid rgba(157, 80, 255, 0.55);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.75), 0 0 25px rgba(157, 80, 255, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 18px;
  padding: 12px;
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 30;
  animation: pbot-pop 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes pbot-pop {
  from { opacity: 0; transform: scale(0.9) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.pbot-menu-header {
  font-size: 0.72rem;
  font-weight: 800;
  color: #c4b5fd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 6px;
}
.pbot-menu-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 10px;
  padding: 7px 10px;
  color: #e2f1ff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  transition: all 0.2s ease;
}
.pbot-menu-btn:hover {
  background: rgba(var(--primary-rgb), 0.15);
  border-color: var(--cyan);
  color: #ffffff;
  transform: translateX(3px);
}

/* ---------- Botón Flotante Minimizado ---------- */
.pbot-mini-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--cyan), var(--blue) 70%, var(--bg-primary, #030d1e));
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 25px rgba(var(--primary-rgb), 0.65), 0 8px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
  animation: pbot-mini-pulse 3s infinite;
}
.pbot-mini-trigger:hover {
  transform: scale(1.12) rotate(8deg);
  box-shadow: 0 0 35px rgba(var(--primary-rgb), 0.9), 0 10px 25px rgba(0, 0, 0, 0.6);
}
@keyframes pbot-mini-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.6); }
  50% { box-shadow: 0 0 35px rgba(var(--secondary-rgb), 0.8); }
}

/* Partículas de chispas */
.pbot-sparkle {
  position: absolute;
  pointer-events: none;
  font-size: 14px;
  animation: pbot-spark 0.8s ease-out forwards;
}
@keyframes pbot-spark {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
}
`;

export default function PanelBot() {
  const { user } = useAuth();
  const [minimized, setMinimized] = useState(false);
  const [speech, setSpeech] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mood, setMood] = useState('happy'); // 'happy' | 'blink' | 'wink' | 'think'
  const [sparkles, setSparkles] = useState([]);
  const [pos, setPos] = useState(null); // { x, y } personalizado por arrastre
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef(null);
  const bubbleTimer = useRef(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  // Mensajes sugeridos según rol
  const tips = user?.role === 'docente' ? [
    '¡Revisa el mapa de calor de tus estudiantes! 📊',
    'Puedes crear nuevos nodos en el editor de grafo ✏️',
    'Los quizzes adaptativos evalúan el dominio de temas 🎯',
  ] : user?.role === 'admin' ? [
    'Panel de administración operativo y seguro 🛡️',
    'Gestiona usuarios y asignaturas desde aquí 👥',
    'Servidor de base de datos MySQL conectado 🚀',
  ] : [
    '¡Domina un nodo para desbloquear el siguiente! 🚀',
    'Haz clic en cualquier tema para repasar el contenido 📖',
    'Los quizzes adaptativos se ajustan a tu velocidad ✨',
    '¡Tu racha de estudio se actualiza con cada quiz completado! 🌟',
  ];

  const triggerSpeech = (text, duration = 3200) => {
    setSpeech(text);
    setShowBubble(true);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => {
      setShowBubble(false);
    }, duration);
  };

  // Saludo inicial al montar el panel
  useEffect(() => {
    const saludoInicial = user?.name
      ? `¡Hola, ${user.name.split(' ')[0]}! Soy AURA, tu bot de soporte 🤖`
      : '¡Bienvenido al panel! Estoy aquí para acompañarte 🚀';
    
    const t = setTimeout(() => {
      triggerSpeech(saludoInicial, 3500);
    }, 600);

    // Parpadeo cíclico
    const blinkInterval = setInterval(() => {
      setMood('blink');
      setTimeout(() => setMood('happy'), 160);
    }, 4500);

    return () => {
      clearTimeout(t);
      clearInterval(blinkInterval);
      clearTimeout(bubbleTimer.current);
    };
  }, [user]);

  // Disparar chispas visuales
  const spawnSparkles = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: rect.width / 2,
      y: rect.height / 2,
      dx: `${(Math.random() - 0.5) * 80}px`,
      dy: `${(Math.random() - 0.5) * 80}px`,
      char: ['✨', '⚡', '✦', '🛸'][Math.floor(Math.random() * 4)],
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
    }, 850);
  };

  // Arrastre suave
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.pbot-quick-menu')) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    setDragging(true);
    el.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.moved && Math.hypot(dx, dy) > 5) {
      dragRef.current.moved = true;
    }
    if (!dragRef.current.moved) return;

    const width = 140;
    const height = 150;
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);
    const nextX = Math.min(maxX, Math.max(10, e.clientX - dragRef.current.offsetX));
    const nextY = Math.min(maxY, Math.max(10, e.clientY - dragRef.current.offsetY));
    setPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.active) return;
    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    setDragging(false);
    containerRef.current?.releasePointerCapture?.(e.pointerId);

    if (!moved) {
      // Clic normal: alternar menú interactivo y soltar chispas
      setMood('wink');
      spawnSparkles(e);
      setMenuOpen((prev) => !prev);
      setTimeout(() => setMood('happy'), 500);
    }
  };

  return (
    <>
      {/* Inyección modular de estilos autónomos */}
      <style>{PANEL_BOT_STYLES}</style>

      {/* Versión minimizada */}
      {minimized ? (
        <button
          type="button"
          onClick={() => {
            setMinimized(false);
            triggerSpeech('¡De vuelta en acción! 🚀', 2500);
          }}
          className="pbot-mini-trigger"
          title="Abrir Asistente AURA"
          aria-label="Abrir Asistente AURA"
        >
          <span style={{ fontSize: '24px' }}>🤖</span>
        </button>
      ) : (
        <div
          ref={containerRef}
          className="pbot-container"
          style={
            pos
              ? { left: `${pos.x}px`, top: `${pos.y}px`, right: 'auto', bottom: 'auto' }
              : undefined
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Partículas de chispas */}
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="pbot-sparkle"
              style={{ left: s.x, top: s.y, '--dx': s.dx, '--dy': s.dy }}
            >
              {s.char}
            </span>
          ))}

          {/* Menú rápido al interactuar */}
          {menuOpen && (
            <div className="pbot-quick-menu">
              <div className="pbot-menu-header">
                <span>⚡ ASISTENTE KMAP</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#8da6c9', cursor: 'pointer', fontSize: '13px' }}
                >
                  ✕
                </button>
              </div>
              <button
                type="button"
                className="pbot-menu-btn"
                onClick={() => {
                  const randomTip = tips[Math.floor(Math.random() * tips.length)];
                  triggerSpeech(randomTip, 4000);
                  setMenuOpen(false);
                }}
              >
                💡 <span>Dame un consejo</span>
              </button>
              <button
                type="button"
                className="pbot-menu-btn"
                onClick={() => {
                  triggerSpeech('¡Tú puedes lograrlo! El dominio paso a paso es la clave 🎯', 3500);
                  setMenuOpen(false);
                }}
              >
                🔥 <span>Motivación</span>
              </button>
              <button
                type="button"
                className="pbot-menu-btn"
                onClick={() => {
                  setPos(null);
                  triggerSpeech('¡Posición restablecida! 📍', 2000);
                  setMenuOpen(false);
                }}
              >
                📍 <span>Centrar en esquina</span>
              </button>
              <button
                type="button"
                className="pbot-menu-btn"
                style={{ color: '#fda4af' }}
                onClick={() => {
                  setMenuOpen(false);
                  setMinimized(true);
                }}
              >
                💤 <span>Minimizar a botón</span>
              </button>
            </div>
          )}

          {/* Globo de diálogo inteligente */}
          <div className={`pbot-speech-bubble ${showBubble ? 'active' : ''}`}>
            <div className="pbot-bubble-badge">
              <span>AURA · Tutor Virtual</span>
            </div>
            <div>{speech}</div>
            <div className="pbot-bubble-tail" />
          </div>

          {/* Cuerpo Dron Futurista (Diseño autónomo propio de paneles) */}
          <div className="pbot-core pbot-hover-anim" title="Haz clic para interactuar o arrastra para mover">
            <svg className="pbot-svg" viewBox="0 0 130 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Degradados de chasis y brillo */}
                <linearGradient id="pbotBodyGrad" x1="20" y1="20" x2="110" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="50%" stopColor="#0a192f" />
                  <stop offset="100%" stopColor="#030914" />
                </linearGradient>
                <linearGradient id="pbotVisorGrad" x1="30" y1="40" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#001830" />
                  <stop offset="100%" stopColor="#000711" />
                </linearGradient>
                <linearGradient id="pbotNeonCyan" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--cyan)" />
                  <stop offset="100%" stopColor="var(--blue)" />
                </linearGradient>
                <radialGradient id="pbotPlasmaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="var(--secondary, var(--purple))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Halo de energía de fondo */}
              <circle cx="65" cy="70" r="48" fill="url(#pbotPlasmaGlow)" opacity="0.65" />

              {/* Anillo orbital exterior antigravedad */}
              <g className="pbot-ring-outer">
                <ellipse cx="65" cy="70" rx="56" ry="18" stroke="url(#pbotNeonCyan)" strokeWidth="1.8" strokeDasharray="18 10" opacity="0.85" />
                <circle cx="121" cy="70" r="3.5" fill="var(--cyan)" style={{ filter: 'drop-shadow(0 0 6px var(--cyan))' }} />
              </g>

              {/* Anillo orbital interior cruzado */}
              <g className="pbot-ring-inner">
                <ellipse cx="65" cy="70" rx="46" ry="14" stroke="var(--secondary, var(--purple))" strokeWidth="1.4" strokeDasharray="12 8" opacity="0.75" />
                <circle cx="19" cy="70" r="3" fill="var(--secondary, var(--purple))" style={{ filter: 'drop-shadow(0 0 5px var(--secondary, var(--purple)))' }} />
              </g>

              {/* Antena / Sensor superior */}
              <line x1="65" y1="36" x2="65" y2="20" stroke="var(--cyan)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="65" cy="18" r="5" fill="var(--secondary, var(--purple))" stroke="var(--cyan)" strokeWidth="1.5" />
              <circle cx="65" cy="18" r="2.5" fill="var(--cyan)" />

              {/* Chasis esférico metálico */}
              <circle cx="65" cy="70" r="34" fill="url(#pbotBodyGrad)" stroke="var(--cyan)" strokeWidth="2.5" />

              {/* Detalle de armadura lateral */}
              <path d="M 35 60 Q 32 70 35 80" stroke="var(--secondary, var(--purple))" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 95 60 Q 98 70 95 80" stroke="var(--secondary, var(--purple))" strokeWidth="2.5" strokeLinecap="round" />

              {/* Visor digital negro curvado */}
              <rect x="42" y="54" width="46" height="30" rx="14" fill="url(#pbotVisorGrad)" stroke="rgba(var(--primary-rgb), 0.5)" strokeWidth="1.5" />

              {/* Expresiones LED dinámicas en el visor */}
              {mood === 'blink' ? (
                // Ojos parpadeando (líneas planas)
                <g stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round">
                  <line x1="50" y1="69" x2="58" y2="69" />
                  <line x1="72" y1="69" x2="80" y2="69" />
                </g>
              ) : mood === 'wink' ? (
                // Ojo izquierdo guiñando, derecho abierto
                <g>
                  <path d="M 49 69 Q 54 64 59 69" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <circle cx="76" cy="69" r="4" fill="var(--cyan)" style={{ filter: 'drop-shadow(0 0 5px var(--cyan))' }} />
                </g>
              ) : (
                // Ojos normales felices LED brillantes
                <g fill="var(--cyan)">
                  <ellipse cx="54" cy="68" rx="4.5" ry="5.5" style={{ filter: 'drop-shadow(0 0 6px var(--cyan))' }} />
                  <ellipse cx="76" cy="68" rx="4.5" ry="5.5" style={{ filter: 'drop-shadow(0 0 6px var(--cyan))' }} />
                  {/* Pupilas de luz blanca */}
                  <circle cx="55.5" cy="66.5" r="1.6" fill="#ffffff" />
                  <circle cx="77.5" cy="66.5" r="1.6" fill="#ffffff" />
                </g>
              )}

              {/* Sonrisa digital LED tenue */}
              <path d="M 60 76 Q 65 79 70 76" stroke="rgba(var(--primary-rgb), 0.75)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

              {/* Propulsor inferior con cono de iones */}
              <g className="pbot-thruster">
                <polygon points="56,104 74,104 65,122" fill="url(#pbotNeonCyan)" opacity="0.85" style={{ filter: 'drop-shadow(0 0 8px var(--cyan))' }} />
                <ellipse cx="65" cy="104" rx="8" ry="2.5" fill="#1e3a5f" stroke="var(--cyan)" strokeWidth="1.2" />
              </g>
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import './RobotMascot.css';

const MESSAGE_TRIGGER_CLICK = 3;
const CUSTOM_MESSAGE = '¡Hola! Soy BITSIBOOT, tu tutor de Plan KMAP 🚀';

export default function RobotMascot({
  mode = 'floating',
  size = 'md',
  coveringEyes = false,
  className = '',
}) {
  const [bubbleText, setBubbleText] = useState('¡Saludos!');
  const [showBubble, setShowBubble] = useState(false);
  const [saluting, setSaluting] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [flakes, setFlakes] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [dragging, setDragging] = useState(false);
  // null = posición por defecto (bottom: 18px, right: 20px); { x, y } = posición personalizada al arrastrar
  const [pos, setPos] = useState(null);

  const petRef = useRef(null);
  const dragInfoRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const clickCountRef = useRef(0);
  const bubbleTimerRef = useRef(null);
  const saluteTimerRef = useRef(null);

  // Reacción interactiva cuando se selecciona el campo de contraseña
  useEffect(() => {
    if (coveringEyes) {
      triggerBubble('¡No miro! 🙈', 3000);
    }
  }, [coveringEyes]);

  const triggerBubble = (text, duration = 2200) => {
    setBubbleText(text);
    setShowBubble(true);
    clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, duration);
  };

  const triggerSalute = () => {
    setSaluting(false);
    setTimeout(() => {
      setSaluting(true);
      clearTimeout(saluteTimerRef.current);
      saluteTimerRef.current = setTimeout(() => {
        setSaluting(false);
      }, 1550);
    }, 10);
  };

  const spawnSnow = (count = 24) => {
    const chars = ['❄', '❅', '•'];
    const batchId = Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const created = Array.from({ length: count }, (_, i) => {
      const duration = 2.4 + Math.random() * 2.2;
      const delay = Math.random() * 0.45;
      return {
        id: `${batchId}-${i}`,
        char: chars[i % chars.length],
        left: `${Math.random() * 100}vw`,
        fontSize: `${10 + Math.random() * 12}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        drift: `${(Math.random() * 44 - 22).toFixed(1)}px`,
        ttl: (duration + delay + 0.25) * 1000,
      };
    });

    setFlakes((prev) => [...prev, ...created]);
    const maxTtl = Math.max(...created.map((f) => f.ttl));
    setTimeout(() => {
      const ids = new Set(created.map((f) => f.id));
      setFlakes((prev) => prev.filter((f) => !ids.has(f.id)));
    }, maxTtl);
  };

  const handleInteractionClick = () => {
    clickCountRef.current += 1;
    spawnSnow(24);

    if (clickCountRef.current % MESSAGE_TRIGGER_CLICK === 0) {
      triggerSalute();
      triggerBubble(CUSTOM_MESSAGE, 2800);
    } else {
      const greetings = ['¡Saludos! 🤖', '¡A seguir aprendiendo! ✨', '¡Revisa tu grafo! 🚀'];
      triggerBubble(greetings[clickCountRef.current % greetings.length], 1800);
    }
  };

  // Inicio de arrastre con cursor o touch
  const handlePointerDown = (e) => {
    if (e.target.closest('[data-mascot-control]')) return;
    const el = petRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragInfoRef.current = {
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
    const info = dragInfoRef.current;
    if (!info.active) return;

    const dx = e.clientX - info.startX;
    const dy = e.clientY - info.startY;
    if (!info.moved && Math.hypot(dx, dy) > 6) {
      info.moved = true;
    }
    if (!info.moved) return;

    const width = 165;
    const height = 230;
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);
    const nextX = Math.min(maxX, Math.max(0, e.clientX - info.offsetX));
    const nextY = Math.min(maxY, Math.max(0, e.clientY - info.offsetY));
    setPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e) => {
    const info = dragInfoRef.current;
    if (!info.active) return;
    info.active = false;
    setDragging(false);
    petRef.current?.releasePointerCapture?.(e.pointerId);

    if (!info.moved) {
      handleInteractionClick();
    } else {
      triggerBubble('¡Nueva posición! 🚀', 1400);
    }
  };

  const handleHide = (e) => {
    e.stopPropagation();
    setHidden(true);
  };

  const handleShow = () => {
    setHidden(false);
    setTimeout(() => {
      triggerSalute();
      triggerBubble('¡Volví para ayudarte! 🤖', 2000);
    }, 80);
  };

  useEffect(() => {
    if (mode === 'static') return;
    const greetingMsg = mode === 'inline' ? '¡Hola! Bienvenido a Plan KMAP 🚀' : '¡Saludos! Puedes moverme 👋';
    const initTimer = setTimeout(() => {
      triggerSalute();
      triggerBubble(greetingMsg, 2200);
    }, 350);

    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 140);
    }, 3500);

    const onResize = () => {
      setPos((prev) => {
        if (!prev) return null;
        const maxX = Math.max(0, window.innerWidth - 165);
        const maxY = Math.max(0, window.innerHeight - 230);
        return {
          x: Math.min(maxX, Math.max(0, prev.x)),
          y: Math.min(maxY, Math.max(0, prev.y)),
        };
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(initTimer);
      clearInterval(blinkInterval);
      clearTimeout(bubbleTimerRef.current);
      clearTimeout(saluteTimerRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div className="pet-snow-layer">
        {flakes.map((f) => (
          <span
            key={f.id}
            className="pet-snow-flake"
            style={{
              left: f.left,
              fontSize: f.fontSize,
              animationDuration: f.animationDuration,
              animationDelay: f.animationDelay,
              '--drift': f.drift,
            }}
          >
            {f.char}
          </span>
        ))}
      </div>

      {/* Ícono flotante para mostrar la mascota cuando está escondida (solo en modo floating) */}
      {hidden && mode === 'floating' ? (
        <button
          type="button"
          onClick={handleShow}
          title="Mostrar mascota Kmap"
          className="fixed bottom-5 right-5 z-[99999] w-14 h-14 rounded-full bg-gradient-to-br from-[#00f2fe] via-cyan-400 to-[#0077fe] text-[#021226] border-2 border-white shadow-[0_0_25px_rgba(0,242,254,0.75)] hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-200 grid place-items-center cursor-pointer group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">🤖</span>
          <span className="absolute right-full mr-3 px-3 py-1 rounded-xl bg-[#071a38] border border-cyan-300/70 text-cyan-200 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
            Mostrar mascota
          </span>
        </button>
      ) : (
        <div
          id="pet-2d"
          ref={petRef}
          onPointerDown={mode === 'floating' ? handlePointerDown : undefined}
          onPointerMove={mode === 'floating' ? handlePointerMove : undefined}
          onPointerUp={mode === 'floating' ? handlePointerUp : undefined}
          onPointerCancel={mode === 'floating' ? handlePointerUp : undefined}
          onClick={mode === 'inline' ? handleInteractionClick : undefined}
          style={
            mode === 'floating'
              ? pos
                ? {
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    right: 'auto',
                    bottom: 'auto',
                    cursor: dragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                  }
                : {
                    cursor: dragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                  }
              : undefined
          }
          className={`group ${mode === 'inline' || mode === 'static' ? 'pet-inline' : ''} ${
            size === 'lg' ? 'pet-lg' : size === 'xl' ? 'pet-xl' : ''
          } ${blinking ? 'blinking' : ''} ${coveringEyes ? 'covering-eyes' : ''} ${
            saluting ? 'saluting' : ''
          } ${dragging ? 'scale-105' : ''} ${className}`.trim()}
          title={
            mode === 'floating'
              ? 'Arrastra para mover o haz clic para interactuar'
              : 'Haz clic para interactuar con la mascota'
          }
        >
          {/* Botones de control de la mascota (Solo en modo floating) */}
          {mode === 'floating' && (
            <div
              data-mascot-control="true"
              className="absolute -top-2 right-1 z-20 flex items-center gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity"
            >
              {pos && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPos(null);
                    triggerBubble('¡Posición original! 📍', 1400);
                  }}
                  title="Volver a la esquina inferior derecha"
                  className="w-7 h-7 rounded-full bg-[#071c40]/95 border border-cyan-300/70 text-cyan-200 hover:bg-cyan-400 hover:text-[#021226] hover:scale-110 active:scale-90 text-xs font-black grid place-items-center shadow-[0_0_12px_rgba(0,242,254,0.45)] transition-all cursor-pointer"
                >
                  📍
                </button>
              )}
              <button
                type="button"
                onClick={handleHide}
                title="Esconder mascota"
                className="w-7 h-7 rounded-full bg-[#071c40]/95 border border-cyan-300/70 text-cyan-200 hover:bg-rose-500 hover:border-rose-300 hover:text-white hover:scale-110 active:scale-90 text-xs font-black grid place-items-center shadow-[0_0_12px_rgba(0,242,254,0.45)] transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <div className={`pet-bubble ${showBubble ? 'show' : ''}`} id="pet-bubble">
            {bubbleText}
          </div>
          <svg className="pet-svg" viewBox="0 0 200 235" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b8ea8" />
                <stop offset="55%" stopColor="#4e6d85" />
                <stop offset="100%" stopColor="#334a5c" />
              </linearGradient>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#587992" />
                <stop offset="65%" stopColor="#436076" />
                <stop offset="100%" stopColor="#2e4354" />
              </linearGradient>
              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#193347" />
                <stop offset="100%" stopColor="#0b1822" />
              </linearGradient>
              <radialGradient id="cyanOrbGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" style={{ stopColor: 'var(--cyan)' }} />
                <stop offset="60%" style={{ stopColor: 'var(--cyan)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--blue)' }} />
              </radialGradient>
              <linearGradient id="cyanTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'var(--cyan)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--blue)' }} />
              </linearGradient>
              <linearGradient id="santaRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="55%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="santaFluffGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            <g id="rig-root">
              <ellipse cx="100" cy="215" rx="46" ry="7" fill="#091118" opacity="0.45" />
              <g id="rig-legs">
                <rect
                  x="65"
                  y="162"
                  width="27"
                  height="36"
                  rx="10"
                  fill="url(#bodyGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="3"
                />
                <line
                  x1="68"
                  y1="181"
                  x2="89"
                  y2="181"
                  stroke="#1e2d3a"
                  strokeWidth="2"
                  opacity="0.65"
                />
                <rect x="63" y="168" width="5" height="20" rx="2.5" fill="url(#cyanTrimGrad)" />
                <circle
                  cx="79"
                  cy="181"
                  r="7.5"
                  fill="url(#cyanOrbGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="2.2"
                />
                <ellipse
                  cx="78"
                  cy="202"
                  rx="17"
                  ry="8.5"
                  fill="url(#shellGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="3"
                />
                <path
                  d="M66 200 Q78 196 90 200"
                  fill="none"
                  stroke="#8fb0c9"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <rect
                  x="108"
                  y="162"
                  width="27"
                  height="36"
                  rx="10"
                  fill="url(#bodyGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="3"
                />
                <line
                  x1="111"
                  y1="181"
                  x2="132"
                  y2="181"
                  stroke="#1e2d3a"
                  strokeWidth="2"
                  opacity="0.65"
                />
                <rect x="132" y="168" width="5" height="20" rx="2.5" fill="url(#cyanTrimGrad)" />
                <circle
                  cx="121"
                  cy="181"
                  r="7.5"
                  fill="url(#cyanOrbGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="2.2"
                />
                <ellipse
                  cx="122"
                  cy="202"
                  rx="17"
                  ry="8.5"
                  fill="url(#shellGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="3"
                />
                <path
                  d="M110 200 Q122 196 134 200"
                  fill="none"
                  stroke="#8fb0c9"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </g>

              <g id="rig-body">
                <rect
                  x="82"
                  y="100"
                  width="36"
                  height="14"
                  rx="5"
                  fill="#2c3f4f"
                  stroke="#1e2d3a"
                  strokeWidth="2.5"
                />
                <rect
                  x="65"
                  y="108"
                  width="70"
                  height="60"
                  rx="23"
                  fill="url(#bodyGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="3.5"
                />
                <path
                  d="M78 109 Q100 122 122 109"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="7.5"
                  strokeLinecap="round"
                />
                <rect x="82" y="122" width="36" height="6.5" rx="3.2" fill="#22d3ee" opacity="0.9" />
                <path
                  d="M73 152 Q100 158 127 152"
                  fill="none"
                  stroke="#1e2d3a"
                  strokeWidth="2"
                  opacity="0.55"
                />
              </g>

              <g id="rig-arms-normal">
                <g id="rig-arm-right">
                  <path
                    d="M64 119 L43 153"
                    stroke="#1e2d3a"
                    strokeWidth="21"
                    strokeLinecap="round"
                  />
                  <path
                    d="M64 119 L43 153"
                    stroke="url(#bodyGrad)"
                    strokeWidth="15.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="64"
                    cy="119"
                    r="10.5"
                    fill="url(#shellGrad)"
                    stroke="#1e2d3a"
                    strokeWidth="2.8"
                  />
                  <path
                    d="M56 131 L51 140"
                    stroke="#22d3ee"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <g transform="translate(41, 157)">
                    <line
                      x1="-6"
                      y1="4"
                      x2="-11"
                      y2="13"
                      stroke="#1e2d3a"
                      strokeWidth="6.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="-6"
                      y1="4"
                      x2="-11"
                      y2="13"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="6"
                      x2="-1"
                      y2="16"
                      stroke="#1e2d3a"
                      strokeWidth="6.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="6"
                      x2="-1"
                      y2="16"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="6"
                      y1="4"
                      x2="9"
                      y2="13"
                      stroke="#1e2d3a"
                      strokeWidth="6.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="6"
                      y1="4"
                      x2="9"
                      y2="13"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="9.5"
                      fill="url(#shellGrad)"
                      stroke="#1e2d3a"
                      strokeWidth="2.6"
                    />
                  </g>
                </g>

                <g id="rig-arm-left">
                  <path
                    d="M136 119 L157 153"
                    stroke="#1e2d3a"
                    strokeWidth="21"
                    strokeLinecap="round"
                  />
                  <path
                    d="M136 119 L157 153"
                    stroke="url(#bodyGrad)"
                    strokeWidth="15.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="136"
                    cy="119"
                    r="10.5"
                    fill="url(#shellGrad)"
                    stroke="#1e2d3a"
                    strokeWidth="2.8"
                  />
                  <path
                    d="M144 131 L149 140"
                    stroke="#22d3ee"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <g transform="translate(159, 157)">
                    <line
                      x1="-6"
                      y1="4"
                      x2="-11"
                      y2="13"
                      stroke="#1e2d3a"
                      strokeWidth="6.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="-6"
                      y1="4"
                      x2="-11"
                      y2="13"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="6"
                      x2="1"
                      y2="16"
                      stroke="#1e2d3a"
                      strokeWidth="6.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="6"
                      x2="1"
                      y2="16"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="6"
                      y1="4"
                      x2="11"
                      y2="13"
                      stroke="#1e2d3a"
                      strokeWidth="6.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="6"
                      y1="4"
                      x2="11"
                      y2="13"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="9.5"
                      fill="url(#shellGrad)"
                      stroke="#1e2d3a"
                      strokeWidth="2.6"
                    />
                  </g>
                </g>
              </g>

              <g id="rig-head">
                <line
                  x1="100"
                  y1="36"
                  x2="100"
                  y2="18"
                  stroke="#1e2d3a"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <line
                  x1="100"
                  y1="36"
                  x2="100"
                  y2="18"
                  stroke="#6b8ea8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle
                  id="antenna-orb"
                  cx="100"
                  cy="12"
                  r="10"
                  fill="url(#cyanOrbGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="2.6"
                />
                <circle cx="96.5" cy="8.5" r="3" fill="#ffffff" opacity="0.7" />
                <rect
                  x="33"
                  y="57"
                  width="15"
                  height="36"
                  rx="7.5"
                  fill="url(#cyanTrimGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="2.6"
                />
                <line
                  x1="36"
                  y1="64"
                  x2="36"
                  y2="86"
                  stroke="#a5f3fc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <rect
                  x="152"
                  y="57"
                  width="15"
                  height="36"
                  rx="7.5"
                  fill="url(#cyanTrimGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="2.6"
                />
                <line
                  x1="164"
                  y1="64"
                  x2="164"
                  y2="86"
                  stroke="#a5f3fc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <rect
                  x="44"
                  y="34"
                  width="112"
                  height="72"
                  rx="32"
                  fill="url(#shellGrad)"
                  stroke="#1e2d3a"
                  strokeWidth="3.5"
                />
                <path
                  d="M66 42 Q100 37 134 42"
                  fill="none"
                  stroke="#9ec0d9"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <rect
                  x="54"
                  y="45"
                  width="92"
                  height="50"
                  rx="22"
                  fill="url(#visorGrad)"
                  stroke="#2c4152"
                  strokeWidth="2.2"
                />
                <path
                  d="M64 51 Q100 47 136 51"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.22"
                />
                <path
                  id="eye-left"
                  className="eye-arc"
                  d="M70 76 Q82 61 94 76"
                  fill="none"
                  stroke="var(--cyan)"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                />
                <path
                  id="eye-right"
                  className="eye-arc"
                  d="M106 76 Q118 61 130 76"
                  fill="none"
                  stroke="var(--cyan)"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                />

                <g id="santa-hat" transform="translate(127, 42) rotate(24)">
                  <path
                    d="M -31 -4 C -25 -32, 3 -45, 22 -28 C 33 -18, 37 -4, 38 6 C 32 7, 27 3, 25 -3 C 19 -14, 10 -12, 26 -2 Z"
                    fill="url(#santaRedGrad)"
                    stroke="#1e2d3a"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M -21 -12 C -15 -27, -2 -33, 12 -27"
                    fill="none"
                    stroke="#fca5a5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <circle
                    cx="38"
                    cy="10"
                    r="8.5"
                    fill="url(#santaFluffGrad)"
                    stroke="#1e2d3a"
                    strokeWidth="2.8"
                  />
                  <circle cx="35.5" cy="7.5" r="2.5" fill="#ffffff" />
                  <path
                    d="M -33 -6 C -37 -6, -39 1, -34 5 C -31 8, -23 8, -18 6 C -11 9, -2 9, 4 6 C 11 9, 20 8, 26 5 C 32 4, 34 -3, 29 -6 C 24 -9, 16 -8, 10 -6 C 3 -9, -6 -9, -13 -6 C -20 -9, -28 -8, -33 -6 Z"
                    fill="url(#santaFluffGrad)"
                    stroke="#1e2d3a"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </g>
              </g>

              {/* Brazos tapándose la cara / ojos (delante de la cabeza y visor) */}
              <g id="rig-arms-covering">
                {/* Brazo derecho subiendo y cubriendo el ojo izquierdo (perspectiva frontal) */}
                <g id="rig-arm-covering-right">
                  <path
                    d="M64 119 Q48 88 78 72"
                    stroke="#1e2d3a"
                    strokeWidth="21"
                    strokeLinecap="round"
                  />
                  <path
                    d="M64 119 Q48 88 78 72"
                    stroke="url(#bodyGrad)"
                    strokeWidth="15.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="64"
                    cy="119"
                    r="10.5"
                    fill="url(#shellGrad)"
                    stroke="#1e2d3a"
                    strokeWidth="2.8"
                  />
                  <path
                    d="M58 103 Q53 88 68 78"
                    stroke="#22d3ee"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <g transform="translate(80, 72) rotate(16)">
                    <line
                      x1="-7"
                      y1="-8"
                      x2="-4"
                      y2="2"
                      stroke="#1e2d3a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="-7"
                      y1="-8"
                      x2="-4"
                      y2="2"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="-10"
                      x2="1"
                      y2="3"
                      stroke="#1e2d3a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="-10"
                      x2="1"
                      y2="3"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="7"
                      y1="-8"
                      x2="5"
                      y2="2"
                      stroke="#1e2d3a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="7"
                      y1="-8"
                      x2="5"
                      y2="2"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="10.5"
                      fill="url(#shellGrad)"
                      stroke="#1e2d3a"
                      strokeWidth="2.8"
                    />
                    <circle cx="-1" cy="-1" r="4.5" fill="#22d3ee" opacity="0.4" />
                  </g>
                </g>

                {/* Brazo izquierdo subiendo y cubriendo el ojo derecho (perspectiva frontal) */}
                <g id="rig-arm-covering-left">
                  <path
                    d="M136 119 Q152 88 122 72"
                    stroke="#1e2d3a"
                    strokeWidth="21"
                    strokeLinecap="round"
                  />
                  <path
                    d="M136 119 Q152 88 122 72"
                    stroke="url(#bodyGrad)"
                    strokeWidth="15.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="136"
                    cy="119"
                    r="10.5"
                    fill="url(#shellGrad)"
                    stroke="#1e2d3a"
                    strokeWidth="2.8"
                  />
                  <path
                    d="M142 103 Q147 88 132 78"
                    stroke="#22d3ee"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <g transform="translate(120, 72) rotate(-16)">
                    <line
                      x1="-7"
                      y1="-8"
                      x2="-5"
                      y2="2"
                      stroke="#1e2d3a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="-7"
                      y1="-8"
                      x2="-5"
                      y2="2"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="-10"
                      x2="-1"
                      y2="3"
                      stroke="#1e2d3a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1="-10"
                      x2="-1"
                      y2="3"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="7"
                      y1="-8"
                      x2="4"
                      y2="2"
                      stroke="#1e2d3a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="7"
                      y1="-8"
                      x2="4"
                      y2="2"
                      stroke="url(#shellGrad)"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="10.5"
                      fill="url(#shellGrad)"
                      stroke="#1e2d3a"
                      strokeWidth="2.8"
                    />
                    <circle cx="1" cy="-1" r="4.5" fill="#22d3ee" opacity="0.4" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      )}
    </>
  );
}

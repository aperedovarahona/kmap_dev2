import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './fx.css';

// Efectos compartidos (Landing, Login...): cursor con estela, logo animado y letras que saltan.
let logoTyped = false;
const mixAcad = (k) => `rgb(0, ${Math.round(242 - (123 * k) / 6)}, 254)`; // degradado cian → azul como el logo

/* Letras que dan un saltito al pasar el cursor */
export const Hop = ({ text, kind, offset = 0 }) =>
  Array.from(text).map((c, i) => (
    <span className="hop" key={i}><span className={`lc ${kind}`} style={{ '--i': i + offset }}>{c}</span></span>
  ));

/* Línea con palabras que no se cortan a la mitad */
export const Line = ({ text, kind, base = 0 }) => {
  let n = base;
  return text.split(' ').map((w, wi) => {
    const el = (<React.Fragment key={wi}>{wi > 0 && ' '}<span className="w"><Hop text={w} kind={kind} offset={n} /></span></React.Fragment>);
    n += w.length + 1;
    return el;
  });
};

/* "BIT ACADEMY": se escribe letra por letra y cada letra salta al pasar el cursor */
const LogoText = ({ len }) => {
  const t = 'BIT ACADEMY';
  return t.split('').map((c, i) => {
    if (c === ' ') return <span className="logo-gap" key={i} />;
    const acad = i >= 4;
    return (
      <React.Fragment key={i}>
        <span className="hop"><span className={`lc ${acad ? '' : 'logo-white'} ${i >= len ? 'off' : ''}`} style={acad ? { color: mixAcad(i - 4) } : undefined}>{c}</span></span>
        {i === len - 1 && len < t.length && <i className="logo-caret" />}
      </React.Fragment>
    );
  });
};

/* Efectos del cursor: luz de fondo, rejilla que se enciende, estela y anillo */
export const CursorFX = () => {
  const root = useRef(), spot = useRef(), grid = useRef(), cv = useRef(), ring = useRef(), dot = useRef();
  useEffect(() => {
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const m = { x: -300, y: -300 }, r = { ...m }, s = { ...m };
    let raf, first = true; const pts = [];
    const c = cv.current, ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    const head = document.querySelector('.robot-head'), eyes = document.querySelector('.robot-eyes'), robot = document.querySelector('.robot-3d');

    const onMove = (e) => {
      m.x = e.clientX; m.y = e.clientY;
      if (first) { first = false; r.x = s.x = m.x; r.y = s.y = m.y; }
      root.current.classList.add('on');
      const big = !!(e.target.closest && e.target.closest('button,a,.hop,.robot-hop,.feature-card,.evidence-card,.landing-logo,.slide'));
      ring.current.classList.toggle('big', big);
    };
    const down = () => ring.current.classList.add('press');
    const up = () => ring.current.classList.remove('press');
    const leave = () => root.current.classList.remove('on');

    const tick = (t) => {
      r.x += (m.x - r.x) * 0.25; r.y += (m.y - r.y) * 0.25;
      s.x += (m.x - s.x) * 0.08; s.y += (m.y - s.y) * 0.08;
      spot.current.style.transform = `translate3d(${s.x}px,${s.y}px,0)`;
      grid.current.style.setProperty('--cx', `${s.x}px`); grid.current.style.setProperty('--cy', `${s.y}px`);
      ring.current.style.transform = `translate3d(${r.x}px,${r.y}px,0)`;
      dot.current.style.transform = `translate3d(${m.x}px,${m.y}px,0)`;
      if (robot && head && eyes) { // el robot grande te mira
        const q = robot.getBoundingClientRect();
        const dx = m.x - (q.left + q.width / 2), dy = m.y - (q.top + q.height * 0.3);
        eyes.style.transform = `translate(${clamp(dx / 70, -7, 7)}px,${clamp(dy / 90, -4, 4)}px)`;
        head.style.transform = `rotate(${clamp(dx / 110, -7, 7)}deg)`;
      }
      const last = pts[pts.length - 1];
      if (!last || last.x !== m.x || last.y !== m.y) pts.push({ x: m.x, y: m.y, t });
      while (pts.length && t - pts[0].t > 500) pts.shift();
      ctx.clearRect(0, 0, c.width, c.height); ctx.lineCap = 'round';
      for (let i = 1; i < pts.length; i++) {
        const k = 1 - (t - pts[i].t) / 500;
        ctx.strokeStyle = `hsla(${185 + (1 - k) * 90},100%,62%,${k * 0.85})`; ctx.lineWidth = k * 6;
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove); window.addEventListener('mousedown', down); window.addEventListener('mouseup', up);
    window.addEventListener('resize', resize); document.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up);
      window.removeEventListener('resize', resize); document.removeEventListener('mouseleave', leave);
    };
  }, []);

  return createPortal(
    <div className="fx" ref={root} aria-hidden="true">
      <div className="fx-grid" ref={grid} />
      <div className="fx-spot" ref={spot} />
      <canvas className="fx-trail" ref={cv} />
      <div className="fx-ring" ref={ring} />
      <div className="fx-dot" ref={dot} />
    </div>,
    document.body
  );
};


/* Logo animado: se escribe solo una vez, cada letra salta al pasar el cursor */
export const BitLogo = ({ onClick, title }) => {
  const [len, setLen] = useState(logoTyped ? 11 : 0);
  useEffect(() => {
    if (logoTyped) return;
    const t = setInterval(() => setLen((n) => { if (n >= 11) { clearInterval(t); logoTyped = true; return n; } return n + 1; }), 110);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bit-logo" onClick={onClick} aria-label="BIT ACADEMY" title={title}>
          <div className="logo-icon">
            <span className="logo-ring" />
            <svg viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="gradBitLogo" x1="20" y1="30" x2="80" y2="80"><stop stopColor="#00f2fe" /><stop offset="1" stopColor="#9d50ff" /></linearGradient></defs>
              <line x1="50" y1="16" x2="50" y2="28" stroke="#00f2fe" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="12" r="6" fill="#9d50ff" className="logo-antenna" />
              <rect x="14" y="28" width="72" height="58" rx="25" fill="url(#gradBitLogo)" />
              <rect x="25" y="38" width="50" height="36" rx="15" fill="#030d1e" />
              <g className="logo-eyes">
                <path d="M34 58 Q40 47 46 58" stroke="#00f2fe" strokeWidth="5" strokeLinecap="round" />
                <path d="M54 58 Q60 47 66 58" stroke="#00f2fe" strokeWidth="5" strokeLinecap="round" />
              </g>
            </svg>
          </div>
          <div className="logo-col">
            <span className="logo-text"><LogoText len={len} /></span>
            <span className="logo-tag">Aprendizaje adaptativo</span>
          </div>
        </div>
  );
};
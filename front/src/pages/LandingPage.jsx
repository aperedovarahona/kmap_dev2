import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import './LandingPage.css';
import '../theme.css';
import RobotMascotStatic from '../components/RobotMascotStatic';
import ThemeSelector from '../components/ThemeSelector.jsx';

// Vive mientras la pestaña esté abierta: al terminar NO vuelve a escribir (solo con F5)
let typingFinished = false;
const FULL_TEXT = 'EVALÚA EL APRENDIZAJE.';
const ERROR_AT = 15;      // posición de la "D" de APRENDIZAJE
const ERROR_CHAR = 'S';

const ROBOT_MSGS = ['¡Hola! Soy KMAP-BOT.', '¿Listo para aprender?', 'Detecto un vacío en Álgebra...', '¡Vamos a estudiar juntos!', 'Tu ruta óptima está lista.'];
const TOPICS = ['Álgebra', 'Física', 'Cálculo', 'Química', 'Programación', 'Estadística', 'Biología', 'Geometría', 'Lógica', 'Inglés'];

// Datos con fuente verificable (estudios de referencia sobre aprendizaje por dominio)
const EVIDENCE = [
  { big: '+1σ', label: 'Aprendizaje por dominio', text: 'Estudiantes que dominaban cada tema antes de avanzar superaron al 84% de un aula tradicional.', src: 'Bloom, 1984 · Educational Researcher' },
  { big: '61%', vs: '40%', label: 'Recuerdo a una semana', text: 'Practicar recuperando lo aprendido superó a releer el mismo texto una y otra vez.', src: 'Roediger & Karpicke, 2006 · Psychological Science' },
  { big: '0.37', label: 'Desviaciones estándar', text: 'Efecto promedio de la tutoría personalizada en estudios aleatorizados: unos 14 puntos percentiles.', src: 'Nickow, Oreopoulos & Quan, 2020' },
];

const SLIDES = [
  { icon: '🎯', title: 'Diagnóstico', text: 'Un test corto adaptativo mide qué dominas y qué no, tema por tema.' },
  { icon: '🕸️', title: 'Mapa de conocimiento', text: 'Cada tema se conecta con sus prerrequisitos. El grafo muestra el nodo raíz de tu dificultad.' },
  { icon: '🧭', title: 'Ruta personalizada', text: 'Estudias solo lo que falta, en el orden correcto, sin repetir lo que ya sabes.' },
  { icon: '🧠', title: 'Retención con práctica', text: 'Preguntas espaciadas y feedback inmediato para que lo aprendido dure.' },
];

const FEATURES = [
  { icon: '🕸️', title: 'Grafos de Conocimiento', text: 'Visualiza tu materia como un mapa y detecta qué prerrequisitos reforzar.' },
  { icon: '⚡', title: 'Evaluaciones Inteligentes', text: 'La dificultad se ajusta mientras respondes, con feedback instantáneo sobre tus errores.' },
  { icon: '🤖', title: 'KMap Tutor IA (Gemini)', text: 'Un asistente 24/7 que guía con preguntas socráticas para que razones, no solo memorices.' },
  { icon: '🔥', title: 'Panel del Docente', text: 'Mapas de calor para ver qué nodo exacto está frenando a tu clase.' },
];

let logoTyped = false;
const mixAcad = (k = 0) => (k % 2 === 0 ? 'var(--cyan)' : 'var(--blue)'); // Dinámico con el tono activo

/* Letras que dan un saltito al pasar el cursor */
const Hop = ({ text, kind, offset = 0 }) =>
  text.split('').map((c, i) => (
    <span className="hop" key={i}><span className={`lc ${kind}`} style={{ '--i': i + offset }}>{c}</span></span>
  ));

/* Línea con palabras que no se cortan a la mitad */
const Line = ({ text, kind, base = 0 }) => {
  let n = base;
  return text.split(' ').map((w, wi) => {
    const el = (<React.Fragment key={wi}>{wi > 0 && ' '}<span className="w"><Hop text={w} kind={kind} offset={n} /></span></React.Fragment>);
    n += w.length + 1;
    return el;
  });
};

/* Typewriter: cada palabra reserva su ancho final, así el texto nunca salta de línea */
const TypeLine = ({ text, typedLen, showErr, errAt, done }) => {
  let start = 0;
  return text.split(' ').map((word, wi) => {
    const s = start; start += word.length + 1;
    const n = Math.max(0, Math.min(word.length, typedLen - s));
    const err = showErr && errAt >= s && errAt < s + word.length && typedLen === errAt;
    const cursor = !done && typedLen >= s && typedLen <= s + word.length;
    return (
      <React.Fragment key={wi}>
        {wi > 0 && ' '}
        <span className="w">
          <span className="w-ghost">{word}</span>
          <span className="w-live">
            <Hop text={word.slice(0, n)} kind="l-wave2" offset={s} />
            {err && <span className="tw-error">{ERROR_CHAR}</span>}
            {cursor && <span className="typewriter-cursor">|</span>}
          </span>
        </span>
      </React.Fragment>
    );
  });
};

/* "KMapGraph": se escribe letra por letra y cada letra salta al pasar el cursor */
const LogoText = ({ len }) => {
  const t = 'KMapGraph';
  return t.split('').map((c, i) => {
    if (c === ' ') return <span className="logo-gap" key={i} />;
    const isGraph = i >= 4;
    return (
      <React.Fragment key={i}>
        <span className="hop"><span className={`lc ${isGraph ? '' : 'logo-white'} ${i >= len ? 'off' : ''}`} style={isGraph ? { color: mixAcad(i - 4) } : undefined}>{c}</span></span>
        {i === len - 1 && len < t.length && <i className="logo-caret" />}
      </React.Fragment>
    );
  });
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rootRef = useRef(null);
  const [jump, setJump] = useState(false);
  const [logoLen, setLogoLen] = useState(logoTyped ? 9 : 0);
  useEffect(() => {
    if (logoTyped) return;
    const t = setInterval(() => setLogoLen((n) => { if (n >= 9) { clearInterval(t); logoTyped = true; return n; } return n + 1; }), 110);
    return () => clearInterval(t);
  }, []);

  /* ---------- Typewriter ---------- */
  const [typed, setTyped] = useState(typingFinished ? FULL_TEXT : '');
  const [showError, setShowError] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(typingFinished);

  useEffect(() => {
    if (typingFinished) return;
    let cancelled = false, timer;
    const wait = (ms) => new Promise((res) => { timer = setTimeout(res, ms); });
    setTyped(''); setShowError(false);
    (async () => {
      await wait(900); // deja entrar el resto del hero primero
      for (let i = 1; i <= FULL_TEXT.length; i++) {
        if (i - 1 === ERROR_AT) {
          await wait(250); if (cancelled) return;
          setShowError(true);
          await wait(750); if (cancelled) return;
          setShowError(false);
          await wait(250); if (cancelled) return;
        }
        setTyped(FULL_TEXT.slice(0, i));
        await wait(75); if (cancelled) return;
      }
      typingFinished = true;
      setIsTypingDone(true);
    })();
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  /* ---------- Mensajes del robot ---------- */
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % ROBOT_MSGS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* ---------- Slider "Cómo funciona" ---------- */
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearTimeout(t);
  }, [slide, paused]);

  /* ---------- Aparición al hacer scroll ---------- */
  useEffect(() => {
    const els = rootRef.current.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ---------- Luz que sigue al mouse en las tarjetas ---------- */
  const onCardMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div className="landing-container" ref={rootRef}>
      <div className="bg-grid" />
      <div className="bg-watermark">KMAP</div>
      <div className="bg-orb orb-cyan" /><div className="bg-orb orb-purple" /><div className="bg-orb orb-blue" />

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="landing-logo" onClick={() => navigate('/')} aria-label="KMapGraph">
          <div className="logo-icon">
            <span className="logo-ring" />
            <svg viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="gradLogo" x1="20" y1="30" x2="80" y2="80"><stop offset="0%" style={{ stopColor: 'var(--cyan)' }} /><stop offset="100%" style={{ stopColor: 'var(--blue)' }} /></linearGradient></defs>
              <line x1="50" y1="16" x2="50" y2="28" style={{ stroke: 'var(--cyan)' }} strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="12" r="6" style={{ fill: 'var(--cyan)' }} className="logo-antenna" />
              <rect x="14" y="28" width="72" height="58" rx="25" fill="url(#gradLogo)" />
              <rect x="25" y="38" width="50" height="36" rx="15" fill="#030d1e" />
              <g className="logo-eyes">
                <path d="M34 58 Q40 47 46 58" style={{ stroke: 'var(--cyan)' }} strokeWidth="5" strokeLinecap="round" />
                <path d="M54 58 Q60 47 66 58" style={{ stroke: 'var(--cyan)' }} strokeWidth="5" strokeLinecap="round" />
              </g>
            </svg>
          </div>
          <div className="logo-col">
            <span className="logo-text"><LogoText len={logoLen} /></span>
            <span className="logo-tag">Aprendizaje adaptativo</span>
          </div>
        </div>

        <div className="landing-nav-buttons flex items-center gap-3">
          <ThemeSelector />
          {user ? (
            <button className="btn-nav-register" onClick={() => navigate('/panel')}>
              Ir a mi Panel ❯
            </button>
          ) : (
            <>
              <button className="btn-nav-login" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </button>
              <button className="btn-nav-register" onClick={() => navigate('/login')}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <header className="landing-hero">
        <div className="hero-symbols" aria-hidden="true">
          {[['10%', '4%', '∑'], ['62%', '2%', '√x'], ['14%', '46%', 'π'], ['80%', '42%', '∫'], ['8%', '90%', '{ }'], ['72%', '92%', '01'], ['40%', '50%', 'Δ']].map(([t, l, s], i) => (
            <span key={i} style={{ top: t, left: l, animationDelay: `${-i * 2}s` }}>{s}</span>
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge enter" style={{ '--d': '0s' }}><span className="pulse-dot" />Nueva era del aprendizaje adaptativo</div>

          <h1 className="hero-title" aria-label="No estudies más horas. Evalúa el aprendizaje.">
            <span className="title-solid enter" style={{ '--d': '0.15s' }} aria-hidden="true">
              <Line text="NO ESTUDIES MÁS HORAS." kind="l-wave2" base={0} />
            </span>
            <span className="hero-typewriter-container enter" style={{ '--d': '0.3s' }} aria-hidden="true">
              <TypeLine text={FULL_TEXT} typedLen={typed.length} showErr={showError} errAt={ERROR_AT} done={isTypingDone} />
            </span>
          </h1>

          <p className="hero-subtitle enter" style={{ '--d': '0.45s' }}>
            KMapGraph mapea tus conocimientos como un grafo: encuentra el tema base que te falta,
            te propone la ruta más corta para reforzarlo y te ayuda a retener lo aprendido con práctica e IA.
          </p>

          <div className="hero-cta enter" style={{ '--d': '0.6s' }}>
            <button
              className="btn-primary"
              onClick={() => navigate(user ? '/panel' : '/login')}
            >
              {user ? 'Ir a mi Panel ❯' : 'Empieza gratis ahora'}
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' })}>Ver cómo funciona</button>
          </div>

          <div className="hero-stats enter" style={{ '--d': '0.75s' }}>
            {EVIDENCE.map((e, i) => (
              <div className="stat-item" key={i}>
                <div className={`stat-value text-gradient-${i + 1}`}>{e.big}</div>
                <div className="stat-label">{e.label}</div>
              </div>
            ))}
          </div>
          <p className="stat-footnote enter" style={{ '--d': '0.85s' }}>
            Cifras de investigación sobre dominio, práctica de recuperación y tutoría (ver fuentes más abajo). No son resultados propios de la plataforma.
          </p>
        </div>

        <div className="hero-robot-static enter" style={{ '--d': '0.3s' }}>
          <RobotMascotStatic size="xl" />
        </div>

      </header>

      {/* CINTA DE MATERIAS */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...TOPICS, ...TOPICS].map((t, i) => <span key={i}>{t}<b>✦</b></span>)}
        </div>
      </div>

      {/* PROBLEMA + GRAFO ANIMADO */}
      <section className="landing-value-prop">
        <div className="value-container">
          <div className="value-text reveal">
            <h2 className="section-title-gradient">EL PROBLEMA NO ERES TÚ. ES EL MÉTODO.</h2>
            <p>
              En una clase estándar todos avanzan al mismo ritmo, aunque les falte una base. Bloom lo estudió en 1984: quienes
              dominaban cada tema antes de pasar al siguiente rindieron mucho mejor. KMapGraph usa <strong>grafos de conocimiento</strong> para
              encontrar el tema base de tu dificultad y reconstruir desde ahí.
            </p>
            <ul className="value-list">
              <li><span className="check-icon">✓</span> Detecta vacíos que ni sabías que tenías.</li>
              <li><span className="check-icon">✓</span> Rutas personalizadas, no un libro de texto genérico.</li>
              <li><span className="check-icon">✓</span> Ahorra tiempo enfocándote solo en lo que necesitas.</li>
            </ul>
          </div>
          <div className="value-visual reveal" style={{ '--d': '0.15s' }}>
            <div className="graph-demo">
              <svg viewBox="0 0 360 330" role="img" aria-label="Grafo con un vacío detectado y la ruta más corta para resolverlo">
                <defs>
                  <linearGradient id="gPath" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" style={{ stopColor: 'var(--cyan)' }} /><stop offset="100%" style={{ stopColor: 'var(--blue)' }} /></linearGradient>
                </defs>
                <g className="g-edges" stroke="#1e3a5f" strokeWidth="2" fill="none">
                  <path d="M180 55 L85 135" /><path d="M180 55 L275 135" /><path d="M85 135 L85 235" /><path d="M275 135 L180 235" /><path d="M85 235 L180 290" /><path d="M180 235 L180 290" />
                </g>
                <path className="g-route" d="M180 55 L85 135 L85 235 L180 290" stroke="url(#gPath)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {[[180, 55, 'Base', 'ok'], [85, 135, 'Intermedio', 'ok'], [275, 135, 'Vacío', 'err'], [85, 235, 'Práctica', 'ok'], [180, 235, 'Aplicación', ''], [180, 290, 'Avanzado', 'goal']].map(([x, y, t, c]) => (
                  <g key={t} className={`g-node ${c}`} transform={`translate(${x} ${y})`}>
                    {c === 'err' && <circle r="30" className="g-pulse" />}
                    <circle r="22" />
                    <text y="40" textAnchor="middle">{t}</text>
                  </g>
                ))}
              </svg>
              <div className="graph-legend"><span className="lg-err" /> Vacío detectado <span className="lg-route" /> Ruta más corta</div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDER */}
      <section className="landing-how" id="como-funciona" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <h2 className="section-title-landing reveal">ASÍ FUNCIONA</h2>
        <p className="section-subtitle-landing reveal">Cuatro pasos, de “no sé qué me falta” a “lo domino”.</p>
        <div className="slider reveal">
          <div className="slider-viewport">
            <div className="slider-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {SLIDES.map((s, i) => (
                <article className={`slide ${i === slide ? 'active' : ''}`} key={i}>
                  <div className="slide-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="slide-ghost" aria-hidden="true">{i + 1}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="slider-controls">
            <button aria-label="Anterior" onClick={() => setSlide((slide - 1 + SLIDES.length) % SLIDES.length)}>‹</button>
            <div className="slider-dots">
              {SLIDES.map((s, i) => (
                <button key={i} className={i === slide ? 'on' : ''} aria-label={s.title} onClick={() => setSlide(i)}>
                  <span style={i === slide && !paused ? { animation: 'fill 5s linear forwards' } : i < slide ? { width: '100%' } : undefined} />
                </button>
              ))}
            </div>
            <button aria-label="Siguiente" onClick={() => setSlide((slide + 1) % SLIDES.length)}>›</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features">
        <h2 className="section-title-landing reveal">UN ARSENAL COMPLETO PARA TU ÉXITO</h2>
        <p className="section-subtitle-landing reveal">Herramientas para estudiantes que quieren resultados, no solo contenido.</p>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card reveal" key={f.title} style={{ '--d': `${i * 0.1}s` }} onMouseMove={onCardMove}>
              <div className="card-spot" />
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVIDENCIA (reemplaza testimonios inventados) */}
      <section className="landing-evidence">
        <h2 className="section-title-landing reveal">LO QUE DICE LA INVESTIGACIÓN</h2>
        <p className="section-subtitle-landing reveal">Los métodos en los que se inspira KMapGraph, con su fuente.</p>
        <div className="evidence-grid">
          {EVIDENCE.map((e, i) => (
            <div className="evidence-card reveal" key={i} style={{ '--d': `${i * 0.12}s` }} onMouseMove={onCardMove}>
              <div className="card-spot" />
              <div className={`ev-big text-gradient-${i + 1}`}>{e.big}{e.vs && <small> vs {e.vs}</small>}</div>
              <h3>{e.label}</h3>
              <p>{e.text}</p>
              <cite>{e.src}</cite>
            </div>
          ))}
        </div>
        <p className="evidence-note reveal">
          Nota: Bloom (1984) reportó hasta 2σ combinando tutoría uno a uno y aprendizaje por dominio, pero ese resultado no se ha replicado
          con ese tamaño; los metaanálisis posteriores muestran efectos menores, aunque positivos.
        </p>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-box reveal">
          <h2 className="section-title-gradient">TU TIEMPO ES VALIOSO. NO LO DESPERDICIES.</h2>
          <p>Empieza por un diagnóstico y descubre qué tema te está frenando.</p>
          <button
            className="btn-primary"
            onClick={() => navigate(user ? '/panel' : '/login')}
          >
            {user ? 'Ir a mi Panel ❯' : 'Crear mi cuenta gratis'}
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 KMapGraph — Ingeniería del aprendizaje para mentes brillantes.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
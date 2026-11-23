import { useState, useEffect, useRef } from 'react';

const THEMES = [
  { id: 'blue', name: 'Azul Neón', color: '#00f2fe', glow: 'rgba(0, 242, 254, 0.6)' },
  { id: 'green', name: 'Verde Esmeralda', color: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' },
  { id: 'orange', name: 'Naranja Fuego', color: '#ff8800', glow: 'rgba(255, 136, 0, 0.6)' },
  { id: 'purple', name: 'Morado Cyber', color: '#b026ff', glow: 'rgba(176, 38, 255, 0.6)' },
  { id: 'yellow', name: 'Amarillo Solar', color: '#ffe600', glow: 'rgba(255, 230, 0, 0.6)' },
  { id: 'red', name: 'Rojo Láser', color: '#ff2a5f', glow: 'rgba(255, 42, 95, 0.6)' },
];

export default function ThemeSelector() {
  const [current, setCurrent] = useState('blue');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('kmap_theme') || 'blue';
    setCurrent(saved);
    document.documentElement.setAttribute('data-theme', saved);
    if (document.body) document.body.setAttribute('data-theme', saved);

    const onThemeChange = (e) => {
      if (e.detail && e.detail !== current) {
        setCurrent(e.detail);
      }
    };
    window.addEventListener('kmap-theme-change', onThemeChange);

    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      window.removeEventListener('kmap-theme-change', onThemeChange);
    };
  }, [current]);

  const selectTheme = (themeId) => {
    setCurrent(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    if (document.body) document.body.setAttribute('data-theme', themeId);
    localStorage.setItem('kmap_theme', themeId);
    window.dispatchEvent(new CustomEvent('kmap-theme-change', { detail: themeId }));
    setOpen(false);
  };

  const activeTheme = THEMES.find((t) => t.id === current) || THEMES[0];

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Botón activador */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer border"
        style={{
          background: 'rgba(6, 18, 38, 0.75)',
          borderColor: activeTheme.color,
          color: activeTheme.color,
          boxShadow: `0 0 14px ${activeTheme.glow}`,
        }}
        title="Cambiar tono neón de la plataforma"
      >
        <span
          className="w-3 h-3 rounded-full animate-pulse"
          style={{
            background: activeTheme.color,
            boxShadow: `0 0 8px ${activeTheme.color}`,
          }}
        />
        <span>Tono {activeTheme.name.split(' ')[0]}</span>
        <span className="text-[10px] opacity-70">▼</span>
      </button>

      {/* Menú flotante de tonos */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 p-2 rounded-2xl border shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: 'rgba(3, 10, 24, 0.96)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 210, 255, 0.15)',
          }}
        >
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#8da6c9] px-2.5 py-1">
            Paleta Neón KMAP
          </div>

          {THEMES.map((t) => {
            const isSelected = t.id === current;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTheme(t.id)}
                className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border text-left"
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  borderColor: isSelected ? t.color : 'transparent',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{
                      background: t.color,
                      boxShadow: isSelected ? `0 0 10px ${t.color}` : 'none',
                    }}
                  />
                  <span>{t.name}</span>
                </div>
                {isSelected && (
                  <span style={{ color: t.color, fontWeight: 'bold' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

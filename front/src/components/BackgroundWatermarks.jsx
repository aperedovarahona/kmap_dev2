/**
 * Marcas de agua decorativas de BIT ACADEMY.
 * Los estilos (.watermarks, .wm, .wm-frame, .wm-orbit) están en src/index.css.
 * No necesita importar ningún CSS.
 */
export default function BackgroundWatermarks() {
  return (
    <div className="watermarks" aria-hidden="true">
      {/* Marcos rectangulares (líneas de blueprint) */}
      <span className="wm-frame wm-frame-1" />
      <span className="wm-frame wm-frame-2" />

      {/* Círculos orbitales */}
      <span className="wm-orbit wm-orbit-1" />
      <span className="wm-orbit wm-orbit-2" />

      {/* Letras gigantes */}
      <span className="wm wm-bit">BIT</span>

      {/* Símbolos */}
      <span className="wm wm-sigma">Σ</span>
      <span className="wm wm-pi">π</span>
      <span className="wm wm-braces">{'{ }'}</span>
      <span className="wm wm-sqrt">√x</span>
      <span className="wm wm-delta">A</span>
      <span className="wm wm-binary">01</span>
    </div>
  );
}
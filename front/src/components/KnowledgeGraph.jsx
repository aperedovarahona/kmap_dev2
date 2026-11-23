import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './KnowledgeGraph.css';

export const masteryColor = (v) =>
  v == null ? '#1e3a5f' : v < 51 ? '#7f1d1d' : v < 71 ? '#78350f' : '#0c4a6e';

export function Legend({ path }) {
  const items = [
    ['#00f2fe', 'Dominado / Seleccionado'],
    ['#c084fc', 'En curso / Prerrequisito'],
    ['#fbbf24', 'En progreso (51–70%)'],
    ['#fb7185', 'Reforzar (< 51%)'],
  ];
  if (path) items.push(['#38bdf8', 'Ruta sugerida']);
  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs text-cyan-100 mb-3">
      {items.map(([c, l]) => (
        <span
          key={l}
          className="flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full bg-[#05132b]/85 border border-sky-400/25 hover:border-cyan-300/70 hover:scale-105 transition-all duration-200 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        >
          <i
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: c, boxShadow: `0 0 8px ${c}` }}
          />
          <span>{l}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Calcula posiciones jerárquicas garantizando cero solapamiento horizontal o vertical.
 */
function resolveLayoutPositions(topics, edges) {
  if (!topics || topics.length === 0) return {};

  const inDegree = {};
  const adj = {};
  topics.forEach((t) => {
    inDegree[t.id] = 0;
    adj[t.id] = [];
  });

  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (inDegree[e.target] !== undefined) inDegree[e.target]++;
  });

  const levels = {};
  const queue = topics.filter((t) => inDegree[t.id] === 0).map((t) => t.id);
  if (queue.length === 0 && topics.length > 0) queue.push(topics[0].id);
  queue.forEach((id) => (levels[id] = 0));

  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    const currLvl = levels[u] || 0;
    (adj[u] || []).forEach((v) => {
      if (levels[v] === undefined || levels[v] < currLvl + 1) {
        levels[v] = currLvl + 1;
        queue.push(v);
      }
    });
  }

  // Agrupar por nivel
  const levelGroups = {};
  topics.forEach((t) => {
    const lvl = levels[t.id] !== undefined ? levels[t.id] : 0;
    if (!levelGroups[lvl]) levelGroups[lvl] = [];
    levelGroups[lvl].push(t);
  });

  const COL_SPACING = 260; // Espaciado horizontal generoso entre niveles
  const START_X = 120;
  const CENTER_Y = 220;
  const ROW_SPACING = 130; // Espaciado vertical entre nodos hermanos

  const positions = {};
  Object.keys(levelGroups).forEach((lvlStr) => {
    const lvl = parseInt(lvlStr, 10);
    const group = levelGroups[lvl];
    const x = START_X + lvl * COL_SPACING;
    const totalH = (group.length - 1) * ROW_SPACING;
    const startY = CENTER_Y - totalH / 2;

    group.forEach((t, idx) => {
      positions[t.id] = {
        x,
        y: startY + idx * ROW_SPACING,
      };
    });
  });

  return positions;
}

export default function KnowledgeGraph({
  topics = [],
  edges = [],
  values = {},
  path = [],
  rootId = null,
  selected = null,
  onSelect,
}) {
  const ref = useRef();
  const cyRef = useRef(null);

  useEffect(() => {
    const positions = resolveLayoutPositions(topics, edges);
    const pairs = new Set(path.slice(1).map((id, i) => `${path[i]}-${id}`));

    const cy = cytoscape({
      container: ref.current,
      elements: [
        ...topics.map((t) => {
          const val = values[t.id];
          const isSel = t.id === selected;

          // Colores temáticos neón según nivel de dominio
          let bgColor = '#0a1d3b';
          let borderColor = '#00d2ff';
          let shadowColor = '#00d2ff';

          if (isSel) {
            bgColor = '#09366d';
            borderColor = '#00f2fe';
            shadowColor = '#00f2fe';
          } else if (val != null) {
            if (val >= 71) {
              bgColor = '#08254a';
              borderColor = '#00f2fe';
              shadowColor = '#00d2ff';
            } else if (val >= 51) {
              bgColor = '#2a1a04';
              borderColor = '#fbbf24';
              shadowColor = '#fbbf24';
            } else {
              bgColor = '#380c1d';
              borderColor = '#fb7185';
              shadowColor = '#fb7185';
            }
          } else {
            bgColor = '#1e1038';
            borderColor = '#c084fc';
            shadowColor = '#c084fc';
          }

          const ico = t.icon || '📘';
          const scoreText = val == null ? '' : ` (${val}%)`;
          const pos = positions[t.id] || { x: t.x || 100, y: t.y || 100 };

          return {
            data: {
              id: String(t.id),
              label: `${ico}  ${t.name}${scoreText}`,
              bgColor,
              borderColor,
              shadowColor,
            },
            position: pos,
            classes: [t.id === rootId && 'root', isSel && 'sel'].filter(Boolean).join(' '),
          };
        }),
        ...edges.map((e) => ({
          data: {
            id: `${e.source}-${e.target}`,
            source: String(e.source),
            target: String(e.target),
          },
          classes: pairs.has(`${e.source}-${e.target}`) ? 'path' : '',
        })),
      ],
      layout: { name: 'preset', padding: 40 },
      autoungrabify: false, // Permite arrastrar nodos fluidamente
      boxSelectionEnabled: false,
      wheelSensitivity: 0.25,
      style: [
        {
          selector: 'node',
          style: {
            shape: 'round-rectangle',
            'corner-radius': 14,
            width: 165,
            height: 48,
            'background-color': 'data(bgColor)',
            'background-opacity': 0.95,
            label: 'data(label)',
            color: '#f8fafc',
            'font-family': "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
            'font-size': 12.5,
            'font-weight': 700,
            'text-wrap': 'wrap',
            'text-max-width': 150,
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': 2.2,
            'border-color': 'data(borderColor)',
            'shadow-blur': 14,
            'shadow-color': 'data(shadowColor)',
            'shadow-opacity': 0.55,
            'shadow-offset-x': 0,
            'shadow-offset-y': 2,
            'transition-property': 'width, height, border-width, border-color, background-color, shadow-blur, shadow-opacity',
            'transition-duration': '0.2s',
          },
        },
        {
          selector: 'node.hovered',
          style: {
            width: 178,
            height: 54,
            'font-size': 13,
            'border-width': 3.5,
            'border-color': '#00f2fe',
            'background-color': '#0d4285',
            'shadow-blur': 22,
            'shadow-opacity': 0.85,
            'shadow-color': '#00f2fe',
            'z-index': 99,
          },
        },
        {
          selector: 'node.sel',
          style: {
            'border-color': '#00f2fe',
            'border-width': 3.5,
            'background-color': '#093c7d',
            'shadow-blur': 24,
            'shadow-opacity': 0.9,
            'shadow-color': '#00f2fe',
            'z-index': 90,
          },
        },
        {
          selector: 'node.root',
          style: {
            'border-color': '#00d2ff',
            'border-width': 3.5,
          },
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            width: 2.6,
            'line-color': '#00d2ff',
            'target-arrow-color': '#00d2ff',
            'target-arrow-shape': 'triangle-backcurve',
            'arrow-scale': 1.25,
            opacity: 0.82,
            'shadow-blur': 8,
            'shadow-color': '#00d2ff',
            'shadow-opacity': 0.45,
            'transition-property': 'width, line-color, opacity, shadow-blur, shadow-opacity',
            'transition-duration': '0.2s',
          },
        },
        {
          selector: 'edge.edge-hover',
          style: {
            width: 4.2,
            'line-color': '#00f2fe',
            'target-arrow-color': '#00f2fe',
            opacity: 1,
            'shadow-blur': 16,
            'shadow-color': '#00f2fe',
            'shadow-opacity': 0.9,
            'z-index': 95,
          },
        },
        {
          selector: 'edge.path',
          style: {
            width: 3.8,
            'line-color': '#38bdf8',
            'target-arrow-color': '#38bdf8',
            'line-style': 'dashed',
            opacity: 1,
            'shadow-blur': 14,
            'shadow-color': '#38bdf8',
            'shadow-opacity': 0.8,
          },
        },
      ],
    });

    cyRef.current = cy;

    // Animación de entrada suave
    cy.animate({
      fit: { padding: 42 },
      duration: 500,
      easing: 'ease-out-cubic',
    });

    cy.on('tap', 'node', (e) => onSelect?.(e.target.id()));

    // Efectos interactivos al pasar el cursor
    cy.on('mouseover', 'node', (e) => {
      if (ref.current) ref.current.style.cursor = 'grab';
      const node = e.target;
      node.addClass('hovered');
      node.connectedEdges().addClass('edge-hover');
    });

    cy.on('mouseout', 'node', (e) => {
      if (ref.current) ref.current.style.cursor = 'default';
      const node = e.target;
      node.removeClass('hovered');
      node.connectedEdges().removeClass('edge-hover');
    });

    cy.on('grab', 'node', () => {
      if (ref.current) ref.current.style.cursor = 'grabbing';
    });

    cy.on('free', 'node', () => {
      if (ref.current) ref.current.style.cursor = 'grab';
    });

    const onResize = () => {
      cy.resize();
      cy.fit(undefined, 35);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cy.destroy();
    };
  }, [topics, edges, values, path, rootId, selected]);

  const zoom = (factor) => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({
      level: cy.zoom() * factor,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    });
  };

  const fit = () => {
    cyRef.current?.animate({
      fit: { padding: 35 },
      duration: 350,
      easing: 'ease-out-cubic',
    });
  };

  return (
    <div className="relative w-full group graph-container-wrap">
      {/* Canvas del Grafo con rejilla cibernética */}
      <div
        ref={ref}
        className="graph-canvas-viewport w-full h-[360px] sm:h-[430px] lg:h-[460px] rounded-2xl transition-all duration-300"
      />

      {/* Controles de Navegación del Grafo */}
      <div className="graph-controls-capsule absolute bottom-3.5 right-3.5 flex items-center gap-1.5 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => zoom(1.2)}
          className="graph-ctrl-btn"
          title="Acercar (+)"
        >
          ＋
        </button>
        <button
          type="button"
          onClick={() => zoom(0.8)}
          className="graph-ctrl-btn"
          title="Alejar (-)"
        >
          －
        </button>
        <button
          type="button"
          onClick={fit}
          className="graph-ctrl-btn-text"
          title="Centrar Grafo"
        >
          Centrar
        </button>
      </div>
    </div>
  );
}

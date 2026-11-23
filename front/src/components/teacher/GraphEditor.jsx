import { useCallback, useEffect } from 'react';
import { addEdge, Background, Controls, Handle, MarkerType, Position, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { uid, update, useDb } from '../../lib/db.js';
import { edgesOf, isDag, topicsOf } from '../../lib/logic.js';
import { ask, askText, fail, ok } from '../../alerts.js';

function TopicNode({ data, selected }) {
  return (
    <div
      className="relative px-4 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all duration-300 select-none cursor-grab active:cursor-grabbing border"
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.35), rgba(6, 18, 38, 0.95))'
          : 'linear-gradient(135deg, rgba(10, 29, 60, 0.95), rgba(4, 12, 28, 0.98))',
        borderColor: selected ? 'var(--cyan)' : 'rgba(var(--primary-rgb), 0.45)',
        boxShadow: selected
          ? '0 0 22px rgba(var(--primary-rgb), 0.6), 0 8px 24px rgba(0, 0, 0, 0.7)'
          : '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 10px rgba(var(--primary-rgb), 0.2)',
        minWidth: '160px',
      }}
    >
      {/* Handle de entrada (Target / Prerrequisito) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '10px',
          height: '10px',
          background: 'var(--cyan)',
          border: '2px solid #030d1e',
          boxShadow: '0 0 8px var(--cyan)',
          left: '-6px',
        }}
      />

      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 border"
        style={{
          background: 'rgba(var(--primary-rgb), 0.2)',
          borderColor: 'rgba(var(--primary-rgb), 0.4)',
        }}
      >
        📘
      </div>

      <div className="flex-1 font-bold text-xs text-white tracking-wide truncate">
        {data.label}
      </div>

      {/* Handle de salida (Source / Desbloquea) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '10px',
          height: '10px',
          background: 'var(--secondary, #a855f7)',
          border: '2px solid #030d1e',
          boxShadow: '0 0 8px var(--secondary, #a855f7)',
          right: '-6px',
        }}
      />
    </div>
  );
}
const nodeTypes = { topic: TopicNode };
const arrow = { type: MarkerType.ArrowClosed, color: 'var(--cyan)' };
const edgeStyle = { stroke: 'var(--cyan)', strokeWidth: 2.2, filter: 'drop-shadow(0 0 4px var(--cyan))' };

// Auto-organizador jerárquico para el editor
function autoLayout(topicList, edgeList) {
  const inDegree = {};
  const adj = {};
  topicList.forEach((t) => {
    inDegree[t.id] = 0;
    adj[t.id] = [];
  });
  edgeList.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (inDegree[e.target] !== undefined) inDegree[e.target]++;
  });

  const levels = {};
  const q = topicList.filter((t) => inDegree[t.id] === 0).map((t) => t.id);
  if (q.length === 0 && topicList.length > 0) q.push(topicList[0].id);
  q.forEach((id) => (levels[id] = 0));

  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    const curLvl = levels[u] || 0;
    (adj[u] || []).forEach((v) => {
      if (levels[v] === undefined || levels[v] < curLvl + 1) {
        levels[v] = curLvl + 1;
        q.push(v);
      }
    });
  }

  const groups = {};
  topicList.forEach((t) => {
    const lvl = levels[t.id] ?? 0;
    if (!groups[lvl]) groups[lvl] = [];
    groups[lvl].push(t);
  });

  const result = [];
  const COL_W = 240;
  const ROW_H = 95;
  const START_X = 60;
  const START_Y = 180;

  Object.keys(groups).forEach((lStr) => {
    const lvl = parseInt(lStr, 10);
    const grp = groups[lvl];
    const totalH = (grp.length - 1) * ROW_H;
    const startY = START_Y - totalH / 2;

    grp.forEach((t, idx) => {
      result.push({
        id: t.id,
        type: 'topic',
        position: {
          x: START_X + lvl * COL_W,
          y: Math.max(40, startY + idx * ROW_H),
        },
        data: { label: t.name || t.label },
      });
    });
  });
  return result;
}

// La flecha va del prerrequisito (origen) al tema que depende de él (destino)
export default function GraphEditor({ subjectId }) {
  const db = useDb();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const rawTopics = topicsOf(db, subjectId);
    const rawEdges = edgesOf(db, subjectId);

    // Si los nodos no tienen posiciones válidas o se solapan, auto-organizar
    const hasPositions = rawTopics.length > 0 && rawTopics.some((t) => t.x && t.y);
    if (!hasPositions && rawTopics.length > 0) {
      setNodes(autoLayout(rawTopics, rawEdges));
    } else {
      setNodes(rawTopics.map((t) => ({ id: t.id, type: 'topic', position: { x: t.x || 100, y: t.y || 100 }, data: { label: t.name } })));
    }

    setEdges(rawEdges.map((e) => ({
      id: `${e.source || e.from}-${e.target || e.to}`,
      source: e.source || e.from,
      target: e.target || e.to,
      markerEnd: arrow,
      style: edgeStyle,
    })));
  }, [subjectId]);

  const onConnect = useCallback((c) => setEdges((es) => addEdge({ ...c, markerEnd: arrow, style: edgeStyle }, es)), []);

  const addTopic = async () => {
    const label = await askText('Nombre del nuevo tema');
    if (label) setNodes((ns) => [...ns, { id: 't-' + uid(), type: 'topic', position: { x: 80 + Math.random() * 240, y: 60 + Math.random() * 240 }, data: { label } }]);
  };

  const reorderNodes = () => {
    const currentTopics = nodes.map((n) => ({ id: n.id, name: n.data.label }));
    setNodes(autoLayout(currentTopics, edges));
    ok('Grafo organizado', 'Los temas han sido distribuidos jerárquicamente.');
  };

  const rename = async (_, n) => {
    const label = await askText('Renombrar tema', n.data.label);
    if (label) setNodes((ns) => ns.map((x) => (x.id === n.id ? { ...x, data: { label } } : x)));
  };

  const save = async () => {
    if (!isDag(nodes.map((n) => n.id), edges.map((e) => [e.source, e.target]))) return fail('El grafo tiene ciclos: un tema no puede depender de sí mismo, directa o indirectamente.');
    if (!(await ask('Guardar grafo', 'Si eliminaste temas, también se borrarán sus quizzes y notas.', 'Guardar'))) return;
    update((d) => {
      const keep = new Set(nodes.map((n) => n.id));
      const removed = d.topics.filter((t) => t.subjectId === subjectId && !keep.has(t.id)).map((t) => t.id);
      d.topics = d.topics.filter((t) => !removed.includes(t.id));
      d.questions = d.questions.filter((q) => !removed.includes(q.topicId));
      d.attempts = d.attempts.filter((a) => !removed.includes(a.topicId));
      for (const n of nodes) {
        const x = Math.round(n.position.x), y = Math.round(n.position.y), t = d.topics.find((k) => k.id === n.id);
        if (t) Object.assign(t, { name: n.data.label, x, y });
        else d.topics.push({ id: n.id, subjectId, name: n.data.label, desc: '', x, y, materials: [] });
      }
      const validEdges = edges.filter((e) => keep.has(e.source) && keep.has(e.target));
      d.edges = d.edges.filter((e) => e.subjectId !== subjectId).concat(validEdges.map((e) => ({ subjectId, source: e.source, target: e.target, from: e.source, to: e.target })));
    });
    ok('Grafo guardado', 'La estructura de temas y prerrequisitos ha sido actualizada con éxito.');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={addTopic}>
            ＋ Agregar Tema
          </button>
          <button type="button" className="btn-ghost text-xs" onClick={reorderNodes} title="Organizar nodos en niveles automáticos">
            ⚡ Auto-organizar
          </button>
        </div>
        <button type="button" className="btn" onClick={save}>
          💾 Guardar grafo
        </button>
      </div>

      <div
        className="card !p-0 overflow-hidden h-[540px] rounded-2xl border"
        style={{
          background: 'rgba(3, 13, 30, 0.95)',
          borderColor: 'rgba(var(--primary-rgb), 0.25)',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.6)',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={rename}
          colorMode="dark"
          fitView
          deleteKeyCode={['Delete', 'Backspace']}
        >
          <Background color="var(--cyan)" gap={28} size={1.2} style={{ opacity: 0.15 }} />
          <Controls />
        </ReactFlow>
      </div>
      <p className="text-xs text-blue-200/90 leading-relaxed">
        💡 <b>Cómo conectar el grafo:</b> Arrastra desde el conector derecho de un tema hacia el conector izquierdo de otro para definir que es su prerrequisito. Doble clic para renombrar; <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/20 text-[10px]">Supr</kbd> para eliminar.
      </p>
    </div>
  );
}

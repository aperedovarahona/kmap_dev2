import { useCallback, useEffect } from 'react';
import { addEdge, Background, Controls, Handle, MarkerType, Position, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { uid, update, useDb } from '../../lib/db.js';
import { edgesOf, isDag, topicsOf } from '../../lib/logic.js';
import { ask, askText, fail, ok } from '../../alerts.js';

function TopicNode({ data, selected }) {
  return (
    <div className={`px-4 py-3 rounded-2xl bg-sky-600 text-white font-semibold border-2 ${selected ? 'border-white' : 'border-cyan-300/50'} shadow-lg`}>
      <Handle type="target" position={Position.Left} />{data.label}<Handle type="source" position={Position.Right} />
    </div>
  );
}
const nodeTypes = { topic: TopicNode };
const arrow = { type: MarkerType.ArrowClosed, color: '#22d3ee' };
const edgeStyle = { stroke: '#22d3ee', strokeWidth: 2 };

// La flecha va del prerrequisito (origen) al tema que depende de él (destino)
export default function GraphEditor({ subjectId }) {
  const db = useDb();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(topicsOf(db, subjectId).map((t) => ({ id: t.id, type: 'topic', position: { x: t.x, y: t.y }, data: { label: t.name } })));
    setEdges(edgesOf(db, subjectId).map((e) => ({ id: `${e.source}-${e.target}`, source: e.source, target: e.target, markerEnd: arrow, style: edgeStyle })));
  }, [subjectId]);

  const onConnect = useCallback((c) => setEdges((es) => addEdge({ ...c, markerEnd: arrow, style: edgeStyle }, es)), []);

  const addTopic = async () => {
    const label = await askText('Nombre del nuevo tema');
    if (label) setNodes((ns) => [...ns, { id: 't-' + uid(), type: 'topic', position: { x: 80 + Math.random() * 240, y: 60 + Math.random() * 240 }, data: { label } }]);
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
      d.edges = d.edges.filter((e) => e.subjectId !== subjectId).concat(validEdges.map((e) => ({ subjectId, source: e.source, target: e.target })));
    });
    ok('Grafo guardado');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={addTopic}>+ Tema</button>
        <button className="btn" onClick={save}>Guardar grafo</button>
      </div>
      <div className="card !p-0 overflow-hidden h-[560px]">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeDoubleClick={rename} colorMode="dark" fitView deleteKeyCode={['Delete', 'Backspace']}>
          <Background color="#1e6fd0" gap={24} /><Controls />
        </ReactFlow>
      </div>
      <p className="text-sm text-blue-200">Cada nodo es un tema. Arrastra del punto derecho de un tema al izquierdo de otro para crear un prerrequisito. Doble clic renombra; Supr elimina lo seleccionado.</p>
    </div>
  );
}

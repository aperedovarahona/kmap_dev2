import { useDb } from '../../lib/db.js';
import { edgesOf, heat } from '../../lib/logic.js';
import KnowledgeGraph, { Legend } from '../KnowledgeGraph.jsx';
import { Empty } from '../ui.jsx';
import { useMemo } from 'react';

export default function HeatPanel({ subjectId }) {
  const db = useDb();
  const h = useMemo(() => heat(db, subjectId), [db, subjectId]);
  const edges = edgesOf(db, subjectId);
  const values = useMemo(() => Object.fromEntries(h.map((t) => [t.id, t.avg])), [h]);
  if (!h.length) return <Empty>Primero crea los temas en el editor de grafo.</Empty>;
  const worst = h.filter((t) => t.avg !== null).sort((a, b) => a.avg - b.avg);
  const fails = [...h].filter((t) => t.failing).sort((a, b) => b.failing - a.failing);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="card"><Legend /><KnowledgeGraph topics={h} edges={edges} values={values} /></div>
      <div className="flex flex-col gap-4">
        <div className="card">
          <b>Peores promedios</b>
          {worst.slice(0, 4).map((t) => <div key={t.id} className="flex justify-between mt-2 text-sm"><span>{t.name}</span><b className="text-rose-300">{t.avg} pts</b></div>)}
          {!worst.length && <p className="text-sm text-blue-200 mt-2">Aún no hay quizzes rendidos.</p>}
        </div>
        <div className="card">
          <b>Temas donde más reprueban</b>
          {fails.slice(0, 4).map((t) => <div key={t.id} className="flex justify-between mt-2 text-sm"><span>{t.name}</span><span>{t.failing} de {t.n}</span></div>)}
        </div>
        <div className="card">
          <b>Mejores promedios</b>
          {[...worst].reverse().slice(0, 3).map((t) => <div key={t.id} className="flex justify-between mt-2 text-sm"><span>{t.name}</span><b className="text-emerald-300">{t.avg} pts</b></div>)}
        </div>
      </div>
    </div>
  );
}

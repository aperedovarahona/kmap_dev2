import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useDb } from '../lib/db.js';
import { PASS, best, fmtDate, nextNodesInGraph, recommendations } from '../lib/logic.js';
import { info } from '../alerts.js';
import Page from '../components/Page.jsx';
import { Empty } from '../components/ui.jsx';
import { SmartIcon, CheckCircleIcon, BooksIcon } from '../components/Icons.jsx';

export default function StudentTopic() {
  const { id, tid } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const db = useDb();
  const t = db.topics.find((x) => x.id === tid && x.subjectId === id);
  const s = db.subjects.find((x) => x.id === id);

  if (!t || !s) {
    return (
      <Page crumb="Mis Materias" title="Tema no encontrado">
        <Empty>Este tema no existe.</Empty>
      </Page>
    );
  }

  const b = best(db, user.id, tid);
  const tries = db.attempts
    .filter((a) => a.userId === user.id && a.topicId === tid)
    .sort((a, c) => c.date.localeCompare(a.date));
  const nq = db.questions.filter((q) => q.topicId === tid).length;
  const recs = b === null || b < PASS ? recommendations(db, user.id, tid, b !== null && b < PASS) : [];
  const nextRecs = b !== null && b >= PASS ? nextNodesInGraph(db, user.id, tid) : [];
  const open = (m) =>
    m.url?.startsWith('http') || m.url?.startsWith('/uploads')
      ? window.open(m.url, '_blank')
      : info(m.title, 'Recurso académico disponible en la versión demostrativa.');

  return (
    <Page
      crumb={`Mis Materias › ${s.name} › ${t.name}`}
      backTo={`/materia/${id}`}
      icon={<SmartIcon icon={t.icon || s.icon} name={t.name} className="w-6 h-6" />}
      title={t.name}
      subtitle={s.name}
      actions={
        <button
          type="button"
          className="btn"
          disabled={!nq}
          onClick={() => nav(`/materia/${id}/tema/${tid}/quiz`)}
        >
          <span>Iniciar Quiz</span>
          <span>▶</span>
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[200px_1fr_300px]">
        {/* Stepper lateral como en la pantalla 3 de la imagen */}
        <div className="card flex lg:flex-col gap-4 justify-between lg:justify-start h-fit">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 grid place-items-center text-xs font-bold">
              <CheckCircleIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-semibold text-white">Descripción</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 grid place-items-center text-xs font-bold">
              <CheckCircleIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-semibold text-white">Material</span>
          </div>
          <button
            type="button"
            disabled={!nq}
            onClick={() => nav(`/materia/${id}/tema/${tid}/quiz`)}
            className="flex items-center gap-3 text-left hover:text-cyan-300 transition"
          >
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 grid place-items-center text-xs font-bold">
              2
            </span>
            <span className="text-sm font-bold text-cyan-300">Quiz →</span>
          </button>
          <div className="flex items-center gap-3 opacity-50">
            <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-600 text-slate-400 grid place-items-center text-xs">
              +
            </span>
            <span className="text-sm text-blue-200">Resultados</span>
          </div>
        </div>

        {/* Centro: Descripción y Material */}
        <div className="flex flex-col gap-4">
          <div className="card">
            <b className="text-cyan-300 inline-flex items-center gap-1.5">
              <BooksIcon className="w-4 h-4" />
              <span>Descripción del tema</span>
            </b>
            <p className="mt-2 text-blue-100 leading-relaxed">
              {t.desc || 'El docente aún no agregó una descripción.'}
            </p>
            {!nq && (
              <p className="mt-3 text-amber-300 text-sm">
                El docente aún no publicó preguntas para el quiz de este tema.
              </p>
            )}
          </div>
          <div className="card">
            <b className="text-cyan-300">📚 Material de estudio</b>
            {(t.materials || []).length ? (
              t.materials.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => open(m)}
                  className="w-full flex justify-between items-center mt-2.5 px-4 py-3 rounded-xl bg-[#041022]/80 border border-[#16497a] hover:border-cyan-400/60 hover:bg-cyan-400/10 text-left transition"
                >
                  <span className="font-medium">📄 {m.title}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold">
                    {m.kind}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-blue-200 mt-2">Sin materiales todavía.</p>
            )}
          </div>
        </div>

        {/* Derecha: Mejor nota e historial */}
        <div className="flex flex-col gap-4">
          <div className="card text-center">
            <div className="text-blue-200 text-sm">Tu mejor nota</div>
            <div
              className={`text-5xl font-extrabold my-2 ${
                b === null ? 'text-slate-400' : b >= PASS ? 'text-cyan-300' : 'text-rose-400'
              }`}
            >
              {b !== null ? `${b}%` : '—'}
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {tries.map((a) => (
                <div
                  key={a.id}
                  className="text-xs text-blue-200 bg-[#041022]/60 px-3 py-1.5 rounded-lg flex justify-between"
                >
                  <span>{fmtDate(a.date)}</span>
                  <b className="text-cyan-300">{a.score}%</b>
                </div>
              ))}
            </div>
          </div>
          {recs.length > 0 && (
            <div className="card">
              <b className="text-amber-300">💡 Antes de este tema, repasa:</b>
              {recs.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => nav(`/materia/${id}/tema/${r.id}`)}
                  className="w-full text-left mt-2 px-3 py-2.5 rounded-xl bg-[#041022]/80 border border-[#16497a] hover:border-cyan-400/60 text-sm transition"
                >
                  {i + 1}. {r.name}
                </button>
              ))}
            </div>
          )}
          {nextRecs.length > 0 && (
            <div className="card">
              <b className="text-amber-300">💡 Siguiente nodo recomendado:</b>
              {nextRecs.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => nav(`/materia/${id}/tema/${r.id}`)}
                  className="w-full text-left mt-2 px-3 py-2.5 rounded-xl bg-[#041022]/80 border border-[#16497a] hover:border-cyan-400/60 text-sm transition"
                >
                  {i + 1}. {r.name} →
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

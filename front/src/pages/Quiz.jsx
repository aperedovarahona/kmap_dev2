import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../auth.jsx';
import { getDb, uid, update } from '../lib/db.js';
import { PASS, nextNodesInGraph, ranking, recommendations, topicsOf } from '../lib/logic.js';
import { ask, fail, ok } from '../alerts.js';
import Page from '../components/Page.jsx';
import { Avatar } from '../components/ui.jsx';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

export default function Quiz() {
  const { id, tid } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const dbSnapshot = getDb();
  const subject = dbSnapshot.subjects.find((s) => s.id === id);
  const topic = dbSnapshot.topics.find((t) => t.id === tid);
  const isEnrolled = dbSnapshot.enrollments.some(
    (e) => e.userId === user.id && e.subjectId === id
  );

  // Hasta 5 preguntas del tema
  const qs = useMemo(
    () =>
      shuffle(getDb().questions.filter((q) => q.topicId === tid))
        .slice(0, 5)
        .map((q) => ({
          ...q,
          opts: shuffle(q.options.map((o, i) => ({ o, c: i === q.correct }))),
        })),
    [tid]
  );

  const [i, setI] = useState(0);
  const [hits, setHits] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [res, setRes] = useState(null);

  if (!isEnrolled) {
    return (
      <Page crumb="Mis Materias › Quiz" title="Acceso no permitido">
        <div className="card">No estás matriculado en esta materia.</div>
      </Page>
    );
  }
  if (!topic || !qs.length) {
    return (
      <Page crumb="Mis Materias › Quiz" title="Quiz no disponible">
        <div className="card">Este tema no tiene preguntas todavía.</div>
      </Page>
    );
  }

  const nextStep = () => {
    if (selectedOpt === null) {
      fail('Selecciona una opción antes de continuar');
      return;
    }
    const chosen = qs[i].opts[selectedOpt];
    const correctOpt = qs[i].opts.find((o) => o.c);
    const isCorrect = Boolean(chosen?.c);
    const h = hits + (isCorrect ? 1 : 0);
    const nextAnswers = [
      ...answers,
      {
        questionId: qs[i].id,
        text: qs[i].text,
        selectedOption: chosen?.o || '',
        correctOption: correctOpt?.o || '',
        isCorrect,
      },
    ];

    if (i + 1 < qs.length) {
      setHits(h);
      setAnswers(nextAnswers);
      setSelectedOpt(null);
      setI(i + 1);
      return;
    }

    const score = Math.round((100 * h) / qs.length);
    update((d) => {
      d.attempts.push({
        id: uid(),
        userId: user.id,
        topicId: tid,
        score,
        date: new Date().toISOString(),
      });
    });

    const db = getDb();
    const ranks = ranking(db, id);
    const totalTopics = Math.max(1, topicsOf(db, id).length);
    const myRankIdx = ranks.findIndex((r) => r.user.id === user.id);
    const rankPos = myRankIdx >= 0 ? myRankIdx + 1 : 1;
    const passed = score >= PASS;
    const prevRecs = recommendations(db, user.id, tid, !passed);
    const nextRecs = nextNodesInGraph(db, user.id, tid);

    setRes({
      score,
      hits: h,
      rank: rankPos,
      total: Math.max(1, ranks.length),
      ranks: ranks.map((r) => ({
        ...r,
        pct: Math.min(100, Math.round(r.points / totalTopics)),
      })),
      recs: prevRecs,
      nextNodes: nextRecs,
      aiLoading: true,
      aiMessage: null,
      aiAnalysis: null,
    });

    // Consultar al motor de grafos con IA del Backend enviando las preguntas, respuestas y grafo de la materia
    const subjectTopics = topicsOf(db, id);
    const subjectTopicIds = new Set(subjectTopics.map((t) => t.id));
    fetch('/api/kmap/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        subjectId: id,
        topicId: tid,
        score,
        answers: nextAnswers,
        graph: {
          subjects: subject ? [subject] : [],
          topics: subjectTopics,
          edges: db.edges.filter((e) => e.subjectId === id),
          questions: db.questions.filter((q) => subjectTopicIds.has(q.topicId)),
          attempts: db.attempts.filter((a) => a.userId === user.id && subjectTopicIds.has(a.topicId)),
        },
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const rec = data?.recommendation;
        setRes((prev) => {
          if (!prev) return prev;
          if (!rec) return { ...prev, aiLoading: false };
          const aiTopics = Array.isArray(rec.recommendedTopics) ? rec.recommendedTopics : [];
          return {
            ...prev,
            aiLoading: false,
            aiMessage: rec.message || prev.aiMessage,
            aiAnalysis: rec.analysis || null,
            recs: !passed && aiTopics.length > 0 ? aiTopics : prev.recs,
            nextNodes: passed && aiTopics.length > 0 ? aiTopics : prev.nextNodes,
          };
        });
      })
      .catch(() => {
        setRes((prev) => (prev ? { ...prev, aiLoading: false } : prev));
      });

    ok(score >= PASS ? '¡Excelente trabajo!' : 'Quiz finalizado', `Tu nota: ${score}%`);
  };

  const exit = async () => {
    if (await ask('Salir del quiz', 'Perderás el avance de este intento.', 'Salir')) {
      nav(`/materia/${id}`);
    }
  };

  // PANTALLA 4: Resultados del Quiz
  if (res) {
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (res.score / 100) * circumference;
    const primaryRec = res.recs[0];

    return (
      <Page crumb="Mis Materias › Resultados del Quiz">
        <div className="flex items-center gap-3 mb-1">
          <div className="text-3xl">🏆</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Resultados</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-[270px_1fr_340px]">
          {/* Columna 1: Gráfico circular (Donut) de Nota */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-glow flex flex-col items-center justify-center text-center py-6 px-4 group"
          >
            <div className="relative w-40 h-40 grid place-items-center group-hover:scale-105 transition-transform duration-200">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#0b2548"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={res.score >= PASS ? '#00f2fe' : '#f43f5e'}
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    filter: `drop-shadow(0 0 12px ${
                      res.score >= PASS ? 'rgba(0,242,254,0.75)' : 'rgba(244,63,94,0.75)'
                    })`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-4xl font-black text-white">{res.score}%</span>
              </div>
            </div>

            <div className="text-sm text-blue-200 mt-3 font-medium">Tu Nota</div>
            <div className="text-lg font-extrabold text-white mt-0.5">
              {res.score >= PASS ? 'Excelente trabajo 🎉' : 'Sigue practicando 💪'}
            </div>
          </motion.div>

          {/* Columna 2: Recomendaciones + Tu Rank en la Materia */}
          <div className="flex flex-col gap-4">
            <div className="card flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-2">
                <span>💡</span>
                <span>Recomendaciones</span>
              </div>
              {res.score < PASS ? (
                primaryRec ? (
                  <>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      {res.aiMessage ? (
                        res.aiMessage
                      ) : res.aiLoading ? (
                        <>Analizando tus respuestas y escaneando el grafo de conocimiento con IA...</>
                      ) : (
                        <>
                          Deberías estudiar el nodo anterior <b className="text-cyan-300">{primaryRec.name}</b>, ya que según el grafo de conocimiento es prerrequisito para dominar <b>{topic.name}</b>.
                        </>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {res.recs.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => nav(`/materia/${id}/tema/${r.id}`)}
                          className="btn-pill px-3.5 py-1.5 text-xs"
                        >
                          Ir a {r.name}
                          {typeof r.failedCount === 'number' && r.failedCount > 0
                            ? ` (${r.failedCount} ${r.failedCount === 1 ? 'fallo' : 'fallos'})`
                            : ''}{' '}
                          →
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      {res.aiMessage || (
                        <>
                          Obtuviste <b>{res.score}%</b> en el nodo base <b className="text-cyan-300">{topic.name}</b>. Revisa nuevamente su material de estudio antes de volver a intentar el quiz.
                        </>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => nav(`/materia/${id}/tema/${topic.id}`)}
                        className="btn-pill px-3.5 py-1.5 text-xs"
                      >
                        Repasar {topic.name} →
                      </button>
                    </div>
                  </>
                )
              ) : res.nextNodes?.length > 0 ? (
                <>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    {res.aiMessage || (
                      <>
                        ¡Aprobaste <b>{topic.name}</b> con <b className="text-cyan-300">{res.score}%</b>! Según el grafo de conocimiento, tu siguiente nodo recomendado es <b className="text-cyan-300">{res.nextNodes[0].name}</b>.
                      </>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {res.nextNodes.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => nav(`/materia/${id}/tema/${n.id}`)}
                        className="btn-pill px-3.5 py-1.5 text-xs"
                      >
                        Ir a {n.name} →
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-blue-100 leading-relaxed">
                  {res.aiMessage || (
                    <>
                      ¡Dominas <b>{topic.name}</b> y todos los nodos conectados en el grafo de conocimiento de esta materia!
                    </>
                  )}
                </p>
              )}
            </div>

            <div className="card flex flex-col justify-center">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-base mb-1">
                <span>📊</span>
                <span>Tu Rank en la Materia</span>
              </div>
              <div className="text-lg font-extrabold text-blue-100">
                #{res.rank} de {res.total} estudiantes
              </div>
            </div>
          </div>

          {/* Columna 3: Ranking General */}
          <div className="card flex flex-col">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-3">
              <span>👑</span>
              <span className="text-white">Ranking General</span>
            </div>
            <div className="flex flex-col gap-2">
              {res.ranks.slice(0, 5).map((r, idx) => {
                const isMe = r.user.id === user.id;
                return (
                  <div
                    key={r.user.id}
                    className={`interactive-row flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm border ${
                      isMe
                        ? 'bg-gradient-to-r from-cyan-500/35 to-sky-500/25 border-cyan-300 shadow-[0_0_18px_rgba(0,242,254,0.3)]'
                        : 'bg-[#041022]/75 border-white/10'
                    }`}
                  >
                    <span className="w-5 text-xs font-bold text-blue-200">{idx + 1}</span>
                    <Avatar name={r.user.name} size="sm" online={isMe} />
                    <span className="flex-1 truncate font-semibold text-white">
                      {r.user.name}
                    </span>
                    <b className="text-cyan-300">{isMe ? `${res.score}%` : `${r.pct}%`}</b>
                  </div>
                );
              })}

              {res.rank > 5 && (
                <>
                  <div className="text-center text-xs text-blue-300 tracking-widest">•••</div>
                  <div className="interactive-row flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm bg-gradient-to-r from-cyan-500/35 to-sky-500/25 border border-cyan-300 shadow-[0_0_18px_rgba(0,242,254,0.3)]">
                    <span className="w-5 text-xs font-bold text-cyan-300">{res.rank}</span>
                    <Avatar name={user.name} size="sm" online />
                    <span className="flex-1 truncate font-bold text-white">{user.name}</span>
                    <b className="text-cyan-300">{res.score}%</b>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={() => nav(`/materia/${id}`)}
            className="btn-pill px-8 py-3 text-sm font-bold"
          >
            <span>Volver al Grafo</span>
            <span>↻</span>
          </button>
        </div>
      </Page>
    );
  }

  // PANTALLA 3: Vista de Pregunta del Quiz con Stepper a la izquierda
  const q = qs[i];
  const progressPct = Math.round(((i + 1) / qs.length) * 100);

  return (
    <Page crumb={`Mis Materias › ${subject?.name || 'Materia'} › ${topic.name}`}>
      <div className="grid gap-5 lg:grid-cols-[190px_1fr] items-start">
        {/* Stepper vertical izquierdo interactivo */}
        <div className="card flex lg:flex-col gap-3 justify-between lg:justify-start py-4">
          <button
            type="button"
            onClick={() => nav(`/materia/${id}/tema/${tid}`)}
            className="interactive-row flex items-center gap-3 px-2.5 py-2 rounded-xl border border-transparent text-left"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-500/25 border border-emerald-400 text-emerald-300 grid place-items-center text-xs font-bold shrink-0">
              ✓
            </span>
            <span className="text-sm text-blue-100 font-medium">Descripción</span>
          </button>

          <button
            type="button"
            onClick={() => nav(`/materia/${id}/tema/${tid}`)}
            className="interactive-row flex items-center gap-3 px-2.5 py-2 rounded-xl border border-transparent text-left"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-500/25 border border-emerald-400 text-emerald-300 grid place-items-center text-xs font-bold shrink-0">
              ✓
            </span>
            <span className="text-sm text-blue-100 font-medium">Material</span>
          </button>

          <div className="flex items-center gap-3 px-2.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-300/60 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <span className="w-7 h-7 rounded-full bg-[#00f2fe] text-[#031126] grid place-items-center text-xs font-black shadow-[0_0_12px_rgba(0,242,254,0.75)] shrink-0">
              2
            </span>
            <span className="text-sm font-extrabold text-white">Quiz</span>
          </div>

          <div className="flex items-center gap-3 px-2.5 py-2 opacity-55">
            <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-600 text-slate-400 grid place-items-center text-xs shrink-0">
              +
            </span>
            <span className="text-sm text-blue-200">Resultados</span>
          </div>
        </div>

        {/* Contenedor principal del Quiz */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white">
                  Quiz: {topic.name}
                </h1>
                <p className="text-xs md:text-sm text-blue-200">
                  Responde las siguientes preguntas para demostrar tu conocimiento.
                </p>
              </div>
            </div>
            <button type="button" className="btn-ghost text-xs" onClick={exit}>
              Salir
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="card-glow p-5 md:p-6 flex flex-col gap-4"
            >
              <p className="text-base md:text-lg font-extrabold text-white">
                {i + 1}. {q.text}
              </p>

              <div className="flex flex-col gap-2.5">
                {q.opts.map((o, k) => {
                  const active = selectedOpt === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSelectedOpt(k)}
                      className={`group cursor-pointer w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left text-sm transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-cyan-500/30 to-sky-500/20 border-[#00f2fe] text-white scale-[1.01] shadow-[0_0_22px_rgba(0,242,254,0.4)]'
                          : 'bg-[#041022]/80 border-[#16497a] text-blue-100 hover:border-cyan-300 hover:bg-cyan-400/15 hover:translate-x-1.5 hover:shadow-[0_0_18px_rgba(0,242,254,0.22)] active:scale-[0.99]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          active
                            ? 'border-[#00f2fe] shadow-[0_0_10px_#00f2fe]'
                            : 'border-blue-400/70 group-hover:border-cyan-300'
                        }`}
                      >
                        {active && <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe]" />}
                      </span>
                      <span className="font-semibold">{o.o}</span>
                    </button>
                  );
                })}
              </div>

              {/* Barra inferior: Pregunta X de Y + barra progreso + botón Siguiente > */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 mt-1 border-t border-[#16497a]/80">
                <span className="text-xs md:text-sm text-blue-200 font-medium">
                  Pregunta {i + 1} de {qs.length}
                </span>

                <div className="flex-1 max-w-xs h-2.5 rounded-full bg-[#041022] border border-sky-400/25 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.65)] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <button type="button" onClick={nextStep} className="btn px-6 py-2 text-sm">
                  <span>{i + 1 === qs.length ? 'Finalizar' : 'Siguiente'}</span>
                  <span>›</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Page>
  );
}

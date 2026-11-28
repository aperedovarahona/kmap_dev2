import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useDb } from '../lib/db.js';
import { PASS, bestMap, edgesOf, topicsOf } from '../lib/logic.js';
import { info } from '../alerts.js';
import Page from '../components/Page.jsx';
import KnowledgeGraph, { Legend } from '../components/KnowledgeGraph.jsx';
import { Empty } from '../components/ui.jsx';
import { SmartIcon, LinkIcon } from '../components/Icons.jsx';
import './StudentSubject.css';

export default function StudentSubject() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const db = useDb();

  const s = db.subjects.find((x) => x.id === id);
  const topics = topicsOf(db, id);
  const edges = edgesOf(db, id);
  const values = bestMap(db, user.id, id);

  const ready = (t) =>
    edges.filter((e) => e.target === t.id).every((e) => (values[e.source] ?? -1) >= PASS);
  const defaultTopic =
    topics.find((t) => t.name === 'Modelo ER') ||
    topics.find((t) => (values[t.id] ?? -1) < PASS && ready(t)) ||
    topics[0];

  const [selId, setSelId] = useState(defaultTopic?.id || null);
  const selectedTopic = topics.find((t) => t.id === selId) || defaultTopic;

  if (!s || !db.enrollments.some((e) => e.userId === user.id && e.subjectId === id)) {
    return (
      <Page crumb="Mis Materias" title="Materia no disponible">
        <Empty>No estás matriculado en esta materia.</Empty>
      </Page>
    );
  }

  const openMaterial = (m) => {
    if (m.url?.startsWith('http')) {
      window.open(m.url, '_blank');
    } else {
      info(
        m.title,
        `<p class="text-sm text-blue-100">Recurso de estudio de <b>${selectedTopic?.name}</b> (${m.kind}).</p>`
      );
    }
  };

  const getResourceIcon = (m) => {
    const k = (m.kind || '').toLowerCase();
    const title = (m.title || '').toLowerCase();
    if (k.includes('pdf') || title.endsWith('.pdf')) {
      return (
        <span className="w-7 h-7 rounded-lg bg-rose-500/30 border border-rose-400/70 text-rose-200 grid place-items-center text-[11px] font-black shrink-0 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
          PDF
        </span>
      );
    }
    if (k.includes('ejercicio') || title.endsWith('.docx')) {
      return (
        <span className="w-7 h-7 rounded-lg bg-sky-500/30 border border-sky-400/70 text-sky-200 grid place-items-center text-[11px] font-black shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
          DOC
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-lg bg-cyan-500/30 border border-cyan-300/70 text-cyan-200 grid place-items-center text-xs font-black shrink-0 shadow-[0_0_10px_rgba(0,242,254,0.3)]">
        <LinkIcon className="w-3.5 h-3.5" />
      </span>
    );
  };

  return (
    <Page
      crumb={`Mis Materias › ${s.name}`}
      backTo="/panel"
      icon={<SmartIcon icon={s.icon} name={s.name} className="w-6 h-6" />}
      title={s.name}
      subtitle="Explora el grafo de conocimiento y avanza por los temas."
    >
      <div className="grid gap-3.5 lg:grid-cols-[1fr_340px] flex-1">
        {/* Columna izquierda: Grafo de la Materia */}
        <div className="card flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-base sm:text-lg font-black text-white">Grafo de la Materia</h2>
            <span className="text-xs text-cyan-200">
              Toca un nodo o botón para ver su información
            </span>
          </div>
          <Legend />
          {topics.length ? (
            <>
              <KnowledgeGraph
                topics={topics}
                edges={edges}
                values={values}
                selected={selectedTopic?.id}
                onSelect={(tid) => setSelId(tid)}
              />
              {/* Selector rápido de temas interactivo para móvil/tablet */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {topics.map((t) => {
                  const active = t.id === selectedTopic?.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelId(t.id)}
                      className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                        active
                          ? 'text-[#021329] scale-105'
                          : 'bg-[#05132b]/85 border text-white hover:bg-white/10 active:scale-95'
                      }`}
                      style={
                        active
                          ? {
                              background: 'var(--g-primary)',
                              boxShadow: '0 0 15px rgba(var(--primary-rgb), 0.5)',
                            }
                          : {
                              borderColor: 'rgba(var(--primary-rgb), 0.35)',
                            }
                      }
                    >
                      {t.icon || '📘'} {t.name}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <Empty>El docente aún no armó el grafo de esta materia.</Empty>
          )}
        </div>

        {/* Columna derecha: Información del Tema seleccionado */}
        {selectedTopic && (
          <div className="card-glow flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-300 text-sm font-extrabold border-b border-sky-400/35 pb-2.5">
                <span>📖</span>
                <span>Información del Tema</span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedTopic.name}
                  </h3>
                  {values[selectedTopic.id] != null && (
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                        values[selectedTopic.id] >= PASS
                          ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-rose-500/25 text-rose-200 border border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      }`}
                    >
                      {values[selectedTopic.id]}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-50/90 leading-relaxed mt-2">
                  {selectedTopic.desc ||
                    'Explora los conceptos fundamentales y recursos prácticos de este tema para avanzar en el mapa.'}
                </p>
              </div>

              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-cyan-300 mb-2.5">
                  <span>📖</span>
                  <span>Recursos</span>
                </div>
                <div className="flex flex-col gap-2">
                  {(selectedTopic.materials || []).length ? (
                    selectedTopic.materials.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => openMaterial(m)}
                        className="cursor-pointer w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#05132b]/90 border border-sky-400/40 hover:border-cyan-300 hover:bg-cyan-400/15 hover:scale-[1.02] active:scale-95 text-left text-sm transition-all duration-200"
                      >
                        {getResourceIcon(m)}
                        <span className="font-semibold text-white truncate flex-1">{m.title}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-blue-200">Sin recursos adjuntos todavía.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => nav(`/materia/${id}/tema/${selectedTopic.id}/quiz`)}
                className="btn w-full py-3 text-base"
              >
                <span>Iniciar Tema</span>
                <span>▶</span>
              </button>
              <button
                type="button"
                onClick={() => nav(`/materia/${id}/tema/${selectedTopic.id}`)}
                className="btn-ghost w-full py-2 text-xs font-bold text-center"
              >
                Ver historial de intentos y detalle →
              </button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

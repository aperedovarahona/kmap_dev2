import { useEffect, useState } from 'react';
import { uid, update, useDb } from '../../lib/db.js';
import { generateQuizAI, topicsOf } from '../../lib/logic.js';
import { ask, askForm, base, fail, ok, Swal } from '../../alerts.js';
import { Empty } from '../ui.jsx';
import { DocumentIcon, SparklesIcon } from '../Icons.jsx';

const empty = { text: '', options: ['', '', '', ''], correct: 0 };

export default function TopicsManager({ subjectId }) {
  const db = useDb();
  const topics = topicsOf(db, subjectId);
  const [tid, setTid] = useState(topics[0]?.id);
  const t = topics.find((x) => x.id === tid) || topics[0];
  const [desc, setDesc] = useState(t?.desc || '');
  const [f, setF] = useState(empty);
  useEffect(() => { setDesc(t?.desc || ''); }, [t?.id]);
  if (!t) return <Empty>Primero crea los temas en el editor de grafo.</Empty>;
  const qs = db.questions.filter((q) => q.topicId === t.id);
  const edit = (fn) => update((d) => {
    const target = d.topics.find((x) => x.id === t.id);
    if (target) {
      target.materials ||= [];
      fn(target, d);
    }
  });

  const saveDesc = () => { edit((x) => { x.desc = desc; }); ok('Descripción guardada'); };
  const addLink = async () => {
    const v = await askForm('Agregar enlace', [{ name: 'title', label: 'Título del material' }, { name: 'url', label: 'Enlace (https://…)' }]);
    if (!v) return;
    if (!/^https?:\/\//.test(v.url)) return fail('El enlace debe empezar con http:// o https://');
    edit((x) => x.materials.push({ id: uid(), title: v.title, kind: 'Enlace', url: v.url }));
    ok('Material agregado');
  };
  // Subida al backend (/api/kmap/upload) y actualización en el estado
  const onFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      let uploadedUrl = '';
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/kmap/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          if (data.url) uploadedUrl = data.url;
        }
      } catch {}
      if (!uploadedUrl) {
        e.target.value = '';
        return fail('No se pudo subir el archivo al servidor. Verifica que el backend esté corriendo.');
      }
      edit((x) => x.materials.push({ id: uid(), title: file.name, kind: 'Archivo', url: uploadedUrl }));
      ok('Material agregado', file.name);
    }
    e.target.value = '';
  };
  const delMat = async (id) => { if (await ask('Quitar material', 'Los estudiantes ya no lo verán.', 'Quitar')) edit((x) => { x.materials = x.materials.filter((m) => m.id !== id); }); };

  const setOpt = (i, v) => setF({ ...f, options: f.options.map((o, j) => (j === i ? v : o)) });
  const addQ = (e) => {
    e.preventDefault();
    if (!f.text.trim() || f.options.some((o) => !o.trim())) return fail('Escribe el enunciado y las 4 opciones');
    update((d) => { d.questions.push({ id: uid(), topicId: t.id, text: f.text.trim(), options: f.options.map((o) => o.trim()), correct: f.correct, source: 'manual' }); });
    setF(empty); ok('Pregunta agregada');
  };
  const delQ = async (id) => { if (await ask('Eliminar pregunta', 'No se puede deshacer.', 'Eliminar')) update((d) => { d.questions = d.questions.filter((q) => q.id !== id); }); };
  const genAI = async () => {
    const r = await Swal.fire({ ...base, title: 'Generar quiz con IA', text: `Tema: ${t.name}`, input: 'select', inputOptions: { 3: '3 preguntas', 5: '5 preguntas', 10: '10 preguntas' }, inputValue: 5, showCancelButton: true, confirmButtonText: 'Generar', cancelButtonText: 'Cancelar' });
    if (!r.isConfirmed) return;
    Swal.fire({ ...base, title: 'Generando preguntas…', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });
    try {
      const out = await generateQuizAI(
        {
          topicId: t.id,
          topicName: t.name,
          topicDesc: desc || t.desc || '',
          materials: t.materials || [],
        },
        Number(r.value)
      );
      update((d) => out.forEach((q) => d.questions.push({ id: uid(), topicId: t.id, ...q, source: 'ia' })));
      ok('Preguntas generadas', `${out.length} preguntas agregadas`);
    } catch (err) {
      fail(err.message);
    }
  };

  return (
    <div className="grid gap-3.5 lg:grid-cols-[230px_1fr]">
      <div className="card flex flex-col gap-1 h-fit">
        <b className="mb-1 text-sm text-cyan-200">Temas de la Materia</b>
        {topics.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setTid(x.id)}
            className={`cursor-pointer text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 ${
              x.id === t.id
                ? 'bg-gradient-to-r from-[#00f2fe] to-sky-400 text-[#021329] font-bold shadow-[0_0_12px_rgba(0,242,254,0.45)]'
                : 'text-blue-100 hover:bg-cyan-400/15'
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="card flex flex-col gap-2">
          <b className="text-sm text-white">Descripción del tema</b>
          <textarea className="input min-h-[75px]" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Explica de qué trata este tema" />
          <button type="button" className="btn w-fit py-2 px-4 text-xs font-bold" onClick={saveDesc}>Guardar descripción</button>
        </div>
        <div className="card">
          <div className="flex flex-wrap justify-between gap-2 items-center">
            <b className="text-sm text-white">Material de estudio</b>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost text-xs py-1.5 px-3" onClick={addLink}>+ Enlace</button>
              <label className="btn-ghost text-xs py-1.5 px-3 cursor-pointer">+ Subir archivo<input type="file" className="hidden" onChange={onFile} /></label>
            </div>
          </div>
          {(t.materials || []).map((m) => (
            <div key={m.id} className="flex justify-between items-center mt-2 px-3 py-2 rounded-xl bg-black/25 text-xs sm:text-sm border border-sky-400/20">
              <span className="truncate mr-2 inline-flex items-center gap-1.5">
                <DocumentIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{m.title}</span>
                <i className="text-cyan-300">· {m.kind}</i>
              </span>
              <button type="button" className="text-rose-300 hover:text-rose-200 text-xs font-bold shrink-0 cursor-pointer" onClick={() => delMat(m.id)}>Quitar</button>
            </div>
          ))}
          {!t.materials?.length && <p className="text-xs text-blue-200 mt-2">Sin materiales todavía (libros, investigaciones, ejercicios…).</p>}
        </div>
        <div className="card">
          <div className="flex flex-wrap justify-between gap-2 items-center">
            <b className="text-sm text-white">Quiz · {qs.length} preguntas</b>
            <button type="button" className="btn py-1.5 px-3.5 text-xs font-bold inline-flex items-center gap-1.5" onClick={genAI}>
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Generar con IA</span>
            </button>
          </div>
          <form onSubmit={addQ} className="flex flex-col gap-2 mt-2.5">
            <input className="input text-xs sm:text-sm" placeholder="Enunciado de la pregunta" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-2">
              {f.options.map((o, i) => (
                <label key={i} className="flex items-center gap-2 text-xs bg-[#030e20]/60 p-1.5 rounded-lg border border-sky-400/20">
                  <input type="radio" name="ok" checked={f.correct === i} onChange={() => setF({ ...f, correct: i })} />
                  <input className="input !py-1 text-xs" placeholder={`Opción ${'ABCD'[i]}${f.correct === i ? ' (correcta)' : ''}`} value={o} onChange={(e) => setOpt(i, e.target.value)} />
                </label>
              ))}
            </div>
            <button type="submit" className="btn-ghost w-fit text-xs py-1.5 px-3">+ Agregar pregunta</button>
          </form>
          {qs.map((q) => (
            <div key={q.id} className="mt-2 px-3 py-2 rounded-xl border border-sky-400/25 bg-[#030e20]/75 text-xs sm:text-sm">
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-white">{q.text}</span>
                <button type="button" className="text-rose-300 hover:text-rose-200 text-xs font-bold shrink-0 cursor-pointer" onClick={() => delQ(q.id)}>Eliminar</button>
              </div>
              <div className="text-blue-200 mt-1 text-xs">Correcta: <b className="text-cyan-200">{q.options[q.correct]}</b> · <span className="text-cyan-300 font-semibold">{q.source === 'ia' ? 'IA' : 'Manual'}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

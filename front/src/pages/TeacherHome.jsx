import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useDb } from '../lib/db.js';
import { topicsOf } from '../lib/logic.js';
import { ok } from '../alerts.js';
import Page from '../components/Page.jsx';
import { Empty } from '../components/ui.jsx';

export default function TeacherHome() {
  const nav = useNavigate();
  const { user } = useAuth();
  const db = useDb();
  const mine = db.subjects.filter((s) => s.teacherId === user.id);
  const copy = (e, code) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    ok('Código copiado', code);
  };

  return (
    <Page
      crumb="Docente › Inicio"
      title={`¡Hola, ${user.name}!`}
      subtitle="Gestiona tus materias, grafos de conocimiento, materiales y mapa de calor ✨"
    >
      {mine.length === 0 ? (
        <Empty>El administrador aún no te asignó materias.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mine.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-glow flex flex-col items-center text-center gap-3 p-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 text-[#031126] font-extrabold grid place-items-center text-3xl shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                {s.icon}
              </div>
              <b className="text-xl text-white">{s.name}</b>
              <p className="text-sm text-blue-200">{s.desc}</p>
              <div className="text-xs text-cyan-300 font-semibold">
                {topicsOf(db, s.id).length} temas •{' '}
                {db.enrollments.filter((e) => e.subjectId === s.id).length} estudiantes
              </div>
              <button
                type="button"
                onClick={(e) => copy(e, s.code)}
                className="btn-ghost text-xs w-full"
              >
                Código de matrícula: <b className="text-cyan-300 tracking-widest">{s.code}</b> 📋
              </button>
              <button
                type="button"
                className="btn w-full"
                onClick={() => nav(`/materia/${s.id}`)}
              >
                <span>Gestionar Materia</span>
                <span>→</span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </Page>
  );
}

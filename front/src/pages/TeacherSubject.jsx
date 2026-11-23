import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { genCode, update, useDb } from '../lib/db.js';
import { ask, ok } from '../alerts.js';
import Page from '../components/Page.jsx';
import { Empty, Tabs } from '../components/ui.jsx';
import GraphEditor from '../components/teacher/GraphEditor.jsx';
import TopicsManager from '../components/teacher/TopicsManager.jsx';
import HeatPanel from '../components/teacher/HeatPanel.jsx';

export default function TeacherSubject() {
  const { id } = useParams();
  const { user } = useAuth();
  const db = useDb();
  const [tab, setTab] = useState('grafo');
  const s = db.subjects.find((x) => x.id === id);
  if (!s || s.teacherId !== user.id)
    return (
      <Page crumb="Docente" title="Materia no disponible">
        <Empty>No tienes acceso a esta materia.</Empty>
      </Page>
    );

  const newCode = async () => {
    if (
      !(await ask(
        'Generar nuevo código',
        'El código anterior dejará de servir para matricularse.',
        'Generar'
      ))
    )
      return;
    const c = genCode();
    update((d) => {
      d.subjects.find((x) => x.id === id).code = c;
    });
    ok('Nuevo código', c);
  };
  const copy = () => {
    navigator.clipboard?.writeText(s.code);
    ok('Código copiado', s.code);
  };

  return (
    <Page
      crumb={`Docente › ${s.name}`}
      backTo="/panel"
      icon={s.icon}
      title={s.name}
      subtitle={s.desc}
      actions={
        <div className="flex flex-wrap gap-2 items-center">
          <button type="button" className="btn-ghost text-xs" onClick={copy}>
            Código: <b className="text-cyan-300 tracking-widest">{s.code}</b> 📋
          </button>
          <button type="button" className="btn-ghost text-xs" onClick={newCode}>
            Nuevo código
          </button>
        </div>
      }
    >
      <Tabs
        tabs={[
          ['grafo', '🕸️ Editor de grafo'],
          ['temas', '📝 Temas y quiz'],
          ['calor', '🔥 Mapa de calor'],
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'grafo' && <GraphEditor subjectId={id} />}
      {tab === 'temas' && <TopicsManager subjectId={id} />}
      {tab === 'calor' && <HeatPanel subjectId={id} />}
    </Page>
  );
}

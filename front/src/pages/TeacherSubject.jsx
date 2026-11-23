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

  const toggleAntiCopy = () => {
    const isCurrentlyActive = s.antiCopy !== false;
    const nextState = !isCurrentlyActive;

    update((d) => {
      const subject = d.subjects.find((x) => x.id === id);
      if (subject) {
        subject.antiCopy = nextState;
      }
    });

    if (nextState) {
      ok(
        'Medidas anticopia activadas',
        'Se bloquearán capturas de pantalla, copiado/pegado y clics derechos para estudiantes en esta materia.'
      );
    } else {
      ok(
        'Medidas anticopia desactivadas',
        'Los estudiantes podrán copiar texto y navegar libremente en esta materia.'
      );
    }
  };

  const isAntiCopyEnabled = s.antiCopy !== false;

  return (
    <Page
      crumb={`Docente › ${s.name}`}
      backTo="/panel"
      icon={s.icon}
      title={s.name}
      subtitle={s.desc}
      actions={
        <div className="flex flex-wrap gap-2 items-center">
          {/* Toggle Switch para medidas anticopia (StudentSecurityGuard) */}
          <button
            type="button"
            onClick={toggleAntiCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer select-none"
            style={{
              background: isAntiCopyEnabled ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: isAntiCopyEnabled ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.2)',
              color: isAntiCopyEnabled ? '#ffffff' : 'var(--text-muted)',
              boxShadow: isAntiCopyEnabled ? '0 0 14px rgba(var(--primary-rgb), 0.35)' : 'none',
            }}
            title={
              isAntiCopyEnabled
                ? 'Protección activa. Haz clic para permitir copia y capturas a los estudiantes.'
                : 'Protección desactivada. Haz clic para activar bloqueo anticopia para estudiantes.'
            }
          >
            <span>{isAntiCopyEnabled ? '🛡️' : '🔓'}</span>
            <span className="hidden sm:inline">Anticopia:</span>
            <span style={{ color: isAntiCopyEnabled ? 'var(--cyan)' : 'var(--text-muted)' }}>
              {isAntiCopyEnabled ? 'ON' : 'OFF'}
            </span>
            <span
              className="w-8 h-4 rounded-full relative inline-block transition-colors duration-300 ml-0.5"
              style={{
                background: isAntiCopyEnabled ? 'var(--cyan)' : '#475569',
              }}
            >
              <span
                className="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform duration-300 shadow-sm"
                style={{
                  transform: isAntiCopyEnabled ? 'translateX(17px)' : 'translateX(2px)',
                }}
              />
            </span>
          </button>

          <button type="button" className="btn-ghost text-xs" onClick={copy}>
            Código: <b className="tracking-widest" style={{ color: 'var(--cyan)' }}>{s.code}</b> 📋
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

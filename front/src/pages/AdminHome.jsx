import { genCode, uid, update, useDb } from '../lib/db.js';
import { askForm, fail, info, ok } from '../alerts.js';
import Page from '../components/Page.jsx';

export default function AdminHome() {
  const db = useDb();
  const docentes = db.users.filter((u) => u.role === 'docente');

  const addTeacher = async () => {
    const v = await askForm(
      'Asignar docente',
      [
        { name: 'name', label: 'Nombre' },
        { name: 'email', label: 'Correo', type: 'email' },
        { name: 'carnet', label: 'Carnet' },
      ],
      'Crear y enviar credenciales'
    );
    if (!v) return;
    if (!/^\S+@\S+\.\S+$/.test(v.email)) return fail('Correo no válido');
    if (
      docentes.some(
        (d) => d.carnet === v.carnet || d.name.toLowerCase() === v.name.toLowerCase()
      )
    )
      return fail('Ya existe un docente con ese nombre o carnet');
    update((d) => {
      d.users.push({
        id: uid(),
        role: 'docente',
        name: v.name,
        email: v.email,
        carnet: v.carnet,
        password: v.carnet,
        mustChange: true,
      });
    });
    info(
      'Credenciales enviadas (simulado)',
      `Se enviaron a <b>${v.email}</b>:<br>Usuario: <b>${v.name}</b><br>Contraseña inicial: su carnet`
    );
  };

  const addSubject = async () => {
    const v = await askForm('Nueva materia', [
      { name: 'name', label: 'Nombre de la materia' },
      { name: 'desc', label: 'Descripción corta' },
    ]);
    if (!v) return;
    update((d) => {
      d.subjects.push({
        id: uid(),
        name: v.name,
        desc: v.desc,
        icon: '📘',
        teacherId: null,
        code: genCode(),
      });
    });
    ok('Materia creada');
  };

  const assign = (sid, teacherId) => {
    update((d) => {
      d.subjects.find((s) => s.id === sid).teacherId = teacherId || null;
    });
    ok('Asignación actualizada');
  };

  return (
    <Page
      crumb="Admin › Panel"
      title="Panel de Administración"
      subtitle="Gestiona docentes, materias y asignaciones académicas ✨"
    >
      <div className="grid gap-3.5 xl:grid-cols-2">
        <div className="card">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <b className="text-lg text-white">👨‍🏫 Docentes ({docentes.length})</b>
            <button type="button" className="btn text-xs sm:text-sm" onClick={addTeacher}>
              + Asignar docente
            </button>
          </div>
          {docentes.map((d) => (
            <div
              key={d.id}
              className="interactive-row flex flex-wrap justify-between gap-2 px-4 py-3 mt-2.5 rounded-xl bg-[#05132b]/80 border border-sky-400/30 text-sm"
            >
              <span>
                <b className="text-white">{d.name}</b>
                <br />
                <span className="text-cyan-200 text-xs">{d.email}</span>
              </span>
              <span className="text-right text-blue-200 text-xs">
                Carnet <b className="text-cyan-300">{d.carnet}</b>
                <br />
                {db.subjects.filter((s) => s.teacherId === d.id).length} materias asignadas
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <b className="text-lg text-white">📚 Materias ({db.subjects.length})</b>
            <button type="button" className="btn text-xs sm:text-sm" onClick={addSubject}>
              + Nueva materia
            </button>
          </div>
          {db.subjects.map((s) => (
            <div
              key={s.id}
              className="interactive-row flex flex-wrap items-center justify-between gap-2 px-4 py-3 mt-2.5 rounded-xl bg-[#05132b]/80 border border-sky-400/30 text-sm"
            >
              <span>
                <span className="mr-1.5">{s.icon}</span>
                <b className="text-white">{s.name}</b>
                <br />
                <span className="text-cyan-200 text-xs">
                  {db.enrollments.filter((e) => e.subjectId === s.id).length} estudiantes · Código{' '}
                  <b>{s.code}</b>
                </span>
              </span>
              <select
                className="input !w-auto cursor-pointer"
                value={s.teacherId || ''}
                onChange={(e) => assign(s.id, e.target.value)}
              >
                <option value="">Sin docente</option>
                {docentes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

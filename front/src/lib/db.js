import { useSyncExternalStore } from 'react';

const KEY = 'kmap_db_v4';
export const uid = () => Math.random().toString(36).slice(2, 9);
export const genCode = () => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join('');
};

function seed() {
  const d = {
    users: [],
    subjects: [],
    topics: [],
    edges: [],
    questions: [],
    enrollments: [],
    attempts: [],
  };

  d.users.push(
    {
      id: 'u-admin',
      role: 'admin',
      name: 'Administrador',
      username: 'admin',
      email: 'admin@demo.com',
      password: 'admin123',
      altPasswords: ['123456', 'admin'],
    },
    {
      id: 'u-doc',
      role: 'docente',
      name: 'Prof. Rivera',
      username: 'docente',
      email: 'docente@demo.com',
      altEmails: ['rivera@umss.edu'],
      carnet: '1234567',
      password: '1234567',
      altPasswords: ['123456'],
      mustChange: false,
    },
    {
      id: 'u-ale',
      role: 'estudiante',
      name: 'Jhoselyn Lopez',
      username: 'estudiante',
      sis: '202012345',
      email: 'jhoselyn@est.umss.edu',
      altEmails: ['estudiante@demo.com', 'ale@est.umss.edu'],
      password: '123456',
    }
  );

  const peerNames = [
    ['Ana Torres', 98],
    ['Carlos Méndez', 95],
    ['María López', 93],
    ['Diego Vargas', 89],
    ['Sofía Rojas', 86],
    ['Luis Fernández', 84],
    ['Valeria Castro', 82],
    ['Mateo Morales', 76],
    ['Camila Ortiz', 71],
    ['Andrés Guzmán', 65],
  ];

  peerNames.forEach(([name], idx) => {
    const i = idx + 1;
    d.users.push({
      id: 's' + i,
      role: 'estudiante',
      name,
      sis: '2021000' + String(i).padStart(2, '0'),
      email: `est${i}@est.umss.edu`,
      password: '123456',
    });
  });

  // Materias con el diseño de la imagen
  d.subjects.push(
    {
      id: 'sub-bd',
      name: 'Bases de Datos',
      desc: 'Explora el grafo de conocimiento y avanza por los temas de modelado y SQL.',
      icon: '🗄️',
      theme: 'purple',
      teacherId: 'u-doc',
      code: 'BDD3K9',
      antiCopy: false,
    },
    {
      id: 'sub-prg',
      name: 'Programación',
      desc: 'Lógica algorítmica, estructuras de control y desarrollo modular.',
      icon: '</>',
      theme: 'blue',
      teacherId: 'u-doc',
      code: 'PRG4M9',
      antiCopy: false,
    },
    {
      id: 'sub-1',
      name: 'Matemáticas',
      desc: 'Del álgebra y factorización hasta límites, derivadas e integrales.',
      icon: '🧮',
      theme: 'green',
      teacherId: 'u-doc',
      code: 'CAL7K2',
      antiCopy: false,
    },
    {
      id: 'sub-alg',
      name: 'Álgebra Lineal',
      desc: 'Vectores, matrices, determinantes y espacios vectoriales.',
      icon: '📐',
      theme: 'cyan',
      teacherId: null,
      code: 'ALG8Q5',
      antiCopy: false,
    }
  );

  // 1) Temas de Bases de Datos (igual al grafo de la imagen)
  const bdTopics = [
    [
      'bd-intro',
      'Bases de Datos',
      380,
      55,
      'Fundamentos de sistemas gestores de bases de datos, arquitectura y modelos de datos.',
      '🗄️',
    ],
    [
      'bd-er',
      'Modelo ER',
      180,
      195,
      'El modelo Entidad-Relación es una herramienta para representar la estructura de una base de datos a través de entidades, atributos y relaciones.',
      '🔀',
    ],
    [
      'bd-rel',
      'Modelo Relacional',
      580,
      195,
      'Representación de datos mediante relaciones (tablas), tuplas, claves primarias y foráneas.',
      '📋',
    ],
    [
      'bd-norm',
      'Normalización',
      180,
      345,
      'Aplicación de formas normales (1FN, 2FN, 3FN, BCNF) para eliminar redundancia y anomalías.',
      '⚙️',
    ],
    [
      'bd-sql',
      'SQL',
      580,
      345,
      'Lenguaje de consulta estructurado: DDL, DML, JOINs, agregaciones y subconsultas.',
      '</>',
    ],
  ];

  for (const [k, name, x, y, desc, icon] of bdTopics) {
    d.topics.push({
      id: k,
      subjectId: 'sub-bd',
      name,
      desc,
      icon,
      x,
      y,
      materials: [
        { id: uid(), title: `Apunte - ${name}.pdf`, kind: 'PDF', url: '' },
        { id: uid(), title: 'Ejercicios Prácticos.docx', kind: 'Ejercicios', url: '' },
        { id: uid(), title: 'Investigación', kind: 'Enlace', url: 'https://es.wikipedia.org/wiki/Modelo_entidad-relaci%C3%B3n' },
      ],
    });
  }

  for (const [a, b] of [
    ['bd-intro', 'bd-er'],
    ['bd-intro', 'bd-rel'],
    ['bd-er', 'bd-norm'],
    ['bd-rel', 'bd-sql'],
  ]) {
    d.edges.push({ subjectId: 'sub-bd', source: a, target: b });
  }

  const bdQuestions = [
    [
      'bd-er',
      '¿Qué representa el modelo ER?',
      [
        'La estructura de una base de datos',
        'El diseño de una interfaz',
        'El lenguaje de programación',
        'Un tipo de red',
      ],
    ],
    [
      'bd-er',
      '¿Cómo se representa gráficamente una entidad en el modelo ER clásico?',
      ['Con un rectángulo', 'Con una elipse', 'Con un triángulo', 'Con una línea punteada'],
    ],
    [
      'bd-er',
      '¿Qué elemento describe una propiedad o característica de una entidad?',
      ['Atributo', 'Tupla', 'Índice', 'Trigger'],
    ],
    [
      'bd-er',
      '¿Qué indica la cardinalidad 1:N en una relación?',
      [
        'Una entidad A se asocia con muchas de B',
        'Ambas entidades solo tienen un registro',
        'No existe relación entre tablas',
        'Es una clave primaria compuesta',
      ],
    ],
    [
      'bd-er',
      '¿Qué es un atributo identificador o clave en el modelo ER?',
      [
        'El que distingue de forma única cada ocurrencia de una entidad',
        'Un atributo que siempre puede ser nulo',
        'Una tabla externa sin relación',
        'Un procedimiento almacenado',
      ],
    ],
    [
      'bd-intro',
      '¿Qué es un SGBD (DBMS)?',
      [
        'Un software para gestionar y consultar bases de datos',
        'Un protocolo de red inalámbrica',
        'Un compilador de hojas de estilo',
        'Un sistema operativo móvil',
      ],
    ],
    [
      'bd-intro',
      '¿Cuál es una ventaja principal de usar una base de datos frente a archivos planos?',
      [
        'Integridad, concurrencia y menor redundancia de datos',
        'Mayor duplicidad de archivos',
        'No requiere estructura alguna',
        'Solo permite un usuario a la vez',
      ],
    ],
    [
      'bd-rel',
      'En el modelo relacional, ¿qué garantiza una clave foránea (Foreign Key)?',
      [
        'La integridad referencial entre dos tablas',
        'Que todos los campos sean de texto',
        'Que la tabla no tenga filas',
        'La encriptación de contraseñas',
      ],
    ],
    [
      'bd-rel',
      '¿Cómo se denomina formalmente a una fila en el modelo relacional?',
      ['Tupla', 'Atributo', 'Dominio', 'Esquema'],
    ],
    [
      'bd-norm',
      '¿Qué exige la Primera Forma Normal (1FN)?',
      [
        'Que todos los atributos sean atómicos (sin grupos repetitivos)',
        'Tener al menos cinco claves foráneas',
        'Eliminar todas las claves primarias',
        'Unir todas las tablas en una sola',
      ],
    ],
    [
      'bd-norm',
      '¿Qué tipo de dependencia se elimina al pasar de 2FN a 3FN?',
      [
        'La dependencia transitiva respecto a la clave primaria',
        'La clave primaria entera',
        'Las relaciones uno a muchos',
        'Los índices únicos',
      ],
    ],
    [
      'bd-sql',
      '¿Qué comando SQL se utiliza para consultar registros de una tabla?',
      ['SELECT', 'UPDATE', 'DROP', 'ALTER'],
    ],
    [
      'bd-sql',
      '¿Qué cláusula combina filas de dos tablas basándose en una columna relacionada?',
      ['JOIN', 'GROUP BY', 'ORDER BY', 'TRUNCATE'],
    ],
  ];
  bdQuestions.forEach(([topicId, text, options], i) =>
    d.questions.push({ id: 'qbd-' + i, topicId, text, options, correct: 0, source: 'manual' })
  );

  // 2) Temas de Programación
  const prgTopics = [
    ['p-var', 'Variables', 100, 190, 'Tipos de datos primitivos, declaración de variables y operadores.', '📦'],
    ['p-con', 'Condicionales', 340, 110, 'Estructuras selectivas if, else, switch y lógica booleana.', '🔀'],
    ['p-cic', 'Ciclos', 340, 270, 'Bucles for, while y do-while para iteración controlada.', '🔄'],
    ['p-fnc', 'Funciones', 590, 190, 'Modularización, parámetros, retorno y alcance de variables.', '⚡'],
    ['p-arr', 'Arreglos', 840, 190, 'Listas, vectores, recorrido y métodos de transformación.', '📚'],
  ];
  prgTopics.forEach(([id, name, x, y, desc, icon]) =>
    d.topics.push({
      id,
      subjectId: 'sub-prg',
      name,
      desc,
      icon,
      x,
      y,
      materials: [
        { id: uid(), title: `Apunte - ${name}.pdf`, kind: 'PDF', url: '' },
        { id: uid(), title: `Práctica de ${name}.docx`, kind: 'Ejercicios', url: '' },
      ],
    })
  );
  [
    ['p-var', 'p-con'],
    ['p-var', 'p-cic'],
    ['p-con', 'p-fnc'],
    ['p-cic', 'p-fnc'],
    ['p-fnc', 'p-arr'],
  ].forEach(([source, target]) => d.edges.push({ subjectId: 'sub-prg', source, target }));

  const prgQuestions = [
    ['p-var', '¿Qué es una variable en programación?', ['Un espacio en memoria para almacenar un valor', 'Un bucle infinito', 'Un error de sintaxis', 'Un cable de red']],
    ['p-var', '¿Qué operador devuelve el resto de una división entera?', ['%', '/', '*', '^']],
    ['p-con', '¿Cuándo se ejecuta el bloque else de un condicional?', ['Cuando la condición del if es falsa', 'Siempre antes del if', 'Solo si hay un error de compilación', 'Nunca']],
    ['p-cic', '¿Qué estructura es ideal cuando conocemos el número exacto de iteraciones?', ['Ciclo for', 'Condicional switch', 'Operador ternario', 'Import']],
    ['p-fnc', '¿Para qué sirve la sentencia return en una función?', ['Devuelve un valor y finaliza la ejecución de la función', 'Reinicia el computador', 'Declara una clase global', 'Borra los parámetros']],
    ['p-arr', '¿Cuál es el índice del primer elemento de un arreglo en la mayoría de lenguajes?', ['0', '1', '-1', '10']],
  ];
  prgQuestions.forEach(([topicId, text, options], i) =>
    d.questions.push({ id: 'qprg-' + i, topicId, text, options, correct: 0, source: 'manual' })
  );

  // 3) Temas de Matemáticas (Cálculo I)
  const T = [
    ['ari', 'Aritmética', 90, 200, 'Operaciones básicas, fracciones y potencias.', '➕'],
    ['alg', 'Álgebra', 250, 90, 'Ecuaciones lineales y sistemas.', '✖️'],
    ['tri', 'Trigonometría', 250, 310, 'Razones trigonométricas e identidades.', '📐'],
    ['fac', 'Factorización', 420, 90, 'Factor común, diferencia de cuadrados y trinomios.', '🧩'],
    ['fun', 'Funciones', 420, 250, 'Dominio, evaluación y composición.', '📈'],
    ['lim', 'Límites', 590, 170, 'Concepto de límite y cálculo algebraico.', '🎯'],
    ['der', 'Derivadas', 760, 90, 'Reglas de derivación y razón de cambio.', '∂'],
    ['int', 'Integrales', 760, 260, 'Antiderivadas e integral definida.', '∫'],
  ];
  for (const [k, name, x, y, desc, icon] of T) {
    d.topics.push({
      id: 't-' + k,
      subjectId: 'sub-1',
      name,
      desc,
      icon,
      x,
      y,
      materials: [
        { id: uid(), title: `Guía de ${name}.pdf`, kind: 'PDF', url: '' },
        { id: uid(), title: `Ejercicios de ${name}.docx`, kind: 'Ejercicios', url: '' },
      ],
    });
  }
  for (const [a, b] of [
    ['ari', 'alg'],
    ['ari', 'tri'],
    ['alg', 'fac'],
    ['alg', 'fun'],
    ['tri', 'fun'],
    ['fac', 'lim'],
    ['fun', 'lim'],
    ['lim', 'der'],
    ['lim', 'int'],
  ]) {
    d.edges.push({ subjectId: 'sub-1', source: 't-' + a, target: 't-' + b });
  }

  const Q = [
    ['ari', '12 + 8 ÷ 4 = ?', ['14', '5', '20', '10']],
    ['ari', '3/4 + 1/2 = ?', ['5/4', '4/6', '3/8', '1']],
    ['ari', '2³ · 2² = ?', ['2⁵', '2⁶', '4⁵', '2¹']],
    ['alg', 'Resuelve 2x + 6 = 14', ['x = 4', 'x = 10', 'x = 3', 'x = 5']],
    ['alg', 'Si 3(x − 2) = 2x + 1, x = ?', ['7', '5', '−1', '3']],
    ['alg', 'x + y = 5, x − y = 1: (x, y) = ?', ['(3, 2)', '(2, 3)', '(4, 1)', '(1, 4)']],
    ['fac', 'Factoriza x² − 9', ['(x − 3)(x + 3)', '(x − 3)²', 'x(x − 9)', '(x + 9)(x − 1)']],
    ['fac', 'Factoriza x² + 5x + 6', ['(x + 2)(x + 3)', '(x + 1)(x + 6)', '(x − 2)(x − 3)', '(x + 5)(x + 1)']],
    ['fac', 'Factoriza 6x² + 7x − 3', ['(2x + 3)(3x − 1)', '(6x − 1)(x + 3)', '(2x − 3)(3x + 1)', '(3x + 3)(2x − 1)']],
    ['fun', 'Si f(x) = 2x + 1, f(3) = ?', ['7', '6', '5', '9']],
    ['fun', 'Dominio de f(x) = √(x − 4)', ['x ≥ 4', 'x ≤ 4', 'x > 0', 'Todos los reales']],
    ['fun', 'f(x) = x², g(x) = x + 1. (f∘g)(2) = ?', ['9', '5', '6', '7']],
    ['tri', 'sen(90°) = ?', ['1', '0', '−1', '1/2']],
    ['tri', 'cos(60°) = ?', ['1/2', '√3/2', '1', '0']],
    ['tri', 'tan x equivale a', ['sen x / cos x', 'cos x / sen x', '1 / sen x', 'sen x · cos x']],
    ['lim', 'lím x→2 (x + 3) = ?', ['5', '2', '3', '∞']],
    ['lim', 'lím x→3 (x² − 9)/(x − 3) = ?', ['6', '0', '3', 'No existe']],
    ['lim', 'lím x→0 sen(x)/x = ?', ['1', '0', '∞', '−1']],
    ['der', 'd/dx x³ = ?', ['3x²', 'x²', '3x', 'x⁴/4']],
    ['der', 'd/dx sen x = ?', ['cos x', '−cos x', '−sen x', 'tan x']],
    ['der', 'd/dx (x·eˣ) = ?', ['eˣ(x + 1)', 'x·eˣ⁻¹', 'eˣ', 'x·eˣ']],
    ['int', '∫ 2x dx = ?', ['x² + C', '2x² + C', 'x + C', '2 + C']],
    ['int', '∫ cos x dx = ?', ['sen x + C', '−sen x + C', 'cos x + C', 'tan x + C']],
    ['int', '∫₀¹ 3x² dx = ?', ['1', '3', '0', '1/3']],
  ];
  Q.forEach(([k, text, options], i) =>
    d.questions.push({ id: 'q' + i, topicId: 't-' + k, text, options, correct: 0, source: 'manual' })
  );

  // Matrícula inicial de Jhoselyn únicamente en Bases de Datos (las demás se añaden individualmente por código)
  d.enrollments.push(
    { userId: 'u-ale', subjectId: 'sub-bd' }
  );

  // Notas iniciales de Jhoselyn
  const jhoseScores = {
    'bd-intro': 95,
    'bd-er': 80,
    'bd-rel': 85,
    'bd-norm': 40,
    'p-var': 90,
    'p-con': 85,
    't-ari': 92,
    't-alg': 88,
    't-fac': 35,
  };
  Object.entries(jhoseScores).forEach(([topicId, score]) =>
    d.attempts.push({
      id: uid(),
      userId: 'u-ale',
      topicId,
      score,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    })
  );

  // Matrículas y notas de compañeros para Ranking y Mapa de Calor
  const bdTopicIds = ['bd-intro', 'bd-er', 'bd-rel', 'bd-norm', 'bd-sql'];
  const matBase = { ari: 90, alg: 72, tri: 80, fac: 38, fun: 48, lim: 34, der: 22, int: 16 };

  peerNames.forEach(([, targetAvg], idx) => {
    const uidPeer = 's' + (idx + 1);
    d.enrollments.push(
      { userId: uidPeer, subjectId: 'sub-bd' },
      { userId: uidPeer, subjectId: 'sub-1' }
    );
    bdTopicIds.forEach((tid, tIdx) => {
      const sc = Math.max(30, Math.min(100, targetAvg - tIdx * 3));
      d.attempts.push({
        id: uid(),
        userId: uidPeer,
        topicId: tid,
        score: sc,
        date: new Date(Date.now() - 86400000 * (idx + 1)).toISOString(),
      });
    });
    for (const [k, v] of Object.entries(matBase)) {
      const sc = Math.max(20, Math.min(100, Math.round(v + (5 - idx) * 3)));
      d.attempts.push({
        id: uid(),
        userId: uidPeer,
        topicId: 't-' + k,
        score: sc,
        date: new Date(Date.now() - 86400000 * (idx + 2)).toISOString(),
      });
    }
  });

  return d;
}

let state = (() => {
  try {
    const s = localStorage.getItem(KEY);
    if (s) return JSON.parse(s);
  } catch {}
  const d = seed();
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
  return d;
})();

const subs = new Set();
const emit = () => subs.forEach((f) => f());

/**
 * Carga el estado real directamente desde la base de datos MySQL (vía backend PHP / CodeIgniter 3).
 */
export async function refreshDb() {
  try {
    const res = await fetch('/api/kmap/state');
    if (!res.ok) return state;
    const json = await res.json();
    if (json && json.ok && json.state && Array.isArray(json.state.users) && json.state.users.length > 0) {
      state = json.state;
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {}
      emit();
      return state;
    }
  } catch (err) {
    console.warn('[KMAP] No se pudo sincronizar con backend SQL, usando caché:', err.message);
  }
  return state;
}

// Iniciar sincronización inmediata con la base de datos SQL
if (typeof window !== 'undefined') {
  setTimeout(() => {
    refreshDb();
  }, 10);
}

export const getDb = () => state;

export function update(fn) {
  const next = structuredClone(state);
  fn(next);
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  emit();

  // Sincronizar cambios asíncronamente con MySQL
  if (typeof fetch !== 'undefined') {
    fetch('/api/kmap/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).catch(() => {});
  }
}

export const useDb = () =>
  useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state
  );

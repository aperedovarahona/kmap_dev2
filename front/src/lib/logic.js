export const PASS = 51; // nota mínima de aprobación

export const fmtDate = (d) => {
  const x = new Date(d);
  return `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${x.getFullYear()}`;
};

export const topicsOf = (db, sid) => db.topics.filter((t) => t.subjectId === sid);
export const edgesOf = (db, sid) => db.edges.filter((e) => e.subjectId === sid);

export const best = (db, userId, topicId) => {
  const s = db.attempts.filter((a) => a.userId === userId && a.topicId === topicId).map((a) => a.score);
  return s.length ? Math.max(...s) : null;
};
export const bestMap = (db, userId, sid) => Object.fromEntries(topicsOf(db, sid).map((t) => [t.id, best(db, userId, t.id)]));

export const progress = (db, userId, sid) => {
  const ts = topicsOf(db, sid);
  return ts.length ? Math.round((100 * ts.filter((t) => (best(db, userId, t.id) ?? -1) >= PASS).length) / ts.length) : 0;
};
export const xpOf = (db, userId) => db.topics.reduce((s, t) => s + (best(db, userId, t.id) || 0), 0);
export const levelOf = (xp) => ({ level: Math.floor(xp / 300) + 1, cur: xp % 300, max: 300 });

export const ranking = (db, sid) => {
  const ts = topicsOf(db, sid);
  return db.enrollments.filter((e) => e.subjectId === sid)
    .map((e) => ({ user: db.users.find((u) => u.id === e.userId), points: ts.reduce((s, t) => s + (best(db, e.userId, t.id) || 0), 0) }))
    .filter((r) => r.user).sort((a, b) => b.points - a.points);
};

// Orden topológico (Kahn) de los nodos de una materia
export function topologicalTopics(db, sid) {
  const ts = topicsOf(db, sid);
  const es = edgesOf(db, sid);
  const indeg = Object.fromEntries(ts.map((t) => [t.id, 0]));
  const adj = Object.fromEntries(ts.map((t) => [t.id, []]));
  for (const e of es) {
    if (indeg[e.target] !== undefined && adj[e.source]) {
      indeg[e.target]++;
      adj[e.source].push(e.target);
    }
  }
  const q = ts.filter((t) => indeg[t.id] === 0).map((t) => t.id);
  const orderedIds = [];
  while (q.length) {
    const u = q.shift();
    orderedIds.push(u);
    for (const v of adj[u] || []) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  for (const t of ts) {
    if (!orderedIds.includes(t.id)) orderedIds.push(t.id);
  }
  return orderedIds.map((id) => ts.find((t) => t.id === id)).filter(Boolean);
}

// Prerrequisitos (nodos anteriores en el grafo DAG):
// 1. Si el estudiante reprueba el tema actual (forcePreviousIfFailed), prioriza los nodos prerrequisito directos (source -> topicId) para recomendar el nodo inmediato anterior (ej. Tema 3 -> Tema 2).
// 2. Caso contrario, busca prerrequisitos aún no aprobados (< 51%), del más profundo al más cercano.
export function recommendations(db, userId, topicId, forcePreviousIfFailed = false) {
  const t = db.topics.find((x) => x.id === topicId);
  if (!t) return [];
  const edges = edgesOf(db, t.subjectId);
  const directPrev = edges
    .filter((e) => e.target === topicId)
    .map((e) => db.topics.find((x) => x.id === e.source))
    .filter(Boolean);

  const seen = new Set();
  const unpassedAncestors = [];

  const walk = (id) => {
    for (const e of edges.filter((edge) => edge.target === id)) {
      if (seen.has(e.source)) continue;
      seen.add(e.source);
      const found = db.topics.find((x) => x.id === e.source);
      if (found) {
        const b = best(db, userId, e.source);
        if (b === null || b < PASS) {
          unpassedAncestors.push(found);
        }
        walk(e.source);
      }
    }
  };
  walk(topicId);

  if (forcePreviousIfFailed) {
    if (directPrev.length > 0) {
      const directIds = new Set(directPrev.map((x) => x.id));
      const extraUnpassed = unpassedAncestors.filter((x) => !directIds.has(x.id));
      return [...directPrev, ...extraUnpassed];
    }

    // Si es el nodo raíz sin aristas entrantes, buscar el nodo anterior en orden topológico
    const topo = topologicalTopics(db, t.subjectId);
    const idx = topo.findIndex((x) => x.id === topicId);
    if (idx > 0) return [topo[idx - 1]];
    return [];
  }

  if (unpassedAncestors.length > 0) {
    return unpassedAncestors.reverse();
  }

  return [];
}

// Siguientes nodos en el grafo DAG cuando el estudiante aprueba el quiz (score >= 51%):
// 1. Prioriza los nodos siguientes conectados directamente (topicId -> target) aún no aprobados.
// 2. Si ya están aprobados, devuelve los siguientes nodos directos conectados o el siguiente pendiente en orden topológico del grafo.
export function nextNodesInGraph(db, userId, topicId) {
  const t = db.topics.find((x) => x.id === topicId);
  if (!t) return [];
  const edges = edgesOf(db, t.subjectId);

  const directNext = edges
    .filter((e) => e.source === topicId)
    .map((e) => db.topics.find((x) => x.id === e.target))
    .filter(Boolean);

  const unpassedDirectNext = directNext.filter((node) => {
    const b = best(db, userId, node.id);
    return b === null || b < PASS;
  });

  if (unpassedDirectNext.length > 0) return unpassedDirectNext;
  if (directNext.length > 0) return directNext;

  // Si es un nodo hoja (sin flechas salientes), buscar el siguiente nodo aún no aprobado en el orden topológico del grafo
  const topo = topologicalTopics(db, t.subjectId);
  const unpassedTopo = topo.filter((node) => {
    if (node.id === topicId) return false;
    const b = best(db, userId, node.id);
    return b === null || b < PASS;
  });
  if (unpassedTopo.length > 0) return unpassedTopo.slice(0, 2);

  const idx = topo.findIndex((x) => x.id === topicId);
  if (idx >= 0 && idx + 1 < topo.length) return [topo[idx + 1]];

  return [];
}

export const heat = (db, sid) => {
  const ids = db.enrollments.filter((e) => e.subjectId === sid).map((e) => e.userId);
  return topicsOf(db, sid).map((t) => {
    const sc = ids.map((id) => best(db, id, t.id)).filter((v) => v !== null);
    return { ...t, n: sc.length, avg: sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : null, failing: sc.filter((v) => v < PASS).length };
  });
};

// Algoritmo de Kahn: true si el grafo no tiene ciclos
export function isDag(ids, pairs) {
  const indeg = Object.fromEntries(ids.map((i) => [i, 0])), out = {};
  for (const [a, b] of pairs) { indeg[b]++; (out[a] ||= []).push(b); }
  const q = ids.filter((i) => indeg[i] === 0);
  let seen = 0;
  while (q.length) { const n = q.shift(); seen++; for (const m of out[n] || []) if (--indeg[m] === 0) q.push(m); }
  return seen === ids.length;
}

// Generación de Quiz con IA conectada al Backend (/api/kmap/generate-ai)
// Lee los archivos que subió el docente en el tema y genera preguntas contextualizadas
export async function generateQuizAI(topicInput, n) {
  const isObj = typeof topicInput === 'object' && topicInput !== null;
  const payload = isObj
    ? { ...topicInput, count: n }
    : { topicName: topicInput, count: n };

  let res;
  try {
    res = await fetch('/api/kmap/generate-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('No se pudo conectar con el backend. Verifica que esté corriendo en el puerto 4000.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || `Error ${res.status} al generar con IA`);
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('La IA no devolvió preguntas.');
  }
  return data.questions;
}

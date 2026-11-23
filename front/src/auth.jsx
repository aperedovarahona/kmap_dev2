import { createContext, useContext, useState } from 'react';
import { getDb, update, uid, useDb } from './lib/db.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

function matchesUser(u, k, pass) {
  const validPasswords = [u.password, ...(u.altPasswords || [])].filter(Boolean);
  if (!validPasswords.includes(pass)) return false;
  const identifiers = [
    u.sis,
    u.email,
    ...(u.altEmails || []),
    u.name,
    u.username,
    u.carnet,
    u.role,
  ]
    .filter(Boolean)
    .map((x) => String(x).toLowerCase());
  return identifiers.includes(k);
}

export function AuthProvider({ children }) {
  const db = useDb();
  const [id, setId] = useState(localStorage.getItem('kmap_session'));
  const user = db.users.find((u) => u.id === id) || null;
  const start = (u) => {
    localStorage.setItem('kmap_session', u.id);
    setId(u.id);
    return u;
  };

  const login = (role, ident, pass) => {
    const k = (ident || '').trim().toLowerCase();
    const p = (pass || '').trim();
    if (!k || !p) throw new Error('Ingresa tu usuario y contraseña');

    // Buscar primero coincidencia con el rol seleccionado, y si no, cualquier usuario válido con esas credenciales
    let u =
      db.users.find((x) => x.role === role && matchesUser(x, k, p)) ||
      db.users.find((x) => matchesUser(x, k, p));

    if (!u) throw new Error('Credenciales incorrectas. Verifica tu usuario y contraseña.');
    return start(u);
  };

  const register = ({ name, sis, email, password, confirm }) => {
    if (!/^\d{6,}$/.test(sis)) throw new Error('El código SIS debe tener solo números (mínimo 6)');
    if (!/^[^@\s]+@est\.umss\.edu$/i.test(email))
      throw new Error('El correo debe terminar en @est.umss.edu');
    if (password.length < 6) throw new Error('La contraseña necesita al menos 6 caracteres');
    if (password !== confirm) throw new Error('Las contraseñas no coinciden');
    const d = getDb();
    if (
      d.users.some(
        (u) => u.sis === sis || u.email?.toLowerCase() === email.toLowerCase()
      )
    )
      throw new Error('Ese código SIS o correo ya está registrado');
    const u = { id: uid(), role: 'estudiante', name, sis, email, password };
    update((x) => {
      x.users.push(u);
    });
    return start(u);
  };

  const logout = () => {
    localStorage.removeItem('kmap_session');
    setId(null);
  };
  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
}

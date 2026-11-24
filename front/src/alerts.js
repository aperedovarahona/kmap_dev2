import Swal from 'sweetalert2';

// Todas las notificaciones y confirmaciones usan SweetAlert2 con la estética BIT ACADEMY (nunca alert/confirm/prompt)
const base = {
  background: '#061630',
  color: '#ffffff',
  confirmButtonColor: '#00d2ff',
  cancelButtonColor: '#1e3a5f',
};

export const ok = (title, text) =>
  Swal.fire({
    ...base,
    icon: 'success',
    title,
    text,
    timer: 1600,
    showConfirmButton: false,
  });

export const fail = (text) =>
  Swal.fire({
    ...base,
    icon: 'error',
    title: 'No se pudo completar',
    text,
  });

export const info = (title, html) =>
  Swal.fire({
    ...base,
    icon: 'info',
    title,
    html,
    confirmButtonText: 'Entendido',
  });

export const ask = async (title, text, confirmButtonText = 'Sí') =>
  (
    await Swal.fire({
      ...base,
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancelar',
    })
  ).isConfirmed;

export const askText = async (title, value = '') => {
  const r = await Swal.fire({
    ...base,
    title,
    input: 'text',
    inputValue: value,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    inputValidator: (v) => !v.trim() && 'Este campo es obligatorio',
  });
  return r.isConfirmed ? r.value.trim() : null;
};

export const askSubjectCode = async (subjectName, expectedCode) => {
  const r = await Swal.fire({
    ...base,
    title: `Matricularme en ${subjectName}`,
    html: `<p style="font-size:13px; color:#8ca5c9; margin-bottom:12px;">Ingresa el código de acceso de la materia:</p>`,
    input: 'text',
    inputPlaceholder: expectedCode ? `EJ. ${expectedCode}` : 'EJ. BDD3K9',
    showCancelButton: true,
    confirmButtonText: 'Confirmar matrícula ❯',
    cancelButtonText: 'Cancelar',
    inputValidator: (v) => {
      if (!v || !v.trim()) return 'Debes ingresar el código de la materia';
      if (expectedCode && v.trim().toUpperCase() !== expectedCode.toUpperCase()) {
        return `El código ingresado no coincide con ${subjectName}`;
      }
    },
  });
  return r.isConfirmed ? r.value.trim().toUpperCase() : null;
};

export { Swal, base };

export const askForm = async (title, fields, confirmButtonText = 'Guardar') => {
  const html = fields
    .map(
      (f) =>
        `<input id="f_${f.name}" class="swal2-input" placeholder="${f.label}" type="${
          f.type || 'text'
        }">`
    )
    .join('');
  const r = await Swal.fire({
    ...base,
    title,
    html,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    preConfirm: () => {
      const v = {};
      for (const f of fields) {
        v[f.name] = document.getElementById('f_' + f.name).value.trim();
        if (!v[f.name]) {
          Swal.showValidationMessage(`Falta: ${f.label}`);
          return false;
        }
      }
      return v;
    },
  });
  return r.isConfirmed ? r.value : null;
};

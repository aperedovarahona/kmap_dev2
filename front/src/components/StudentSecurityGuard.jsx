import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDb } from '../lib/db.js';

/**
 * Protección anti-copia, anti-click derecho y pantalla negra ante intentos de captura
 * para usuarios con rol "estudiante".
 * Permite activación/desactivación por materia configurada por el docente.
 */
export default function StudentSecurityGuard({ active }) {
  const shieldRef = useRef(null);
  const timerRef = useRef(null);
  const location = useLocation();
  const db = useDb();

  // Detectar si la materia en la que se encuentra el estudiante tiene anticopia desactivada
  let isSubjectAntiCopyDisabled = false;
  const match = location.pathname.match(/\/materia\/([^/]+)/);
  if (match && match[1]) {
    const subjectId = match[1];
    const sub = db?.subjects?.find((s) => String(s.id) === String(subjectId) || s.code === subjectId);
    if (sub && sub.antiCopy === false) {
      isSubjectAntiCopyDisabled = true;
    }
  }

  // La protección solo opera si active es true Y la materia no tiene el flag antiCopy desactivado
  const isGuardActive = Boolean(active && !isSubjectAntiCopyDisabled);

  useEffect(() => {
    if (!isGuardActive) {
      document.documentElement.classList.remove('kmap-student-guard');
      if (shieldRef.current) shieldRef.current.style.display = 'none';
      return;
    }

    document.documentElement.classList.add('kmap-student-guard');

    const showBlackout = (holdMs = 0) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (shieldRef.current) {
        shieldRef.current.style.display = 'flex';
      }
      if (holdMs > 0) {
        timerRef.current = setTimeout(() => {
          if (document.hasFocus() && !document.hidden && shieldRef.current) {
            shieldRef.current.style.display = 'none';
          }
          timerRef.current = null;
        }, holdMs);
      }
    };

    const hideBlackout = () => {
      if (timerRef.current) return;
      if (shieldRef.current) {
        shieldRef.current.style.display = 'none';
      }
    };

    const clearClipboard = () => {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText('').catch(() => {});
        }
      } catch {
        // Ignorar si el navegador restringe el acceso al portapapeles
      }
    };

    const blockEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const onSelectStart = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      return false;
    };

    const onKeyDown = (e) => {
      const key = String(e.key || '').toLowerCase();
      const code = String(e.code || '').toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // 1. Detectar PrintScreen o combinaciones de captura de pantalla (Win+Shift+S, Cmd+Shift+3/4/5)
      const isPrintScreen = key === 'printscreen' || code === 'printscreen' || e.keyCode === 44;
      const isOsCaptureCombo =
        (e.metaKey && e.shiftKey) ||
        (e.ctrlKey && e.shiftKey && key === 's') ||
        (e.altKey && isPrintScreen);

      if (isPrintScreen || isOsCaptureCombo) {
        e.preventDefault();
        e.stopPropagation();
        showBlackout(2500);
        clearClipboard();
        return false;
      }

      // 2. Bloquear copiar, pegar, cortar, seleccionar todo, imprimir, guardar, ver código fuente
      if (ctrlOrMeta && ['c', 'v', 'x', 'a', 'p', 's', 'u'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        if (key === 'p') showBlackout(2000);
        return false;
      }

      // 3. Bloquear herramientas de desarrollador (F12, Ctrl/Cmd+Shift+I/J/C/K)
      if (key === 'f12' || (ctrlOrMeta && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      return true;
    };

    const onKeyUp = (e) => {
      const key = String(e.key || '').toLowerCase();
      const code = String(e.code || '').toLowerCase();
      if (key === 'printscreen' || code === 'printscreen' || e.keyCode === 44) {
        e.preventDefault();
        showBlackout(2500);
        clearClipboard();
      }
    };

    const onBlur = (e) => {
      // Solo reaccionar cuando la VENTANA completa pierde el foco (NO al desenfocar botones/inputs al cambiar de página)
      if (e.target !== window) return;
      showBlackout(0);
    };

    const onFocus = (e) => {
      if (e.target !== window) return;
      if (!document.hidden) hideBlackout();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        showBlackout(0);
      } else if (document.hasFocus()) {
        hideBlackout();
      }
    };

    const onBeforePrint = () => {
      showBlackout(2500);
    };

    const onAfterPrint = () => {
      hideBlackout();
    };

    document.addEventListener('contextmenu', blockEvent, true);
    document.addEventListener('copy', blockEvent, true);
    document.addEventListener('cut', blockEvent, true);
    document.addEventListener('paste', blockEvent, true);
    document.addEventListener('dragstart', blockEvent, true);
    document.addEventListener('drop', blockEvent, true);
    document.addEventListener('selectstart', onSelectStart, true);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', onBlur, false);
    window.addEventListener('focus', onFocus, false);
    document.addEventListener('visibilitychange', onVisibilityChange, false);
    window.addEventListener('beforeprint', onBeforePrint, false);
    window.addEventListener('afterprint', onAfterPrint, false);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.documentElement.classList.remove('kmap-student-guard');
      document.removeEventListener('contextmenu', blockEvent, true);
      document.removeEventListener('copy', blockEvent, true);
      document.removeEventListener('cut', blockEvent, true);
      document.removeEventListener('paste', blockEvent, true);
      document.removeEventListener('dragstart', blockEvent, true);
      document.removeEventListener('drop', blockEvent, true);
      document.removeEventListener('selectstart', onSelectStart, true);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', onBlur, false);
      window.removeEventListener('focus', onFocus, false);
      document.removeEventListener('visibilitychange', onVisibilityChange, false);
      window.removeEventListener('beforeprint', onBeforePrint, false);
      window.removeEventListener('afterprint', onAfterPrint, false);
    };
  }, [isGuardActive]);

  if (!isGuardActive) return null;

  return (
    <>
      <style>{`
        html.kmap-student-guard,
        html.kmap-student-guard * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        html.kmap-student-guard input,
        html.kmap-student-guard textarea {
          -webkit-user-select: text !important;
          user-select: text !important;
        }
        @media print {
          html.kmap-student-guard,
          html.kmap-student-guard body {
            background: #000000 !important;
            color: #000000 !important;
          }
          html.kmap-student-guard #root {
            visibility: hidden !important;
            opacity: 0 !important;
          }
        }
      `}</style>

      {/* Cortina negra total ante intentos de captura de pantalla o pérdida de foco */}
      <div
        ref={shieldRef}
        onClick={() => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          if (shieldRef.current) shieldRef.current.style.display = 'none';
        }}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          zIndex: 2147483647,
          backgroundColor: '#000000',
          width: '100vw',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
        aria-hidden="true"
      />
    </>
  );
}

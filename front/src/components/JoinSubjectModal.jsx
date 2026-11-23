import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JoinSubjectModal({ isOpen, onClose, onJoin }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (isOpen) setCode('');
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onJoin(code.trim().toUpperCase());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="join-modal-card"
          >
            <div className="join-modal-glow" />
            
            <h2 className="join-modal-title">Únete a una nueva materia</h2>
            <p className="join-modal-desc">
              Ingresa el código de acceso proporcionado por tu docente para añadir la asignatura a tu ruta de aprendizaje.
            </p>

            <form onSubmit={handleSubmit} className="join-modal-form">
              <div className="join-input-wrapper">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="EJ. ALG8Q5"
                  className="join-modal-input"
                  autoFocus
                  maxLength={10}
                />
              </div>

              <div className="join-modal-actions">
                <button type="button" className="join-btn-cancel" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="join-btn-submit">
                  <span>Unirme ahora</span>
                  <span>❯</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
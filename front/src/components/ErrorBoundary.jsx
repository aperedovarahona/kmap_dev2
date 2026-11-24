import React from 'react';

/**
 * ErrorBoundary robusto para KMapGraph.
 * Evita que cualquier excepción de renderizado desmonte la app y deje solo el fondo.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[KMapGraph] Error capturado en render:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/panel';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 w-full min-h-[50vh] flex items-center justify-center p-6">
          <div
            className="max-w-md w-full p-6 rounded-2xl border text-center relative z-20 backdrop-blur-md"
            style={{
              background: 'rgba(6, 18, 38, 0.92)',
              borderColor: 'rgba(var(--primary-rgb), 0.4)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.7), 0 0 25px rgba(var(--primary-rgb), 0.3)',
            }}
          >
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-xl font-black text-white mb-2">
              Vista no disponible temporalmente
            </h2>
            <p className="text-xs text-blue-100/80 mb-5 leading-relaxed">
              Ocurrió un inconveniente al cargar los datos de esta sección. Puedes volver al panel principal de forma segura.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="btn py-2 px-5 text-xs font-bold"
              >
                Volver al Panel ❯
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

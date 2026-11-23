import RobotMascot from './RobotMascot';
import './RobotMascotStatic.css';

/**
 * Mascota decorativa para LandingPage.
 * Reutiliza el RobotMascot original en modo static.
 *
 * Requisito: RobotMascot.jsx debe implementar mode="static"
 * para desactivar sus efectos, mensajes y controles interactivos.
 */
export default function RobotMascotStatic({ size = 'xl', className = '' }) {
  return (
    <div className={`robot-mascot-static ${className}`.trim()} aria-hidden="true">
      <RobotMascot mode="static" size={size} coveringEyes={false} />
    </div>
  );
}

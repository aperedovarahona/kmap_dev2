import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Layout from './components/Layout.jsx';
import BackgroundWatermarks from './components/BackgroundWatermarks.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import StudentHome from './pages/StudentHome.jsx';
import StudentSubject from './pages/StudentSubject.jsx';
import StudentTopic from './pages/StudentTopic.jsx';
import Quiz from './pages/Quiz.jsx';
import TeacherHome from './pages/TeacherHome.jsx';
import TeacherSubject from './pages/TeacherSubject.jsx';
import AdminHome from './pages/AdminHome.jsx';
import LandingPage from './pages/LandingPage.jsx';
import StudentSecurityGuard from './components/StudentSecurityGuard.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <StudentSecurityGuard active={user?.role === 'estudiante'} />

      {/* Luces ambientales de fondo */}
      <div className="aurora-top-left" aria-hidden="true" />
      <div className="aurora-bottom-right" aria-hidden="true" />

      {/* Marcas de agua: BIT, Σ, π, { }, √x, A, 01 + marcos y órbitas */}
      <BackgroundWatermarks />

      <ErrorBoundary>
        <Routes>
          {/* 1. La LandingPage SIEMPRE se muestra primero en la raíz '/' */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Login: si el usuario ya está autenticado, va directo a /panel */}
          <Route
            path="/login"
            element={user ? <Navigate to="/panel" replace /> : <Login />}
          />

          {/* 3. Rutas privadas bajo Layout (protegidas) */}
          <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
            <Route
              path="/panel"
              element={
                user?.role === 'estudiante' ? (
                  <StudentHome />
                ) : user?.role === 'docente' ? (
                  <TeacherHome />
                ) : (
                  <AdminHome />
                )
              }
            />

            {user?.role === 'estudiante' && (
              <>
                <Route path="/materia/:id" element={<StudentSubject />} />
                <Route path="/materia/:id/tema/:tid" element={<StudentTopic />} />
                <Route path="/materia/:id/tema/:tid/quiz" element={<Quiz />} />
              </>
            )}

            {user?.role === 'docente' && (
              <Route path="/materia/:id" element={<TeacherSubject />} />
            )}

            <Route path="/perfil" element={<Profile />} />
          </Route>

          {/* Cualquier otra ruta manda a la LandingPage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import StudentHome from './pages/StudentHome.jsx';
import StudentSubject from './pages/StudentSubject.jsx';
import StudentTopic from './pages/StudentTopic.jsx';
import Quiz from './pages/Quiz.jsx';
import TeacherHome from './pages/TeacherHome.jsx';
import TeacherSubject from './pages/TeacherSubject.jsx';
import AdminHome from './pages/AdminHome.jsx';
import StudentSecurityGuard from './components/StudentSecurityGuard.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <StudentSecurityGuard active={user?.role === 'estudiante'} />

      {/* Luces ambientales de fondo */}
      <div className="aurora-top-left" aria-hidden="true" />
      <div className="aurora-bottom-right" aria-hidden="true" />

      <Routes>
        {/* 1. Login directo como página de inicio */}
        <Route
          path="/"
          element={user ? <Navigate to="/panel" replace /> : <Login />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/panel" replace /> : <Login />}
        />

        {/* 2. Rutas privadas bajo Layout (protegidas) */}
        <Route element={user ? <Layout /> : <Navigate to="/" replace />}>
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

        {/* Cualquier otra ruta redirige al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

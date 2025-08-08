
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

const Navigation = () => {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Ejada</Link>
                <div className="animate-pulse">Loading...</div>
            </header>
        );
    }
 
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Ejada</Link>
            <nav>
                {user ? (
                    <div className="flex items-center space-x-4">
                        <span>Welcome, {user.username} ({user.role})</span>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link to="/register" className="hover:underline">Register</Link>
                        <Link to="/login" className="hover:underline">Login</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};


const GenericDashboard = () => <div><h1 className="p-10 text-3xl">Welcome to Ejada</h1></div>;   


function App() {
  return (
    <Router>
        <Navigation />
        <main>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* --- Protected Routes --- */}
                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Teacher', 'Admin']}> {/* Admins can also see the teacher dash */}
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />
                
                {/* A default route for logged-in users */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                            <GenericDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </main>
    </Router>
  );
}

export default App;
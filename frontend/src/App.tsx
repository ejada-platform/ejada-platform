
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';


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

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="p-10">
            <h1 className="text-3xl">Dashboard</h1>
            <p>This is the main page for logged-in users.</p>
            {user && <pre className="mt-4 bg-gray-200 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>}
        </div>
    );
};

function App() {
  return (
    <Router>
        <Navigation />
        <main>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </main>
    </Router>
  );
}

export default App;
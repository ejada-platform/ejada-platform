// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import CreateAssignmentPage from './pages/teacher/CreateAssignmentPage';
import UserManagementPage from './pages/admin/UserManagementPage';

// Import all pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CurriculumPage from './pages/CurriculumPage';
import MyCirclesPage from './pages/MyCirclesPage'; // The new page
import CircleDetailPage from './pages/CircleDetailPage';
import CreateCirclePage from './pages/admin/CreateCirclePage';
import MyProgressPage from './pages/student/MyProgressPage';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// The Navigation Component
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
            <Link to="/" className="text-xl font-bold">Ejadah</Link>
            <nav>
                {user ? (
                    <div className="flex items-center space-x-4">
                         {user.role === 'Student' && (
                            <Link to="/my-progress" className="font-bold hover:underline">My Progress</Link>
                        )}
                         {user.role === 'Admin' && (
                            <>
                            <Link to="/admin/create-circle" className="font-bold hover:underline">Create Circle</Link>
                         <Link to="/admin/users" className="font-bold hover:underline">Manage Users</Link>
                            </>
                        )}
                        {(user.role === 'Teacher' || user.role === 'Admin') && (
                             <Link to="/teacher/create-assignment" className="font-bold hover:underline">Create Assignment</Link>
                        )}
                        {/* === NEW LINK ADDED HERE === */}
                        <Link to="/my-circles" className="hover:underline">My Circles</Link>
                        
                        {(user.role === 'Teacher' || user.role === 'Admin') && (
                            <Link to="/curriculum" className="hover:underline">Curriculum</Link>
                        )}
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

// Generic Dashboard Component
const GenericDashboard = () => <div><h1 className="p-10 text-3xl">Welcome to Ejada</h1></div>;   

// Main App Component
function App() {
  return (
    <Router>
        <Navigation />
        <main>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/create-circle" element={<CreateCirclePage />} />    
                 <Route
                    path="/teacher/create-assignment"
                    element={
                        <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
                            <CreateAssignmentPage />
                        </ProtectedRoute>
                    }
                />
                {/* --- Protected Routes --- */}
                {/* === NEW ROUTE ADDED HERE === */}
                <Route
                    path="/my-circles"
                    element={
                        <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                            <MyCirclesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/circle/:circleId"
                    element={
                        <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                            <CircleDetailPage />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/curriculum"
                    element={
                        <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
                            <CurriculumPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-progress"
                    element={
                        <ProtectedRoute allowedRoles={['Student']}>
                            <MyProgressPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
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
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <UserManagementPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </main>
    </Router>
  );
}

export default App;
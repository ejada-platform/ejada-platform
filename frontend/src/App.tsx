// src/App.tsx

import React, { useState } from 'react'; // Make sure useState is imported
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import all pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CurriculumPage from './pages/CurriculumPage';
import MyCirclesPage from './pages/MyCirclesPage';
import CircleDetailPage from './pages/CircleDetailPage';
import MyProgressPage from './pages/student/MyProgressPage';
import DigitalLibraryPage from './pages/admin/DigitalLibraryPage';
import MyWorkLogsPage from './pages/teacher/MyWorkLogsPage';
// Admin Pages
import CreateCirclePage from './pages/admin/CreateCirclePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ManageLibraryPage from './pages/admin/ManageLibraryPage';
import ManageBadgesPage from './pages/admin/ManageBadgesPage';
import EditCirclePage from './pages/teacher/EditCirclePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// Teacher Pages
import CreateAssignmentPage from './pages/teacher/CreateAssignmentPage';
import TakeAttendancePage from './pages/teacher/TakeAttendancePage';
// Import components
import ProtectedRoute from './components/ProtectedRoute';

// The New, Responsive Navigation Component
const Navigation = () => {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    // New state to control the mobile menu's visibility
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false); // Close menu on logout
        navigate('/login');
    };
    
    // Helper function to close the menu when a link is clicked
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    if (isLoading) {
        return (
            <header className="bg-gray-800 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold">Ejada</Link>
                    <div className="animate-pulse">Loading...</div>
                </div>
            </header>
        );
    }
 
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Ejadah</Link>

                {/* --- Desktop Menu (Visible on medium screens and up) --- */}
                <nav className="hidden md:flex items-center space-x-4">
                    <Link to="/library" className="hover:underline">Library</Link>
                    {user ? (
                        <>
                            {user.role === 'Student' && <Link to="/my-progress" className="font-bold hover:underline">My Progress</Link>}
                            {user.role === 'Admin' && <Link to="/admin/create-circle" className="hover:underline">Create Circle</Link>}
                            {user.role === 'Admin' && <Link to="/admin/users" className="hover:underline">Manage Users</Link>}
                            {user.role === 'Admin' && <Link to="/admin/library" className="hover:underline">Manage Library</Link>}
                            {user.role === 'Admin' && <Link to="/admin/badges" className="hover:underline">Manage Badges</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/create-assignment" className="hover:underline">Create Assignment</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/work-logs" className="font-bold hover:underline">My Work Logs</Link>}
                            <Link to="/my-circles" className="hover:underline">My Circles</Link>
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/curriculum" className="hover:underline">Curriculum</Link>}
                            <span className="text-gray-300">|</span>
                            <span className="font-semibold">Welcome, {user.username}</span>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="hover:underline">Register</Link>
                            <Link to="/login" className="hover:underline">Login</Link>
                        </>
                    )}
                </nav>

                {/* --- Hamburger Button (Visible on small screens) --- */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>

            {/* --- Mobile Menu (Dropdown) --- */}
            {isMobileMenuOpen && (
                <nav className="md:hidden mt-4 space-y-2">
                    <Link to="/library" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Library</Link>
                     {user ? (
                        <>
                            {user.role === 'Student' && <Link to="/my-progress" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded font-bold">My Progress</Link>}
                            {user.role === 'Admin' && <Link to="/admin/create-circle" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Create Circle</Link>}
                            {user.role === 'Admin' && <Link to="/admin/users" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Manage Users</Link>}
                            {user.role === 'Admin' && <Link to="/admin/library" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Manage Library</Link>}
                            {user.role === 'Admin' && <Link to="/admin/badges" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Manage Badges</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/create-assignment" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Create Assignment</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/work-logs" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded font-bold">My Work Logs</Link>}
                            <Link to="/my-circles" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">My Circles</Link>
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/curriculum" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Curriculum</Link>}
                            <div className="border-t border-gray-700 mt-2 pt-2">
                                <button onClick={handleLogout} className="w-full text-left bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/register" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Register</Link>
                            <Link to="/login" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">Login</Link>
                        </>
                    )}
                </nav>
            )}
        </header>
    );
};


// Generic Dashboard Component
const GenericDashboard = () => <div><h1 className="p-10 text-3xl">Welcome to Ejada</h1></div>;   
// ==================================================================
// === NEW COMPONENT TO ROUTE USERS AFTER LOGIN ===
// ==================================================================
const HomeRouter = () => {
    const { user } = useAuth();

    if (user?.role === 'Admin') {
        return <AdminDashboardPage />;
    }
    if (user?.role === 'Teacher') {
        return <TeacherDashboard />;
    }
    // Default to StudentDashboard for students or as a fallback
    return <StudentDashboard />;
};

// Main App Component with all Routes
function App() {
  return (
    <Router>
        <Navigation />
        <main>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                            <HomeRouter />
                        </ProtectedRoute>
                    }
                />


                {/* Public Routes */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/library" element={<DigitalLibraryPage />} />
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}><GenericDashboard /></ProtectedRoute>} />
                <Route path="/my-circles" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}><MyCirclesPage /></ProtectedRoute>} />
                <Route path="/circle/:circleId" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}><CircleDetailPage /></ProtectedRoute>} />
                <Route path="/curriculum" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><CurriculumPage /></ProtectedRoute>} />
                {/* Student Routes */}
                <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/my-progress" element={<ProtectedRoute allowedRoles={['Student']}><MyProgressPage /></ProtectedRoute>} />
                {/* Teacher Routes */}
                <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/teacher/create-assignment" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><CreateAssignmentPage /></ProtectedRoute>} />
                <Route path="/teacher/work-logs" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><MyWorkLogsPage /></ProtectedRoute>} />
                {/* Admin Routes */}
                 <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/admin/create-circle" element={<ProtectedRoute allowedRoles={['Admin']}><CreateCirclePage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><UserManagementPage /></ProtectedRoute>} />
                <Route path="/admin/library" element={<ProtectedRoute allowedRoles={['Admin']}><ManageLibraryPage /></ProtectedRoute>} />
                <Route path="/admin/badges" element={<ProtectedRoute allowedRoles={['Admin']}><ManageBadgesPage /></ProtectedRoute>} />
                <Route
                    path="/teacher/edit-circle/:circleId" // Dynamic route
                    element={
                        <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
                            <EditCirclePage />
                        </ProtectedRoute>
                    }
                />
                  <Route
                    path="/teacher/attendance/:circleId"
                    element={
                        <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
                            <TakeAttendancePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </main>
    </Router>
  );
}

export default App;
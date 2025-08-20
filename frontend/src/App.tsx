// src/App.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import all pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import CurriculumPage from './pages/CurriculumPage';
import MyCirclesPage from './pages/MyCirclesPage';
import CircleDetailPage from './pages/CircleDetailPage';
import MyProgressPage from './pages/student/MyProgressPage';
import DigitalLibraryPage from './pages/admin/DigitalLibraryPage';
import MyWorkLogsPage from './pages/teacher/MyWorkLogsPage';
import SupportPage from './pages/SupportPage';
import TutorialsPage from './pages/TutorialsPage';
import AcademicCalendarPage from './pages/AcademicCalendarPage'; 
import LandingPage from './pages/LandingPage';
// Admin Pages
import CreateCirclePage from './pages/admin/CreateCirclePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ManageLibraryPage from './pages/admin/ManageLibraryPage';
import ManageBadgesPage from './pages/admin/ManageBadgesPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// Teacher Pages
import EditCirclePage from './pages/teacher/EditCirclePage';
import CreateAssignmentPage from './pages/teacher/CreateAssignmentPage';
import TakeAttendancePage from './pages/teacher/TakeAttendancePage';
// Import components
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBell from './components/NotificationBell';
import ScrollToTopButton from './components/ScrollToTopButton';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// The Responsive Navigation Component
const Navigation = () => {
    const { t, i18n } = useTranslation(); 
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsMobileMenuOpen(false);
    };
    
    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };
    
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    if (isLoading) {
        return (
            <header className="bg-gray-800 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                     <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold">Ejadah</Link>
                    <div className="animate-pulse">Loading...</div>
                </div>
            </header>
        );
    }
 
    return (
        <header className="bg-gray-800 text-white p-4 sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Ejadah</Link>

                <nav className="hidden md:flex items-center space-x-4">
                    
                    <Link to="/calendar" className="hover:underline">{t('Calendar')}</Link>
                    <Link to="/library" className="hover:underline">{t('library')}</Link>
                    <Link to="/support" className="hover:underline">{t('Support')}</Link>
                    <Link to="/tutorials" className="hover:underline">{t('Tutorials')}</Link>
                    {user ? (
                        <>
                            {user.role === 'Student' && <Link to="/my-progress" className="font-bold hover:underline">{t('my_progress')}</Link>}
                            {(user.role === 'Student' || user.role === 'Teacher') && <Link to="/my-circles" className="hover:underline">{t('my_circles')}</Link>}
                            {user.role === 'Admin' && <Link to="/admin/create-circle" className="hover:underline">{t('create_circle')}</Link>}
                            {user.role === 'Admin' && <Link to="/admin/users" className="hover:underline">{t('manage_users')}</Link>}
                            {user.role === 'Admin' && <Link to="/admin/library" className="hover:underline">{t('manage_library')}</Link>}
                            {user.role === 'Admin' && <Link to="/admin/badges" className="hover:underline">{t('manage_badges')}</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/create-assignment" className="hover:underline">{t('create_assignment')}</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/work-logs" className="font-bold hover:underline">{t('my_work_logs')}</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/curriculum" className="hover:underline">{t('curriculum')}</Link>}
                            <span className="text-gray-300">|</span>
                            <span className="font-semibold">{t('welcome_user', { username: user.username })}</span>
                            <NotificationBell />
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{t('logout')}</button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="hover:underline">{t('register')}</Link>
                            <Link to="/login" className="hover:underline">{t('login')}</Link>
                        </>
                    )}
                     <div className="ml-4 border-l pl-4 border-gray-600">
                        <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-sm rounded ${i18n.language.startsWith('en') ? 'bg-white text-gray-800' : ''}`}>EN</button>
                        <button onClick={() => changeLanguage('ar')} className={`px-2 py-1 text-sm rounded ${i18n.language === 'ar' ? 'bg-white text-gray-800' : ''}`}>AR</button>
                    </div>
                </nav>

                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <nav className="md:hidden mt-4 space-y-2">
                    {/* --- THIS IS THE CORRECTED MOBILE MENU --- */}
                    <Link to="/calendar" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('Calendar')}</Link>
                    <Link to="/library" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('library')}</Link>
                    <Link to="/support" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('Support')}</Link>
                    <Link to="/tutorials" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('Tutorials')}</Link>
                     
                     {user ? (
                        <>
                            {user.role === 'Student' && <Link to="/my-progress" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded font-bold">{t('my_progress')}</Link>}
                            {(user.role === 'Student' || user.role === 'Teacher') && <Link to="/my-circles" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('my_circles')}</Link>}
                            
                            {user.role === 'Admin' && <Link to="/admin/create-circle" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('create_circle')}</Link>}
                            {user.role === 'Admin' && <Link to="/admin/users" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('manage_users')}</Link>}
                            {user.role === 'Admin' && <Link to="/admin/library" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('manage_library')}</Link>}
                            {user.role === 'Admin' && <Link to="/admin/badges" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('manage_badges')}</Link>}
                            
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/create-assignment" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('create_assignment')}</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/work-logs" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded font-bold">{t('my_work_logs')}</Link>}
                            {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/curriculum" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('curriculum')}</Link>}
                            
                            <div className="border-t border-gray-700 mt-2 pt-2">
                                <button onClick={handleLogout} className="w-full text-left bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{t('logout')}</button>
                            </div>
                        </>
                    ) : (
                        <div className="border-t border-gray-700 mt-2 pt-2">
                            <Link to="/register" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('register')}</Link>
                            <Link to="/login" onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{t('login')}</Link>
                        </div>
                    )}
                     <div className="border-t border-gray-700 mt-2 pt-2 flex justify-center space-x-2">
                        <button onClick={() => changeLanguage('en')} className={`px-4 py-2 text-sm rounded ${i18n.language.startsWith('en') ? 'bg-white text-gray-800' : ''}`}>EN</button>
                        <button onClick={() => changeLanguage('ar')} className={`px-4 py-2 text-sm rounded ${i18n.language === 'ar' ? 'bg-white text-gray-800' : ''}`}>AR</button>
                    </div>
                </nav>
            )}
        </header>
    );
};

// Component to route users to their correct dashboard after login
const HomeRouter = () => {
    const { user } = useAuth();
    if (user?.role === 'Admin') return <AdminDashboardPage />;
    if (user?.role === 'Teacher') return <TeacherDashboard />;
    if (user?.role === 'Parent') return <ParentDashboardPage />;
    return <StudentDashboard />;
};

// Main App Component with all Routes
function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const documentDirection = i18n.dir(i18n.language);
    document.documentElement.dir = documentDirection;
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return (
    <Router>
        <Navigation />
        <main>
            <Routes>
                {/* Public Routes */}
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/library" element={<DigitalLibraryPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/tutorials" element={<TutorialsPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin', 'Parent']}><HomeRouter /></ProtectedRoute>} />
                <Route path="/my-circles" element={<ProtectedRoute allowedRoles={['Student', 'Teacher']}><MyCirclesPage /></ProtectedRoute>} />
                <Route path="/circle/:circleId" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}><CircleDetailPage /></ProtectedRoute>} />
                <Route path="/curriculum" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><CurriculumPage /></ProtectedRoute>} />
                
                {/* User-Specific Routes */}
                <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/my-progress" element={<ProtectedRoute allowedRoles={['Student']}><MyProgressPage /></ProtectedRoute>} />
                <Route path="/parent-dashboard" element={<ProtectedRoute allowedRoles={['Parent']}><ParentDashboardPage /></ProtectedRoute>} />
                <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/teacher/create-assignment" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><CreateAssignmentPage /></ProtectedRoute>} />
                <Route path="/teacher/work-logs" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><MyWorkLogsPage /></ProtectedRoute>} />
                <Route path="/teacher/edit-circle/:circleId" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><EditCirclePage /></ProtectedRoute>} />
                <Route path="/teacher/attendance/:circleId" element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><TakeAttendancePage /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin', 'Parent']}><HomeRouter /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/create-circle" element={<ProtectedRoute allowedRoles={['Admin']}><CreateCirclePage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><UserManagementPage /></ProtectedRoute>} />
                <Route path="/admin/library" element={<ProtectedRoute allowedRoles={['Admin']}><ManageLibraryPage /></ProtectedRoute>} />
                <Route path="/admin/badges" element={<ProtectedRoute allowedRoles={['Admin']}><ManageBadgesPage /></ProtectedRoute>} />
                <Route path="/calendar" element={<AcademicCalendarPage />} />

            </Routes>
        </main>
         <ScrollToTopButton />
    </Router>
  );
}

export default App;
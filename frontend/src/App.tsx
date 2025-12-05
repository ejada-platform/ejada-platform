import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSun, faMoon, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';


// Import all pages
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
import EnrollmentPage from './pages/EnrollmentPage';
import ApplicationReviewPage from './pages/admin/ApplicationReviewPage';
// Admin Pages
import CreateCirclePage from './pages/admin/CreateCirclePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ManageLibraryPage from './pages/admin/ManageLibraryPage';
import ManageBadgesPage from './pages/admin/ManageBadgesPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AttendanceHistoryPage from './pages/admin/AttendanceHistoryPage';
import AttendanceOverviewPage from './pages/teacher/AttendanceOverviewPage';
import TeacherAttendancePage from './pages/teacher/TeacherAttendancePage';

import EditCirclePage from './pages/teacher/EditCirclePage';
import CreateAssignmentPage from './pages/teacher/CreateAssignmentPage';
import BookViewerPage from './pages/BookViewerPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';

import ProtectedRoute from './components/ProtectedRoute';
import NotificationBell from './components/NotificationBell';
import ScrollToTopButton from './components/ScrollToTopButton';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PayrollPage from './pages/admin/PayrollPage';
import ManageTemplatesPage from './pages/admin/ManageTemplatesPage';
import CurriculumBuilderPage from './pages/admin/CurriculumBuilderPage';
import StudentProgressPage from './pages/teacher/StudentProgressPage';


// --- 1. LANGUAGE & THEME SWITCHER COMPONENT (Ensures consistent inclusion) ---
const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="text-xl">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
    );
};

const LanguageThemeBox = ({ i18n, changeLanguage }: { i18n: any, changeLanguage: (lng: string) => void }) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex items-center space-x-2">
            <div className="border-r pr-2 border-gray-300">
                <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-sm rounded ${i18n.language.startsWith('en') ? 'bg-gray-200 text-gray-800' : 'hover:bg-gray-100'}`}>EN</button>
                <button onClick={() => changeLanguage('ar')} className={`px-2 py-1 text-sm rounded ${i18n.language === 'ar' ? 'bg-gray-200 text-gray-800' : 'hover:bg-gray-100'}`}>AR</button>
            </div>
            <ThemeSwitcher />
        </div>
    );
};

// --- 2. PUBLIC/LANDING PAGE FLOATING HEADER ---
const PublicHeaderContent = ({ changeLanguage, i18n }: { changeLanguage: (lng: string) => void, i18n: any }) => {
    const { t } = useTranslation();

    const imageNavLinks = [
        { href: "/", label: t('Home'), isHome: true },
        { href: "/#vision", label: t('Who we are') }, 
        { href: "/#programs", label: t('Educational courses') }, 
        { href: "/#gallery", label: t('Visuals') }, 
        { href: "/enroll", label: t('Our applications') }, 
       // { href: "/library", label: t('Our publications') },
       // { href: "/#projects", label: t('Our projects') }, 
    ];

    return (
        // The main container for the floating, rounded bar
        <div className="max-w-[1200px] mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex justify-between items-center w-full">
                
                {/* 1. Log In Button */}
                <Link 
                    to="/login" 
                    className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    <FontAwesomeIcon icon={faArrowRightToBracket} className="mr-2" />
                    <span className="text-lg">{t('Log In')}</span>
                </Link>

                {/* 2. Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-6 text-base font-serif text-gray-800">
                    {imageNavLinks.map((item, index) => {
                        const className = item.isHome ? "font-bold text-blue-700 pb-1 border-b-2 border-blue-700" : "hover:text-blue-700 transition-colors";
                        
                        return item.href.startsWith('/#') || item.isHome ? 
                            <a key={index} href={item.href} className={className}>
                                {item.label}
                            </a>
                            :
                            <Link key={index} to={item.href} className={className}>
                                {item.label}
                            </Link>;
                    })}
                </nav>

                {/* 3. Language & Theme Switcher */}
                <LanguageThemeBox i18n={i18n} changeLanguage={changeLanguage} />
            </div>
        </div>
    );
};


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

    // Define the protected links
    const protectedLinks = [
        { to: "/calendar", label: t('Calendar') },
        { to: "/library", label: t('library') },
        { to: "/support", label: t('Support') },
        { to: "/tutorials", label: t('Tutorials') },
    ];


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
    
    // --- CONDITIONALLY RENDER THE PUBLIC OR PROTECTED HEADER ---
    if (!user) {
        return (
            // Stick to top, but add padding to create the 'separation' effect
            <header className="fixed top-0 left-0 w-full z-50 pt-6"> 
                <PublicHeaderContent changeLanguage={changeLanguage} i18n={i18n} />
            </header>
        );
    }

    // --- PROTECTED HEADER (FULL WIDTH) ---
    return (
        <header className="bg-[#375466] text-white p-4 sticky top-0 z-50 w-full shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold">
                    Ejadah
                </Link>

                {/* --- DESKTOP NAVIGATION --- */}
                <nav className="hidden md:flex items-center space-x-4 flex-wrap justify-end">
                    
                    {/* Common Links */}
                    {protectedLinks.map(item => (
                        <Link key={item.to} to={item.to} className="hover:underline">{item.label}</Link>
                    ))}

                    {/* User Role Specific Links */}
                    {user.role === 'Student' && <Link to="/my-progress" className="font-bold hover:underline">{t('my_progress')}</Link>}
                    {(user.role === 'Student' || user.role === 'Teacher') && <Link to="/my-circles" className="hover:underline">{t('my_circles')}</Link>}
                   
                    {/* Admin Links */}
                    {user.role === 'Admin' && (<Link to="/admin/users" className="hover:underline">{t('manage_users')}</Link>)}
                    {user.role === 'Admin' && (<Link to="/admin/applications" className="font-bold hover:underline">{t('review_applications')}</Link>)}
                    
                    {/* Teacher Links */}
                    {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/create-assignment" className="hover:underline">{t('create_assignment')}</Link>}
                    {(user.role === 'Teacher' || user.role === 'Admin') && <Link to="/teacher/work-logs" className="font-bold hover:underline">{t('my_work_logs')}</Link>}
                    
                    {/* Logout */}
                    <span className="text-gray-300">|</span>
                    <span className="font-semibold">{t('welcome_user', { username: user.username })}</span>
                    <NotificationBell />
                    <button onClick={handleLogout} className="bg-[#ada687] hover:bg-[#ada687] text-white font-bold py-2 px-4 rounded">{t('logout')}</button>
                    
                    {/* Language & Theme Switcher (MUST BE VISIBLE) */}
                    <div className="ml-4 text-white">
                        <LanguageThemeBox i18n={i18n} changeLanguage={changeLanguage} />
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content (Simplified) */}
            {isMobileMenuOpen && (
                 <nav className="md:hidden mt-4 space-y-2">
                    {protectedLinks.map(item => (
                        <Link key={item.to} to={item.to} onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 rounded">{item.label}</Link>
                    ))}
                    <div className="border-t border-gray-700 mt-2 pt-2">
                        <button onClick={handleLogout} className="w-full text-left bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{t('logout')}</button>
                    </div>
                    {/* Language/Theme for Mobile */}
                    <div className="pt-2 flex justify-center text-white">
                        <LanguageThemeBox i18n={i18n} changeLanguage={changeLanguage} />
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/enroll" element={<EnrollmentPage />} />
                <Route path="/library" element={<DigitalLibraryPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/tutorials" element={<TutorialsPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin', 'Parent']}><HomeRouter /></ProtectedRoute>} />
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
                <Route path="/teacher/attendance/:circleId"  element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><TeacherAttendancePage /></ProtectedRoute>}/>
                
                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/create-circle" element={<ProtectedRoute allowedRoles={['Admin']}><CreateCirclePage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><UserManagementPage /></ProtectedRoute>} />
                <Route path="/admin/library" element={<ProtectedRoute allowedRoles={['Admin']}><ManageLibraryPage /></ProtectedRoute>} />
                <Route path="/admin/badges" element={<ProtectedRoute allowedRoles={['Admin']}><ManageBadgesPage /></ProtectedRoute>} />
                <Route path="/calendar" element={<AcademicCalendarPage />} />
                <Route path="/admin/attendance-overview" element={<ProtectedRoute allowedRoles={['Admin']}><AttendanceOverviewPage /></ProtectedRoute>}/>
                <Route path="/admin/attendance/:circleId" element={<ProtectedRoute allowedRoles={['Admin']}><AttendanceHistoryPage /></ProtectedRoute>}/>
                <Route path="/admin/applications" element={<ProtectedRoute allowedRoles={['Admin']}><ApplicationReviewPage /></ProtectedRoute>}/>
                <Route path="/library/view" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin', 'Parent']}><BookViewerPage /></ProtectedRoute>}/>
                <Route path="/admin/payroll" element={<ProtectedRoute allowedRoles={['Admin']}><PayrollPage /> </ProtectedRoute>}/>
                <Route path="/admin/templates" element={<ProtectedRoute allowedRoles={['Admin']}><ManageTemplatesPage /></ProtectedRoute>}/>
                <Route path="/checkout-success" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin', 'Parent']}><CheckoutSuccessPage /></ProtectedRoute>}/>
                <Route path="/admin/curriculum-builder" element={<ProtectedRoute allowedRoles={['Admin']}><CurriculumBuilderPage /></ProtectedRoute>}/>
                <Route path="/teacher/student-progress/:studentId"  element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']}><StudentProgressPage /></ProtectedRoute>}/>   
                
                {/* Catch-all for protected routes that should default to HomeRouter */}
                <Route path="*" element={<ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin', 'Parent']}><HomeRouter /></ProtectedRoute>} />
            </Routes>
        </main>
         <ScrollToTopButton />
    </Router>
  );
}

export default App;
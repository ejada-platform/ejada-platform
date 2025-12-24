import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faArrowRightToBracket, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

// [ ... Import all pages ... ]
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


// --- LANGUAGE SWITCHER COMPONENT (Simplified) ---
const LanguageSwitcher = ({ i18n, changeLanguage }: { i18n: any, changeLanguage: (lng: string) => void }) => {
    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-sm rounded ${i18n.language.startsWith('en') ? 'bg-gray-200 text-gray-800' : 'text-white hover:bg-gray-700'}`}>EN</button>
            <span className="text-gray-400">|</span>
            <button onClick={() => changeLanguage('ar')} className={`px-2 py-1 text-sm rounded ${i18n.language === 'ar' ? 'bg-gray-200 text-gray-800' : 'text-white hover:bg-gray-700'}`}>AR</button>
        </div>
    );
};

// --- PUBLIC/LANDING PAGE FLOATING HEADER ---
const PublicHeaderContent = ({ changeLanguage, i18n }: { changeLanguage: (lng: string) => void, i18n: any }) => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dir = i18n.dir();

    const imageNavLinks = [
        { href: "/", label: t('navigation.home'), isHome: true },
        { href: "/#vision", label: t('navigation.who_we_are') }, 
        { href: "/#programs", label: t('navigation.educational_courses') }, 
        { href: "/#gallery", label: t('navigation.visuals') }, 
        { href: "/enroll", label: t('navigation.our_applications') }, 
    ];

    return (
        <div className="max-w-[1200px] mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex justify-between items-center w-full">
                
                {/* 1. Log In Button */}
                <Link 
                    to="/login" 
                    className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse' : 'space-x-2'} bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors`}
                >
                    <FontAwesomeIcon icon={faArrowRightToBracket} className="mr-2" />
                    <span className="text-lg">{t('navigation.login')}</span>
                </Link>

                {/* 2. Navigation Links (Desktop) */}
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
                
                {/* 3. Mobile Menu Toggle */}
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-gray-800" />
                </button>

                {/* 4. Language Switcher (Desktop - Dark text version for white bg) */}
                <div className="hidden lg:block text-gray-800">
                     <div className="flex items-center space-x-2">
                        <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-sm rounded ${i18n.language.startsWith('en') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}>EN</button>
                        <span>|</span>
                        <button onClick={() => changeLanguage('ar')} className={`px-2 py-1 text-sm rounded ${i18n.language === 'ar' ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}>AR</button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMenuOpen && (
                <div className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-full h-screen bg-gray-900 bg-opacity-95 z-50 p-8 pt-20`}>
                    <button className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-white text-2xl`} onClick={() => setIsMenuOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <nav className="flex flex-col space-y-6 text-xl text-white text-center">
                        {imageNavLinks.map((item, index) => (
                            <Link 
                                key={index} 
                                to={item.href.startsWith('/#') || item.isHome ? item.href : item.href} 
                                onClick={() => setIsMenuOpen(false)}
                                className="hover:text-blue-400"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link 
                            to="/login" 
                            onClick={() => setIsMenuOpen(false)}
                            className="pt-4 border-t border-gray-700 mt-6 text-blue-400"
                        >
                            {t('navigation.login')}
                        </Link>
                         <div className="pt-4 flex justify-center">
                            <LanguageSwitcher i18n={i18n} changeLanguage={changeLanguage} />
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
};


// The Responsive Navigation Component (Protected Header)
const Navigation = () => {
    const { t, i18n } = useTranslation();
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dir = i18n.dir();

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

    // Define the common protected links
    const protectedLinks = [
        { to: "/calendar", label: t('navigation.calendar') },
        { to: "/library", label: t('navigation.library') },
        { to: "/support", label: t('navigation.support') },
        { to: "/tutorials", label: t('navigation.tutorials') },
    ];
    
    // --- CONSTRUCT THE FULL PROTECTED MENU LINKS ---
    const allProtectedLinks = [
        ...protectedLinks,
        ...(user?.role === 'Student' ? [{ to: "/my-progress", label: t('navigation.my_progress') }] : []),
        ...(user?.role === 'Student' || user?.role === 'Teacher' ? [{ to: "/my-circles", label: t('navigation.my_circles') }] : []),
        ...(user?.role === 'Admin' ? [{ to: "/admin/users", label: t('navigation.manage_users') }] : []),
        ...(user?.role === 'Admin' ? [{ to: "/admin/applications", label: t('navigation.review_applications') }] : []),
        ...(user?.role === 'Teacher' || user?.role === 'Admin' ? [{ to: "/teacher/create-assignment", label: t('navigation.create_assignment') }] : []),
        ...(user?.role === 'Teacher' || user?.role === 'Admin' ? [{ to: "/teacher/work-logs", label: t('navigation.my_work_logs') }] : []),
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
                    
                    {/* All Links (Desktop) */}
                    {allProtectedLinks.map(item => (
                        <Link key={item.to} to={item.to} className="hover:underline">{item.label}</Link>
                    ))}
                    
                    {/* Separator, Welcome, Bell, Logout */}
                    <span className="text-gray-300">|</span>
                    <span className="font-semibold">{t('navigation.welcome_user', { username: user.username })}</span>
                    <NotificationBell />
                    <button onClick={handleLogout} className="bg-[#ada687] hover:bg-[#ada687] text-white font-bold py-2 px-4 rounded">{t('navigation.logout')}</button>
                    
                    {/* Language Switcher (Desktop) */}
                    <div className="ml-4 text-white">
                        <LanguageSwitcher i18n={i18n} changeLanguage={changeLanguage} />
                    </div>
                </nav>

                {/* Mobile Menu Toggle (Hamburger) */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content (Hamburger Dropdown) */}
            {isMobileMenuOpen && (
                 <nav className="md:hidden absolute top-full left-0 w-full bg-[#375466] shadow-xl p-4 z-40 space-y-3">
                    {/* Welcome User and Bell */}
                    <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                        <span className="font-semibold">{t('navigation.welcome_user', { username: user.username })}</span>
                        <NotificationBell />
                    </div>

                    {/* All Links */}
                    {allProtectedLinks.map(item => (
                        <Link key={item.to} to={item.to} onClick={handleLinkClick} className="block px-2 py-2 hover:bg-gray-700 rounded transition-colors">
                            {item.label}
                        </Link>
                    ))}
                    
                    {/* Logout and Language */}
                    <div className="border-t border-gray-700 mt-2 pt-4 flex flex-col space-y-4">
                        <button onClick={handleLogout} className="w-full text-left bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                            {t('navigation.logout')}
                        </button>
                        <div className="pt-2 flex justify-start text-white">
                            <LanguageSwitcher i18n={i18n} changeLanguage={changeLanguage} />
                        </div>
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

  // Effect only for I18N/RTL (Theme logic removed)
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
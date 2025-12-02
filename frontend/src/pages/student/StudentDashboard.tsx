import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
//import StarStudent from '../../components/StartStudent'; 
import { useTranslation } from 'react-i18next';

const StudentDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
       <div className="p-10 bg-blue-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* <StarStudent /> */}

                <h1 className="text-3xl font-bold text-blue-800 mt-6">{t('student_dashboard.title')}</h1>
                <p className="mt-2">{t('student_dashboard.welcome_message', { username: user?.username })}</p>

                {/* {user && user.isFeatured && (
                //    <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                //        <p className="font-bold">{t('student_dashboard.star_student_banner.congratulations', { username: user.username })}</p>
                //        <p>{t('student_dashboard.star_student_banner.message')}</p>
                //    </div>
                //)} */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* 1. Link to My Circles (The Fix!) */}
                    <Link 
                        to="/my-circles" 
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-indigo-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <svg className="w-10 h-10 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('my_circles')}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('student_dashboard.circles_cta') || 'View assignments and lessons.'}</p>
                    </Link>
                    
                    {/* 2. Link to My Progress */}
                    <Link 
                        to="/my-progress" 
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <svg className="w-10 h-10 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v14M3 19l3-2m-3 2v-2.75a1 1 0 011-1h16a1 1 0 011 1V19"></path></svg>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('my_progress')}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('student_dashboard.progress_cta') || 'Track your achievements and grades.'}</p>
                    </Link>

                    {/* 3. Link to Digital Library */}
                    <Link 
                        to="/library" 
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-yellow-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                         <svg className="w-10 h-10 text-yellow-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.49 10.04 5 9 5c-2.485 0-4.5 2.015-4.5 4.5S6.515 14 9 14c1.04 0 1.832-.49 2.8-.753M12 6.253C13.168 5.49 13.96 5 15 5c2.485 0 4.5 2.015 4.5 4.5S17.485 14 15 14c-1.04 0-1.832-.49-2.8-.753m0 0v-2.493"></path></svg>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('library')}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('student_dashboard.library_cta') || 'Explore our digital collection.'}</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
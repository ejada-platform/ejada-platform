// src/pages/TeacherDashboard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StarStudent from '../../components/StartStudent';
import { useTranslation } from 'react-i18next';
const TeacherDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <div className="p-10 bg-green-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <StarStudent /> 
            <h1 className="text-3xl font-bold text-green-800">Teacher Dashboard</h1>
           {t('teacher_dashboard.welcome_message', { username: user?.username })}
            </div>
             {/* 
                  ====================================================
                  >>> CRITICAL ADDITION: Dashboard Cards/Links <<<
                  ====================================================
                */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* 1. Link to My Circles (View/Manage Class Details, Attendance, Students) */}
                    <Link 
                        to="/my-circles" 
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-indigo-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <svg className="w-10 h-10 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('my_circles')}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('teacher_dashboard.circles_cta') || 'Manage circles, students, and attendance.'}</p>
                    </Link>
                    
                    {/* 2. Link to Create Assignment */}
                    <Link 
                        to="/teacher/create-assignment" 
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-red-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <svg className="w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('create_assignment')}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('teacher_dashboard.assignment_cta') || 'Create, view, and grade student work.'}</p>
                    </Link>

                    {/* 3. Link to My Work Logs */}
                    <Link 
                        to="/teacher/work-logs" 
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <svg className="w-10 h-10 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('my_work_logs')}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('teacher_dashboard.logs_cta') || 'Log hours and activities.'}</p>
                    </Link>
                    
                    {/* 4. Link to Curriculum (Optional - use Admin role check if needed) */}
                    {(user?.role === 'Teacher' || user?.role === 'Admin') && (
                        <Link 
                            to="/curriculum" 
                            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-yellow-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <svg className="w-10 h-10 text-yellow-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.49 10.04 5 9 5c-2.485 0-4.5 2.015-4.5 4.5S6.515 14 9 14c1.04 0 1.832-.49 2.8-.753M12 6.253C13.168 5.49 13.96 5 15 5c2.485 0 4.5 2.015 4.5 4.5S17.485 14 15 14c-1.04 0-1.832-.49-2.8-.753m0 0v-2.493"></path></svg>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('curriculum')}</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('teacher_dashboard.curriculum_cta') || 'View the lesson plan.'}</p>
                        </Link>
                    )}
                    
                </div>
        </div>
    );
};

export default TeacherDashboard;
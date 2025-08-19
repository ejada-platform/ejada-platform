// src/pages/student/StudentDashboard.tsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StarStudent from '../../components/StartStudent'; // Make sure this path is correct
import { useTranslation } from 'react-i18next';

const StudentDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
       <div className="p-10 bg-blue-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <StarStudent />

                <h1 className="text-3xl font-bold text-blue-800 mt-6">{t('student_dashboard.title')}</h1>
                <p className="mt-2">{t('student_dashboard.welcome_message', { username: user?.username })}</p>

                {user && user.isFeatured && (
                    <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                        <p className="font-bold">{t('student_dashboard.star_student_banner.congratulations', { username: user.username })}</p>
                        <p>{t('student_dashboard.star_student_banner.message')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
// src/pages/TeacherDashboard.tsx

import React from 'react';
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
        </div>
    );
};

export default TeacherDashboard;
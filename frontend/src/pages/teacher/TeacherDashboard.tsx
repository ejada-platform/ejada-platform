// src/pages/TeacherDashboard.tsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StarStudent from '../../components/StartStudent';

const TeacherDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-10 bg-green-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <StarStudent /> 
            <h1 className="text-3xl font-bold text-green-800">Teacher Dashboard</h1>
            <p className="mt-2">Welcome, {user?.username}! This is where you will manage your students and lessons.</p>
        </div>
        </div>
    );
};

export default TeacherDashboard;
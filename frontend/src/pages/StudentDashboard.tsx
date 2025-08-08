// src/pages/StudentDashboard.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-10 bg-blue-50 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-800">Student Dashboard</h1>
            <p className="mt-2">Welcome, {user?.username}! This is where you will see your lessons and progress.</p>
        </div>
    );
};

export default StudentDashboard;
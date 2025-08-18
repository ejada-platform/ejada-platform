// src/pages/student/StudentDashboard.tsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StarStudent from '../../components/StartStudent'; // Make sure this path is correct

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-10 bg-blue-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* This component will show the banner to ALL students, including the one who is featured */}
                <StarStudent />

                <h1 className="text-3xl font-bold text-blue-800 mt-6">Student Dashboard</h1>
                <p className="mt-2">Welcome, {user?.username}! This is your personal dashboard.</p>

                {/* We can also add a special message if the LOGGED IN user is the star */}
                {user && user.isFeatured && (
                    <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                        <p className="font-bold">Congratulations, {user.username}!</p>
                        <p>You have been selected as the Star Student of the Month!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
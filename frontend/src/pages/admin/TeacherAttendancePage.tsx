// src/pages/admin/TeacherAttendancePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth, type User } from '../../context/AuthContext';

interface CircleForAdmin {
    _id: string;
    name: string;
    teacher: User;
}

const TeacherAttendancePage = () => {
    const { token } = useAuth();
    const [circles, setCircles] = useState<CircleForAdmin[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllCircles = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<CircleForAdmin[]>('http://localhost:5000/api/circles/all', config);
            setCircles(data);
        } catch (error) {
            console.error("Failed to fetch circles", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAllCircles();
    }, [fetchAllCircles]);

    if (loading) return <div className="p-8">Loading Platform Data...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Teacher Attendance Overview</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="py-2">Circle Name</th>
                            <th className="py-2">Assigned Teacher</th>
                            <th className="py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {circles.map(circle => (
                            <tr key={circle._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 font-semibold">{circle.name}</td>
                                <td>{circle.teacher.username}</td>
                                <td className="py-2 text-right">
                                    <Link 
                                        to={`/admin/attendance/${circle._id}`}
                                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                    >
                                        View History
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherAttendancePage;
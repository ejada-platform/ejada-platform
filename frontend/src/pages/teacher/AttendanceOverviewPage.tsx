// src/pages/admin/AttendanceOverviewPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth, type User } from '../../context/AuthContext';

interface CircleForAdmin {
    _id: string;
    name: string;
    teacher: User;
}

interface AttendanceRecord {
    circle: string;
    date: string;
}

const AttendanceOverviewPage = () => {
    const { token } = useAuth();
    const [circles, setCircles] = useState<CircleForAdmin[]>([]);
    const [latestAttendanceMap, setLatestAttendanceMap] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllData = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const circlesPromise = axios.get<CircleForAdmin[]>('http://localhost:5000/api/circles/all', config);
            const attendancePromise = axios.get<AttendanceRecord[]>('http://localhost:5000/api/attendance', config);
            const [circlesResponse, attendanceResponse] = await Promise.all([circlesPromise, attendancePromise]);
            setCircles(circlesResponse.data);
            const newAttendanceMap = new Map<string, string>();
            for (const record of attendanceResponse.data) {
                if (!newAttendanceMap.has(record.circle)) {
                    newAttendanceMap.set(record.circle, record.date);
                }
            }
            setLatestAttendanceMap(newAttendanceMap);
        } catch (error) {
            setError("Failed to load platform data.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    if (loading) return <div className="p-8">Loading Teacher Activity...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Teacher Attendance Overview</h1>
            <p className="text-gray-600 mb-6">This page shows the last time attendance was recorded for each circle.</p>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="py-2">Circle Name</th>
                            <th className="py-2">Assigned Teacher</th>
                            <th className="py-2">Last Attendance Taken</th>
                            <th className="py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {circles.map(circle => {
                            const lastAttendanceDate = latestAttendanceMap.get(circle._id);
                            return (
                                <tr key={circle._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 font-semibold">{circle.name}</td>
                                    <td>{circle.teacher ? circle.teacher.username : 'N/A'}</td>
                                    <td>
                                        {lastAttendanceDate ? (
                                            <span className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded">{new Date(lastAttendanceDate).toLocaleDateString()}</span>
                                        ) : (
                                            <span className="text-gray-400">Never</span>
                                        )}
                                    </td>
                                    <td className="py-2 text-right">
                                        <Link to={`/admin/attendance/${circle._id}`} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                                            View History
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceOverviewPage;
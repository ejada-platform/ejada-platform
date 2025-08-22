// src/pages/admin/AttendanceHistoryPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AttendanceRecord {
    _id: string;
    date: string;
    takenBy: { username: string };
    records: { student: string, status: string }[];
}

const AttendanceHistoryPage = () => {
    const { circleId } = useParams<{ circleId: string }>();
    const { token } = useAuth();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        if (!token || !circleId) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<AttendanceRecord[]>(`http://localhost:5000/api/attendance/circle/${circleId}`, config);
            setRecords(data);
        } catch (error) {
            console.error("Failed to fetch attendance history", error);
        } finally {
            setLoading(false);
        }
    }, [token, circleId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    if (loading) return <div className="p-8">Loading Attendance History...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Full Attendance History</h1>
            <div className="space-y-4">
                {records.length > 0 ? records.map(record => (
                    <div key={record._id} className="bg-white p-4 rounded-lg shadow">
                        <p className="font-bold text-lg">{new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Taken by: {record.takenBy.username}</p>
                        <p className="text-sm mt-2">
                            <span className="text-green-600 font-semibold">{record.records.filter(r => r.status === 'Present').length} Present</span>,{' '}
                            <span className="text-red-600 font-semibold">{record.records.filter(r => r.status === 'Absent').length} Absent</span>
                        </p>
                    </div>
                )) : <p>No attendance has been taken for this circle yet.</p>}
            </div>
        </div>
    );
};

export default AttendanceHistoryPage;
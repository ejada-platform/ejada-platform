// src/pages/teacher/TakeAttendancePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Type Definitions ---
interface Student {
    _id: string;
    username: string;
}
interface CircleData {
    _id: string;
    name: string;
    students: Student[];
}
interface AttendanceRecord {
    student: string; // Just the ID
    status: 'Present' | 'Absent' | 'Excused';
}

const TakeAttendancePage = () => {
    const { circleId } = useParams<{ circleId: string }>();
    const { token } = useAuth();
    
    const [circle, setCircle] = useState<CircleData | null>(null);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Fetch the list of students in the circle
    const fetchCircleStudents = useCallback(async () => {
        if (!token || !circleId) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<CircleData[]>('http://localhost:5000/api/circles/my-circles', config);
            const thisCircle = data.find(c => c._id === circleId);
            if (thisCircle) {
                setCircle(thisCircle);
                // Initialize attendance state: all students are 'Present' by default
                const initialRecords = thisCircle.students.map(s => ({ student: s._id, status: 'Present' as const }));
                setAttendance(initialRecords);
            }
        } catch (error) {
            setMessage('Failed to load students for this circle.');
        } finally {
            setLoading(false);
        }
    }, [token, circleId]);

    useEffect(() => {
        fetchCircleStudents();
    }, [fetchCircleStudents]);

    const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
        setAttendance(prev => prev.map(record => 
            record.student === studentId ? { ...record, status } : record
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                circleId,
                date,
                records: attendance
            };
            await axios.post('http://localhost:5000/api/attendance', payload, config);
            setMessage('Attendance saved successfully!');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to save attendance.');
        }
    };

    if (loading) return <div className="p-8">Loading students...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Take Attendance</h1>
            <h2 className="text-xl text-gray-600 mb-6">for {circle?.name}</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                <div className="mb-6">
                    <label className="block font-bold mb-1">Select Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required />
                </div>

                <div className="space-y-4">
                    {circle?.students.map(student => {
                        const currentStatus = attendance.find(rec => rec.student === student._id)?.status || 'Present';
                        return (
                            <div key={student._id} className="p-3 border rounded-md flex justify-between items-center">
                                <span className="font-semibold">{student.username}</span>
                                <div className="flex space-x-2">
                                    {['Present', 'Absent', 'Excused'].map(status => {
                                        const typedStatus = status as AttendanceRecord['status'];
                                        return (
                                            <button
                                                type="button"
                                                key={status}
                                                onClick={() => handleStatusChange(student._id, typedStatus)}
                                                className={`px-3 py-1 text-sm rounded-full ${
                                                    currentStatus === typedStatus
                                                        ? 'text-white ' + (status === 'Present' ? 'bg-green-500' : status === 'Absent' ? 'bg-red-500' : 'bg-yellow-500')
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button type="submit" className="w-full mt-6 py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                    Save Attendance
                </button>
                {message && <p className="mt-4 text-center">{message}</p>}
            </form>
        </div>
    );
};

export default TakeAttendancePage;
// src/pages/teacher/TakeAttendancePage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';

interface Student { _id: string; username: string; }
interface CircleData { _id: string; name: string; students: Student[]; }
interface AttendanceRecord { student: string; status: 'Present' | 'Absent' | 'Excused'; }

const TeacherAttendancePage = () => {
    const { circleId } = useParams<{ circleId: string }>();
    const { token } = useAuth();
    
    const [circle, setCircle] = useState<CircleData | null>(null);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    
    const [duration, setDuration] = useState(1);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const fetchCircleDetails = async () => {
            if (!token || !circleId) { setLoading(false); return; }
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get<CircleData>(`http://localhost:5000/api/circles/${circleId}`, config);
                setCircle(data);
                const initialRecords = data.students.map(s => ({ student: s._id, status: 'Present' as const }));
                setAttendance(initialRecords);
            } catch (error) {
                console.error('Failed to load circle details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCircleDetails();
    }, [token, circleId]);

    const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
        setAttendance(prev => prev.map(record => record.student === studentId ? { ...record, status } : record));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const presentStudents = attendance.filter(rec => rec.status === 'Present').map(rec => rec.student);
            
            const attendancePayload = { circleId, date, records: attendance };
            const workLogPayload = { circleId, date, duration, notes, attendees: presentStudents };

            const attendancePromise = axios.post('http://localhost:5000/api/attendance', attendancePayload, config);
            const workLogPromise = axios.post('http://localhost:5000/api/worklogs', workLogPayload, config);

            await Promise.all([attendancePromise, workLogPromise]);
            showSuccessAlert('Success!', 'Attendance and work hours have been logged successfully.');
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to save data.');
        }
    };

    if (loading) return <div className="p-8">Loading students...</div>;
    if (!circle) return <div className="p-8 text-red-500">Circle not found</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Record Session for {circle.name}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-1">Session Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Duration (Hours)</label>
                        <input type="number" step="0.5" min="0.5" value={duration} onChange={e => setDuration(parseFloat(e.target.value))} className="w-full p-2 border rounded-md" required />
                    </div>
                </div>
                <div>
                    <label className="block font-bold mb-1">Lesson Notes (Optional)</label>
                    <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <h3 className="text-xl font-bold pt-4 border-t">Student Attendance</h3>
                <div className="space-y-4">
                    {circle.students.map(student => {
                        const currentStatus = attendance.find(rec => rec.student === student._id)?.status || 'Present';
                        return (
                            <div key={student._id} className="p-3 border rounded-md flex justify-between items-center">
                                <span className="font-semibold">{student.username}</span>
                                <div className="flex space-x-2">
                                    {['Present', 'Absent', 'Excused'].map(status => {
                                        const typedStatus = status as AttendanceRecord['status'];
                                        return (
                                            <button type="button" key={status} onClick={() => handleStatusChange(student._id, typedStatus)}
                                                className={`px-3 py-1 text-sm rounded-full ${currentStatus === typedStatus ? 'text-white ' + (status === 'Present' ? 'bg-green-500' : status === 'Absent' ? 'bg-red-500' : 'bg-yellow-500') : 'bg-gray-200 text-gray-700'}`}>
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button type="submit" className="w-full mt-6 py-3 px-4 bg-primary text-light font-bold rounded-lg hover:opacity-90">
                    Save Session Record
                </button>
            </form>
        </div>
    );
};

export default TeacherAttendancePage;
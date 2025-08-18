// src/pages/teacher/MyWorkLogsPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';

// --- Type Definitions ---
interface Circle {
    _id: string;
    name: string;
}
interface WorkLog {
    _id: string;
    circle: { _id: string; name: string };
    date: string;
    duration: number;
    notes?: string;
}
interface SelectOption {
    value: string;
    label: string;
}

const MyWorkLogsPage = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState<WorkLog[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [myCircles, setMyCircles] = useState<Circle[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // --- Form State ---
    const [selectedCircle, setSelectedCircle] = useState<SelectOption | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [duration, setDuration] = useState(1);
    const [notes, setNotes] = useState('');

    const fetchWorkLogs = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<{ workLogs: WorkLog[], totalHours: number }>('http://localhost:5000/api/worklogs', config);
            setLogs(data.workLogs);
            setTotalHours(data.totalHours);
        } catch (error) {
            setMessage('Failed to load work logs.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchMyCircles = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<Circle[]>('http://localhost:5000/api/circles/my-circles', config);
            setMyCircles(data);
        } catch (error) {
            console.error("Failed to fetch circles", error);
        }
    }, [token]);

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchWorkLogs(), fetchMyCircles()]);
    }, [fetchWorkLogs, fetchMyCircles]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!selectedCircle || !date || !duration) {
            setMessage('Please fill out all required fields.');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                circleId: selectedCircle.value,
                date,
                duration,
                notes,
            };
            await axios.post('http://localhost:5000/api/worklogs', payload, config);
            setMessage('Work log saved successfully!');
            setSelectedCircle(null);
            setNotes('');
            fetchWorkLogs(); // Refresh the list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to save work log.');
        }
    };

    const circleOptions = myCircles.map(c => ({ value: c._id, label: c.name }));

    if (loading) return <div className="p-8">Loading work logs...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* --- Summary Section --- */}
            <div className="bg-white p-6 rounded-lg shadow mb-8 text-center">
                <h3 className="text-lg font-bold text-gray-500">Total Hours Logged</h3>
                <p className="text-4xl font-bold text-blue-600">{totalHours}</p>
            </div>

            {/* --- Form to Add New Log --- */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Log New Work Hours</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Circle</label>
                        <Select options={circleOptions} value={selectedCircle} onChange={setSelectedCircle} required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Duration (Hrs)</label>
                        <input type="number" step="0.5" min="0.5" value={duration} onChange={e => setDuration(parseFloat(e.target.value))} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="md:col-span-4">
                        <label className="block font-bold mb-1">Notes (Optional)</label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    <div className="md:col-span-4">
                        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                            Save Log
                        </button>
                    </div>
                    {message && <p className="md:col-span-4 mt-2 text-center">{message}</p>}
                </form>
            </div>

            {/* --- List of Existing Logs --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Work Log History</h2>
                <div className="space-y-2">
                    {logs.map(log => (
                        <div key={log._id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-bold">{log.circle.name}</p>
                                <p className="text-sm text-gray-600">{log.notes || 'No notes'}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{log.duration} hrs</p>
                                <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyWorkLogsPage;
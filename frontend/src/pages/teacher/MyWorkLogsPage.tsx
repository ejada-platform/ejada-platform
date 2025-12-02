import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface WorkLog { _id: string; circle: { name: string }; date: string; duration: number; notes?: string; }

const MyWorkLogsPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [logs, setLogs] = useState<WorkLog[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchWorkLogs = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<{ workLogs: WorkLog[], totalHours: number }>('http://localhost:5000/api/worklogs', config);
            setLogs(data.workLogs);
            setTotalHours(data.totalHours);
        } catch (error) { console.error('Failed to load work logs.'); } 
        finally { setLoading(false); }
    }, [token]);

    useEffect(() => { fetchWorkLogs(); }, [fetchWorkLogs]);

    if (loading) return <div className="p-8">Loading work logs...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('my_work_logs_page.title')}</h1>
            <div className="bg-white p-6 rounded-lg shadow mb-8 text-center">
                <h3 className="text-lg font-bold text-gray-500">{t('my_work_logs_page.total_hours')}</h3>
                <p className="text-4xl font-bold text-blue-600">{totalHours}</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('my_work_logs_page.history_title')}</h2>
                <div className="space-y-2">
                    {logs.map(log => (
                        <div key={log._id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-bold">{log.circle.name}</p>
                                <p className="text-sm text-gray-600">{log.notes || t('my_work_logs_page.no_notes')}</p>
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
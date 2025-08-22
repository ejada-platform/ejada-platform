// src/pages/admin/AdminDashboardPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

// --- Type Definition for the stats object ---
interface PlatformStats {
    totalStudents: number;
    totalTeachers: number;
    totalCircles: number;
    totalHoursLogged: number;
}

// --- ADD A NEW SUB-COMPONENT FOR THE FORM ---
const BroadcastForm = () => {
    const { token } = useAuth();
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { message, link };
            const { data } = await axios.post('http://localhost:5000/api/notifications/broadcast', payload, config);
            setStatus(data.message); // Show success message from backend
            setMessage('');
            setLink('');
        } catch (error) {
            setStatus('Failed to send broadcast.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Send Broadcast Notification</h2>
            <p className="text-sm text-gray-500 mb-4">Send a notification (e.g., weekly Hadith) to ALL users.</p>
            <form onSubmit={handleSubmit}>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message..." className="w-full p-2 border rounded" required rows={3}></textarea>
                <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="Optional link (e.g., /library)" className="w-full p-2 border rounded mt-2" />
                <button type="submit" className="w-full mt-4 py-2 px-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700">
                    Send to All Users
                </button>
                {status && <p className="mt-2 text-center">{status}</p>}
            </form>
        </div>
    );
};

const AdminDashboardPage = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlatformStats = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<PlatformStats>('http://localhost:5000/api/stats/overview', config);
            setStats(data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || t('admin_dashboard.error'));
        } finally {
            setLoading(false);
        }
    }, [token, t]); // Add t to dependency array

    useEffect(() => {
        fetchPlatformStats();
    }, [fetchPlatformStats]);

    if (loading) return <div className="p-8">{t('admin_dashboard.loading')}</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{t('admin_dashboard.title')}</h1>
            <p className="text-lg text-gray-600 mb-8">{t('admin_dashboard.welcome_message', { username: user?.username })}</p>

            {/* --- Statistics Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-500">{t('admin_dashboard.stats.total_students')}</h3>
                    <p className="text-4xl font-bold text-blue-600">{stats?.totalStudents}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-500">{t('admin_dashboard.stats.total_teachers')}</h3>
                    <p className="text-4xl font-bold text-green-600">{stats?.totalTeachers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-500">{t('admin_dashboard.stats.active_circles')}</h3>
                    <p className="text-4xl font-bold text-indigo-600">{stats?.totalCircles}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-500">{t('admin_dashboard.stats.total_hours')}</h3>
                    <p className="text-4xl font-bold text-yellow-600">{stats?.totalHoursLogged}</p>
                </div>
                <div className="mt-8">
                <BroadcastForm />
                </div>
            </div>

            {/* --- Quick Actions --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('admin_dashboard.quick_actions.title')}</h2>
                <div className="flex flex-wrap gap-4">
                    <Link to="/admin/users" className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800">
                        {t('admin_dashboard.quick_actions.manage_users')}
                    </Link>
                    <Link to="/admin/create-circle" className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800">
                        {t('admin_dashboard.quick_actions.create_circle')}
                    </Link>
                    <Link to="/admin/library" className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800">
                        {t('admin_dashboard.quick_actions.manage_library')}
                    </Link>
                     <Link to="/admin/badges" className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800">
                        {t('admin_dashboard.quick_actions.manage_badges')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
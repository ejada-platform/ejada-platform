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
    const { t, i18n } = useTranslation(); 
    const { token } = useAuth();
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(t('broadcast_form.status_sending'));
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { message, link };
            const { data } = await axios.post<{ message: string }>('http://localhost:5000/api/notifications/broadcast', payload, config);
            setStatus(data.message || 'Broadcast Sent Successfully!'); 
            setMessage('');
            setLink('');
        } catch (error) {
            setStatus(t('broadcast_form.status_failed'));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow" dir={i18n.dir()}>
            <h2 className="text-2xl font-bold mb-4">{t('broadcast_form.title')}</h2>
            <p className="text-sm text-gray-500 mb-4">{t('broadcast_form.intro')}</p>
            <form onSubmit={handleSubmit}>
                <textarea value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder={t('broadcast_form.placeholder_message')} 
                className="w-full p-2 border rounded" 
                required rows={3}>
                </textarea>
                <input type="text" value={link} 
                onChange={e => setLink(e.target.value)} 
                placeholder={t('broadcast_form.placeholder_link')}
                className="w-full p-2 border rounded mt-2" />
                <button type="submit" className="w-full mt-4 py-2 px-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700">
                {t('broadcast_form.button_send')}
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
        } catch (err: any) {
            setError(err.response?.data?.message || t('admin_dashboard.error'));
        } finally {
            setLoading(false);
        }
    }, [token, t]); 

    useEffect(() => {
        fetchPlatformStats();
    }, [fetchPlatformStats]);

    if (loading) return <div className="p-8">{t('admin_dashboard.loading')}</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">

<div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">{t('admin_dashboard.quick_actions.title')}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. Manage Users */}
        <Link 
            to="/admin/users" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-indigo-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.manage_users')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_manage_users')}</p>
        </Link>
        
        {/* 2. Create Circle */}
        <Link 
            to="/admin/create-circle" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-red-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.create_circle')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_create_circle')}</p>
        </Link>


        {/* 3. Curriculum Builder (NEW) */}
        <Link 
            to="/admin/curriculum-builder" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-orange-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-orange-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.49 10.04 5 9 5c-2.485 0-4.5 2.015-4.5 4.5S6.515 14 9 14c1.04 0 1.832-.49 2.8-.753M12 6.253C13.168 5.49 13.96 5 15 5c2.485 0 4.5 2.015 4.5 4.5S17.485 14 15 14c-1.04 0-1.832-.49-2.8-.753m0 0v-2.493"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.curriculum_builder')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_curriculum_builder')}</p>
        </Link>
        
        {/* 4. Review Applications */}
        <Link 
            to="/admin/applications" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-purple-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-purple-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.review_applications')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_review_applications')}</p>
        </Link>

        {/* --- SECOND ROW --- */}

        {/* 5. Teacher Attendance (NEW) */}
        <Link 
            to="/admin/attendance-overview" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-cyan-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
             <svg className="w-10 h-10 text-cyan-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-4 18h4M3 17h18M5 13h2M17 13h2M9 13h2M13 13h2M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.teacher_attendance')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_teacher_attendance')}</p>
        </Link>

        {/* 6. Teacher Payroll */}
        <Link 
            to="/admin/payroll" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-pink-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-pink-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.teacher_payroll')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_teacher_payroll')}</p>
        </Link>
        
        {/* 7. Manage Library */}
        <Link 
            to="/admin/library" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.49 10.04 5 9 5c-2.485 0-4.5 2.015-4.5 4.5S6.515 14 9 14c1.04 0 1.832-.49 2.8-.753M12 6.253C13.168 5.49 13.96 5 15 5c2.485 0 4.5 2.015 4.5 4.5S17.485 14 15 14c-1.04 0-1.832-.49-2.8-.753m0 0v-2.493"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.manage_library')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_manage_library')}</p>
        </Link>
        
        {/* 8. Manage Templates (NEW) */}
        <Link 
            to="/admin/templates" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-teal-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-teal-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.manage_templates')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_manage_templates')}</p>
        </Link>

        {/* --- THIRD ROW (remaining two) --- */}
        
        {/* 9. Manage Badges */}
        <Link 
            to="/admin/badges" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-blue-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
            <svg className="w-10 h-10 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.095 4.19A10.5 10.5 0 0112 4.19M15 7l.2 4M9 7l-.2 4m3-4V3m-2 4h4"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.manage_badges')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_manage_badges')}</p>
        </Link>
        
        {/* 10. Academic Calendar (NEW - assuming /calendar is a general route) */}
        <Link 
            to="/calendar" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-gray-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
             <svg className="w-10 h-10 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-4 18h4M3 17h18M5 13h2M17 13h2M9 13h2M13 13h2M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"></path></svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin_dashboard.quick_actions.academic_calendar')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_dashboard.quick_actions.desc_academic_calendar')}</p>
        </Link>
        
    </div>
</div>


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
        </div>        
    );
};


export default AdminDashboardPage;
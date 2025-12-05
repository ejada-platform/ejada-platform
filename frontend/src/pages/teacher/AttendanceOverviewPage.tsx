import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth, type User } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

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
    const { t, i18n } = useTranslation(); 
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
            setError(t('attendance_overview_page.error_load_data'));
        } finally {
            setLoading(false);
        }
    }, [token, t]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    if (loading) return <div className="p-8">{t('attendance_overview_page.loading_activity')}</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto" dir={i18n.dir()}>
            <h1 className="text-3xl font-bold mb-6">{t('attendance_overview_page.page_title')}</h1>
            <p className="text-gray-600 mb-6">
                {t('attendance_overview_page.page_intro')}
            </p>
            <div className="bg-white p-6 rounded-lg shadow">
                {/* --- DESKTOP TABLE (hidden on small screens) --- */}
                <table className="w-full text-left hidden md:table">
                    <thead className="border-b">
                        <tr>
                            <th className="py-2">{t('attendance_overview_page.table_header_circle')}</th>
                            <th className="py-2">{t('attendance_overview_page.table_header_teacher')}</th>
                            <th className="py-2">{t('attendance_overview_page.table_header_last_attendance')}</th>
                            <th className="py-2 text-right">{t('attendance_overview_page.table_header_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {circles.map(circle => {
                            const lastAttendanceDate = latestAttendanceMap.get(circle._id);
                            return (
                                <tr key={circle._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 font-semibold">{circle.name}</td>
                                    <td>
                                        {circle.teacher ? circle.teacher.username : t('attendance_overview_page.label_teacher_na')}
                                    </td>
                                    <td>
                                        {lastAttendanceDate ? (
                                            <span className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded">{new Date(lastAttendanceDate).toLocaleDateString(i18n.language)}</span>
                                        ) : (
                                            <span className="text-gray-400">{t('attendance_overview_page.status_never')}</span>
                                        )}
                                    </td>
                                    <td className="py-2 text-right">
                                        <Link to={`/admin/attendance/${circle._id}`} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                                            {t('attendance_overview_page.button_view_history')}
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* --- MOBILE CARD LIST (visible only on small screens) --- */}
                <div className="md:hidden space-y-4">
                    {circles.map(circle => {
                        const lastAttendanceDate = latestAttendanceMap.get(circle._id);
                        return (
                            <div key={circle._id} className="p-4 border rounded-lg">
                                <p className="font-bold text-lg">{circle.name}</p>
                                <p className="text-sm text-gray-600">{t('attendance_overview_page.mobile_label_teacher')} {circle.teacher ? circle.teacher.username : t('attendance_overview_page.label_teacher_na')}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <div>
                                        <p className="text-xs font-bold">{t('attendance_overview_page.mobile_label_last_attendance')}</p>
                                        {lastAttendanceDate ? (
                                            <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{new Date(lastAttendanceDate).toLocaleDateString(i18n.language)}</span>
                                        ) : (
                                            <span className="text-sm text-gray-400">{t('attendance_overview_page.status_never')}</span>
                                        )}
                                    </div>
                                    <Link to={`/admin/attendance/${circle._id}`} className="px-3 py-1 bg-blue-500 text-white text-sm rounded">
                                        {t('attendance_overview_page.button_view')}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AttendanceOverviewPage;
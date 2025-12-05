import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// YOU MUST ADD THIS LINE:
import { useTranslation } from 'react-i18next'; 

interface AttendanceRecord {
    _id: string;
    date: string;
    takenBy: { username: string } | null; // It can be null
    records: { student: string, status: string }[];
}

const AttendanceHistoryPage = () => {
    // YOU MUST ADD THIS DESTRUCTURING:
    const { t, i18n } = useTranslation(); 
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

    // Replaced hardcoded string
    if (loading) return <div className="p-8">{t('attendance_history_page.loading_history')}</div>; 

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Replaced hardcoded string */}
            <h1 className="text-3xl font-bold mb-6">{t('attendance_history_page.page_title')}</h1>
            <div className="space-y-4">
                {records.length > 0 ? records.map(record => {
                    const presentCount = record.records.filter(r => r.status === 'Present').length;
                    const absentCount = record.records.filter(r => r.status === 'Absent').length;
                    
                    return (
                        <div key={record._id} className="bg-white p-4 rounded-lg shadow">
                            {/* Replaced hardcoded string, used i18n.language for date format */}
                            <p className="font-bold text-lg">{new Date(record.date).toLocaleDateString(i18n.language)}</p>
                            
                            <p className="text-sm text-gray-500">
                                {/* Replaced hardcoded string and conditional logic */}
                                {t('attendance_history_page.taken_by')} {record.takenBy ? record.takenBy.username : t('attendance_history_page.unknown_teacher')}
                            </p>
                            
                            <p className="text-sm mt-2">
                                {/* Replaced hardcoded string with interpolation */}
                                <span className="text-green-600 font-semibold">
                                    {t('attendance_history_page.present_count', { count: presentCount })}
                                </span>,{' '}
                                <span className="text-red-600 font-semibold">
                                    {t('attendance_history_page.absent_count', { count: absentCount })}
                                </span>
                            </p>
                        </div>
                    );
                }) : <p>{t('attendance_history_page.no_attendance')}</p>} {/* Replaced hardcoded string */}
            </div>
        </div>
    );
};

export default AttendanceHistoryPage;
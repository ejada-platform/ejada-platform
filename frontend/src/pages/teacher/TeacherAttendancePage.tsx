import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';
import { useTranslation } from 'react-i18next'; // IMPORTED useTranslation

interface Student { _id: string; username: string; }
interface CircleData { _id: string; name: string; students: Student[]; }
interface AttendanceRecord { student: string; status: 'Present' | 'Absent' | 'Excused'; }

const TeacherAttendancePage = () => {
    const { t, i18n } = useTranslation(); // ADDED useTranslation
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
            // Use translation keys for alerts
            showSuccessAlert(t('teacher_attendance_page.alert_success_title'), t('teacher_attendance_page.alert_success_message'));
        } catch (err: any) {
            // Use translation keys for alerts
            showErrorAlert(t('teacher_attendance_page.alert_error_title'), err.response?.data?.message || t('teacher_attendance_page.alert_error_message'));
        }
    };

    if (loading) return <div className="p-8">{t('teacher_attendance_page.loading_students')}</div>;
    if (!circle) return <div className="p-8 text-red-500">{t('teacher_attendance_page.circle_not_found')}</div>;

    // Helper function to translate status strings
    const translateStatus = (status: AttendanceRecord['status']) => {
        switch(status) {
            case 'Present': return t('teacher_attendance_page.status_present');
            case 'Absent': return t('teacher_attendance_page.status_absent');
            case 'Excused': return t('teacher_attendance_page.status_excused');
            default: return status;
        }
    };
    
    // Helper function for button color classes
    const getButtonColor = (status: AttendanceRecord['status']) => {
        switch(status) {
            case 'Present': return 'bg-green-500';
            case 'Absent': return 'bg-red-500';
            case 'Excused': return 'bg-yellow-500';
            default: return 'bg-gray-200';
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto" dir={i18n.dir()}> {/* Applied RTL */}
            <h1 className="text-3xl font-bold mb-2">
                {t('teacher_attendance_page.title_prefix')} {circle.name}
            </h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-1">{t('teacher_attendance_page.session_date_label')}</label>
                        {/* Note: Date input direction is usually managed by the browser based on locale */}
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">{t('teacher_attendance_page.duration_label')}</label>
                        <input type="number" step="0.5" min="0.5" value={duration} onChange={e => setDuration(parseFloat(e.target.value))} className="w-full p-2 border rounded-md" required />
                    </div>
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('teacher_attendance_page.notes_label')}</label>
                    <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <h3 className="text-xl font-bold pt-4 border-t">{t('teacher_attendance_page.attendance_title')}</h3>
                <div className="space-y-4">
                    {circle.students.map(student => {
                        const currentStatus = attendance.find(rec => rec.student === student._id)?.status || 'Present';
                        return (
                            <div key={student._id} className="p-3 border rounded-md flex justify-between items-center">
                                <span className="font-semibold">{student.username}</span>
                                <div className="flex space-x-2">
                                    {['Present', 'Absent', 'Excused'].map(status => {
                                        const typedStatus = status as AttendanceRecord['status'];
                                        const isCurrent = currentStatus === typedStatus;
                                        return (
                                            <button type="button" key={status} onClick={() => handleStatusChange(student._id, typedStatus)}
                                                className={`px-3 py-1 text-sm rounded-full ${isCurrent ? 'text-white ' + getButtonColor(typedStatus) : 'bg-gray-200 text-gray-700'}`}>
                                                {translateStatus(typedStatus)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button type="submit" className="w-full mt-6 py-3 px-4 bg-green-800 text-white font-bold rounded-lg hover:opacity-90">
                    {t('teacher_attendance_page.save_button')}
                </button>
            </form>
        </div>
    );
};

export default TeacherAttendancePage;
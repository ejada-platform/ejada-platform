// src/pages/admin/CreateCirclePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth, type User } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';

interface ScheduleEntry { day: string; time: string; }
interface SelectOption { value: string; label: string; }

const CreateCirclePage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    
    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [liveClassUrl, setLiveClassUrl] = useState('');
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([{ day: 'Monday', time: '17:00' }]);
    const [program, setProgram] = useState<'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing'>('Reading 7+');
    const [teacher, setTeacher] = useState<SelectOption | null>(null);
    const [students, setStudents] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<User[]>('http://localhost:5000/api/users', config);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleScheduleChange = (index: number, field: 'day' | 'time', value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSchedule(newSchedule);
    };

    const addScheduleEntry = () => setSchedule([...schedule, { day: 'Wednesday', time: '17:00' }]);
    const removeScheduleEntry = (index: number) => setSchedule(schedule.filter((_, i) => i !== index));

    // --- THIS IS THE FINAL, CORRECTED handleSubmit FUNCTION ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !teacher || !program) {
            showErrorAlert('Missing Fields', 'Please ensure Name, Program, and Teacher are selected.');
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // This payload now correctly includes all the required fields
            const payload = {
                name,
                description,
                liveClassUrl,
                schedule,
                program,
                teacher: teacher.value,
                students: students.map(s => s.value),
            };
            await axios.post('http://localhost:5000/api/circles', payload, config);
            showSuccessAlert('Success!', t('admin_pages.create_circle.success_message'));
            // Reset the form
            setName(''); setDescription(''); setLiveClassUrl('');
            setSchedule([{ day: 'Monday', time: '17:00' }]);
            setProgram('Reading 7+'); setTeacher(null); setStudents([]);
        } catch (err: any) {
            // This will now show the specific validation error from the backend
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to create circle.');
        } finally {
            setLoading(false);
        }
    };
    
    const teacherOptions = users.filter(u => u.role === 'Teacher').map(u => ({ value: u._id, label: u.username }));
    const studentOptions = users.filter(u => u.role === 'Student').map(u => ({ value: u._id, label: u.username }));

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('admin_pages.create_circle.title')}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block font-bold mb-1">{t('admin_pages.create_circle.name_label')}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('admin_pages.create_circle.url_label')}</label>
                    <input type="url" value={liveClassUrl} onChange={e => setLiveClassUrl(e.target.value)} className="w-full p-2 border rounded-md" placeholder="https://..." />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('admin_pages.create_circle.description_label')}</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block font-bold mb-2">{t('admin_pages.create_circle.schedule_label')}</label>
                    {schedule.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <select value={entry.day} onChange={e => handleScheduleChange(index, 'day', e.target.value)} className="p-2 border rounded-md w-1/2 bg-white">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <option key={day}>{day}</option>)}
                            </select>
                            <input type="time" value={entry.time} onChange={e => handleScheduleChange(index, 'time', e.target.value)} className="p-2 border rounded-md w-1/2" />
                            {schedule.length > 1 && <button type="button" onClick={() => removeScheduleEntry(index)} className="px-2 py-1 bg-red-500 text-white rounded">&times;</button>}
                        </div>
                    ))}
                    <button type="button" onClick={addScheduleEntry} className="text-sm text-blue-600 hover:underline">{t('admin_pages.create_circle.add_day_button')}</button>
                </div>
                <div>
                    <label className="block font-bold mb-1">Program</label>
                    <select value={program} onChange={e => setProgram(e.target.value as any)} className="w-full p-2 border rounded-md bg-white">
                        <option value="Reading 7+">Reading (7+)</option>
                        <option value="Reading <7">Reading (&lt;7)</option>
                        <option value="Reciting">Reciting</option>
                        <option value="Memorizing">Memorizing</option>
                    </select>
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('admin_pages.create_circle.teacher_label')}</label>
                    <Select options={teacherOptions} value={teacher} onChange={setTeacher} required />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('admin_pages.create_circle.students_label')}</label>
                    <Select options={studentOptions} value={students} onChange={newValue => setStudents(newValue as SelectOption[])} isMulti />
                </div>
                <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:opacity-90 disabled:bg-gray-400">
                    {loading ? 'Creating...' : t('admin_pages.create_circle.submit_button')}
                </button>
            </form>
        </div>
    );
};

export default CreateCirclePage;
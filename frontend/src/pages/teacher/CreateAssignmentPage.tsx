import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';

// --- Type Definitions ---
interface Student { _id: string; username: string; }
interface Circle { _id: string; name: string; students: Student[]; }
interface SelectOption { value: string; label: string; }

const CreateAssignmentPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [myCircles, setMyCircles] = useState<Circle[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedCircle, setSelectedCircle] = useState<SelectOption | null>(null);
    const [studentOptions, setStudentOptions] = useState<SelectOption[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyCircles = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<Circle[]>('http://localhost:5000/api/circles/my-circles', config);
            setMyCircles(data);
        } catch (error) {
            console.error("Failed to fetch circles", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMyCircles();
    }, [fetchMyCircles]);

    const handleCircleChange = (option: SelectOption | null) => {
        setSelectedCircle(option);
        if (option) {
            const circle = myCircles.find(c => c._id === option.value);
            if (circle) {
                const options = circle.students.map(s => ({ value: s._id, label: s.username }));
                setStudentOptions(options);
                setSelectedStudents(options); // Default to all students
            }
        } else {
            setStudentOptions([]);
            setSelectedStudents([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !selectedCircle || selectedStudents.length === 0) {
            showErrorAlert('Missing Fields', 'Please provide a title, select a circle, and at least one student.');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                title,
                description,
                dueDate: dueDate || undefined,
                circleId: selectedCircle.value,
                studentIds: selectedStudents.map(s => s.value),
            };
            await axios.post('http://localhost:5000/api/assignments', payload, config);
            showSuccessAlert('Success!', t('create_assignment_page.success_message'));
            setTitle(''); setDescription(''); setDueDate(''); setSelectedCircle(null);
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to create assignment.');
        }
    };

    const circleOptions = myCircles.map(c => ({ value: c._id, label: c.name }));

    if (loading) return <div className="p-8">Loading your circles...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('create_assignment_page.title')}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.assignment_title_label')}</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.description_label')}</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" rows={4} />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.due_date_label')}</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.select_circle_label')}</label>
                    <Select options={circleOptions} value={selectedCircle} onChange={handleCircleChange} required />
                </div>
                
                {selectedCircle && (
                    <div>
                        <label className="block font-bold mb-1">Assign To</label>
                        <Select
                            isMulti
                            options={studentOptions}
                            value={selectedStudents}
                            onChange={newValue => setSelectedStudents(newValue as SelectOption[])}
                            placeholder="Select students (default is all)"
                        />
                    </div>
                )}
                
                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                    {t('create_assignment_page.submit_button')}
                </button>
            </form>
        </div>
    );
};

export default CreateAssignmentPage;
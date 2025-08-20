import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';


interface Circle {
    _id: string;
    name: string;
}
interface SelectOption {
    value: string;
    label: string;
}

const CreateAssignmentPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [myCircles, setMyCircles] = useState<Circle[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedCircle, setSelectedCircle] = useState<SelectOption | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMyCircles = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get<Circle[]>('http://localhost:5000/api/circles/my-circles', config);
                setMyCircles(data);
            } catch (error) {
                console.error("Failed to fetch circles", error);
                setMessage("Could not load your circles.");
            }
        };
        fetchMyCircles();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!title || !selectedCircle) {
            setMessage(t('create_assignment_page.success_message'));
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                title,
                description,
                dueDate: dueDate || undefined, // Send undefined if empty
                circleId: selectedCircle.value, // Send the ID of the selected circle
            };
            await axios.post('http://localhost:5000/api/assignments', payload, config);
            setMessage('Assignment created successfully!');
            // Clear the form
            setTitle('');
            setDescription('');
            setDueDate('');
            setSelectedCircle(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to create assignment.');
        }
    };

    // Prepare options for the select dropdown
    const circleOptions = myCircles.map(c => ({ value: c._id, label: c.name }));

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('create_assignment_page.title')}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <label className="block font-bold mb-1">{t('create_assignment_page.assignment_title_label')}</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-1">{t('create_assignment_page.description_label')}</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={4} />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-1">{t('create_assignment_page.due_date_label')}</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div className="mb-6">
                    <label className="block font-bold mb-1">{t('create_assignment_page.select_circle_label')}</label>
                    <Select options={circleOptions} value={selectedCircle} onChange={setSelectedCircle} required />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                    {t('create_assignment_page.submit_button')}
                </button>
                {message && <p className="mt-4 text-center">{message}</p>}
            </form>
        </div>
    );
};

export default CreateAssignmentPage;
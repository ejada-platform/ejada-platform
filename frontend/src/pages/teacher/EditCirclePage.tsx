import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ScheduleEntry {
    day: string;
    time: string;
}

interface CircleData {
    _id: string;
    name: string;
    description: string;
    liveClassUrl?: string;
    schedule?: ScheduleEntry[];
}

const EditCirclePage = () => {
    const { circleId } = useParams<{ circleId: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [liveClassUrl, setLiveClassUrl] = useState('');
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([{ day: 'Monday', time: '17:00' }]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchCircleData = useCallback(async () => {
        if (!token || !circleId) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<CircleData[]>(`http://localhost:5000/api/circles/my-circles`, config);
            const thisCircle = data.find(c => c._id === circleId);

            if (thisCircle) {
                setName(thisCircle.name);
                setDescription(thisCircle.description || '');
                setLiveClassUrl(thisCircle.liveClassUrl || '');
                setSchedule(thisCircle.schedule && thisCircle.schedule.length > 0 ? thisCircle.schedule : [{ day: 'Monday', time: '17:00' }]);
            }
        } catch (error) {
            setMessage('Failed to load circle data.');
        } finally {
            setLoading(false);
        }
    }, [token, circleId]);

    useEffect(() => {
        fetchCircleData();
    }, [fetchCircleData]);
    
    const handleScheduleChange = (index: number, field: 'day' | 'time', value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSchedule(newSchedule);
    };

    const addScheduleEntry = () => {
        setSchedule([...schedule, { day: 'Wednesday', time: '17:00' }]);
    };

    const removeScheduleEntry = (index: number) => {
        const newSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(newSchedule);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { name, description, liveClassUrl, schedule };
            await axios.put(`http://localhost:5000/api/circles/${circleId}`, payload, config);
            setMessage('Circle updated successfully!');
            setTimeout(() => navigate('/my-circles'), 1500);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to update circle.');
        }
    };

    if (loading) return <div className="p-8">Loading circle details...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Circle Details</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                 <div className="mb-4">
                    <label className="block font-bold mb-1">Circle Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                 <div className="mb-4">
                    <label className="block font-bold mb-1">Live Class URL (Zoom Link)</label>
                    <input type="url" value={liveClassUrl} onChange={e => setLiveClassUrl(e.target.value)} className="w-full p-2 border rounded" placeholder="https://..." />
                </div>
                 <div className="mb-4">
                    <label className="block font-bold mb-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={3} />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Class Schedule</label>
                    {schedule.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <select value={entry.day} onChange={e => handleScheduleChange(index, 'day', e.target.value)} className="p-2 border rounded w-1/2">
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => <option key={day}>{day}</option>)}
                            </select>
                            <input type="time" value={entry.time} onChange={e => handleScheduleChange(index, 'time', e.target.value)} className="p-2 border rounded w-1/2" />
                            {schedule.length > 1 && (
                                <button type="button" onClick={() => removeScheduleEntry(index)} className="px-2 py-1 bg-red-500 text-white rounded">&times;</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addScheduleEntry} className="text-sm text-blue-600 hover:underline">+ Add another day</button>
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                    Save Changes
                </button>
                {message && <p className="mt-4 text-center">{message}</p>}
            </form>
        </div>
    );
};

export default EditCirclePage;
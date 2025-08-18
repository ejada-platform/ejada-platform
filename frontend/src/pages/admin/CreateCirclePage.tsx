import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
// This is the fix: we add the 'type' keyword because User is an interface, not a value.
import type { User } from '../../context/AuthContext'; 


interface SelectOption {
    value: string;
    label: string;
}

interface ScheduleEntry {
    day: string;
    time: string;
}

const CreateCirclePage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [teacher, setTeacher] = useState<SelectOption | null>(null);
    const [students, setStudents] = useState<SelectOption[]>([]);
    const [message, setMessage] = useState('');
    const [liveClassUrl, setLiveClassUrl] = useState('');
      const [schedule, setSchedule] = useState<ScheduleEntry[]>([{ day: 'Monday', time: '17:00' }]);

    const handleScheduleChange = (index: number, field: 'day' | 'time', value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const addScheduleEntry = () => {
        setSchedule([...schedule, { day: 'Wednesday', time: '17:00' }]);
    };

    const removeScheduleEntry = (index: number) => {
        const newSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(newSchedule);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get<User[]>('http://localhost:5000/api/users', config);
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
                setMessage("Could not load users list.");
            }
        };
        fetchUsers();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!name || !teacher || students.length === 0) {
            setMessage('Please fill out all required fields.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                name,
                description,
                teacher: teacher.value,
                students: students.map(s => s.value),
                liveClassUrl,
                schedule,
            };
            await axios.post('http://localhost:5000/api/circles', payload, config);
            setMessage('Circle created successfully!');
            setName('');
            setDescription('');
            setTeacher(null);
            setStudents([]);
            setLiveClassUrl('');
             setSchedule([{ day: 'Monday', time: '17:00' }]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to create circle.');
        }
    };

    const teacherOptions = users.filter(u => u.role === 'Teacher').map(u => ({ value: u._id, label: u.username }));
    const studentOptions = users.filter(u => u.role === 'Student').map(u => ({ value: u._id, label: u.username }));

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Educational Circle</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                    <label className="block font-bold mb-1">Circle Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-2 border rounded" 
                        required // It's a required field
                    />
                </div>
              
                <div className="mb-4">
                    <label className="block font-bold mb-1">Live Class URL (Zoom Link)</label>
                    <input 
                        type="url" 
                        value={liveClassUrl} 
                        onChange={e => setLiveClassUrl(e.target.value)} 
                        className="w-full p-2 border rounded"
                        placeholder="https://zoom.us/j/..."
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                {/* --- NEW SCHEDULE SECTION --- */}
                <div className="mb-4">
                    <label className="block font-bold mb-2">Class Schedule</label>
                    {schedule.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <select value={entry.day} onChange={e => handleScheduleChange(index, 'day', e.target.value)} className="p-2 border rounded w-1/2">
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                                <option>Sunday</option>
                            </select>
                            <input type="time" value={entry.time} onChange={e => handleScheduleChange(index, 'time', e.target.value)} className="p-2 border rounded w-1/2" />
                            <button type="button" onClick={() => removeScheduleEntry(index)} className="px-2 py-1 bg-red-500 text-white rounded">&times;</button>
                        </div>
                    ))}
                    <button type="button" onClick={addScheduleEntry} className="text-sm text-blue-600 hover:underline">+ Add another day</button>
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-1">Select Teacher</label>
                    <Select options={teacherOptions} value={teacher} onChange={setTeacher} />
                </div>
                <div className="mb-6">
                    <label className="block font-bold mb-1">Select Students</label>
                    <Select options={studentOptions} value={students} onChange={newValue => setStudents(newValue as SelectOption[])} isMulti />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                    Create Circle
                </button>
                {message && <p className="mt-4 text-center">{message}</p>}
            </form>
        </div>
    );
};

export default CreateCirclePage;
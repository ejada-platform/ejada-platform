// src/pages/admin/ManageBadgesPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Badge {
    _id: string;
    name: string;
    description: string;
    iconUrl: string;
}

const ManageBadgesPage = () => {
    const { token } = useAuth();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [iconUrl, setIconUrl] = useState('');

    const fetchBadges = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<Badge[]>('http://localhost:5000/api/badges', config);
            setBadges(data);
        } catch (error) {
            setMessage('Failed to load badges.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBadges();
    }, [fetchBadges]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { name, description, iconUrl };
            await axios.post('http://localhost:5000/api/badges', payload, config);
            
            setMessage('Badge created successfully!');
            setName('');
            setDescription('');
            setIconUrl('');
            fetchBadges(); // Refresh the list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to create badge.');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* --- Form to Create New Badge --- */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Create New Badge</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">Badge Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">Icon URL</label>
                        <input type="url" value={iconUrl} onChange={e => setIconUrl(e.target.value)} className="w-full p-2 border rounded" placeholder="https://example.com/icon.png" required />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={2} required />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Create Badge</button>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </form>
            </div>

            {/* --- List of Existing Badges --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Available Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map(badge => (
                        <div key={badge._id} className="bg-white p-4 rounded-lg shadow text-center">
                            <img src={badge.iconUrl} alt={badge.name} className="w-20 h-20 mx-auto" />
                            <h3 className="font-bold mt-2">{badge.name}</h3>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageBadgesPage;
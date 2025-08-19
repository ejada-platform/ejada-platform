// src/pages/admin/ManageBadgesPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface Badge {
    _id: string;
    name: string;
    description: string;
    iconUrl: string;
}

const ManageBadgesPage = () => {
    const { t } = useTranslation();
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
            
            setMessage(t('admin_pages.manage_badges.success_message'));
            setName('');
            setDescription('');
            setIconUrl('');
            fetchBadges();
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
                <h2 className="text-2xl font-bold mb-4">{t('admin_pages.manage_badges.add_title')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">{t('admin_pages.manage_badges.name_label')}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">{t('admin_pages.manage_badges.icon_url_label')}</label>
                        <input type="url" value={iconUrl} onChange={e => setIconUrl(e.target.value)} className="w-full p-2 border rounded" placeholder="https://example.com/icon.png" required />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">{t('admin_pages.manage_badges.description_label')}</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={2} required />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                        {t('admin_pages.manage_badges.submit_button')}
                    </button>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </form>
            </div>

            {/* --- List of Existing Badges --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('admin_pages.manage_badges.existing_title')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {badges.map(badge => (
                        <div key={badge._id} className="bg-white p-4 rounded-lg shadow text-center border">
                            <img src={badge.iconUrl} alt={badge.name} className="w-20 h-20 mx-auto object-contain" />
                            <h3 className="font-bold mt-2 text-sm">{badge.name}</h3>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageBadgesPage;
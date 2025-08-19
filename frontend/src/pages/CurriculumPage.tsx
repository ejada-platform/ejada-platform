// src/pages/CurriculumPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

// Define the shape of a single curriculum object
interface Curriculum {
    _id: string;
    title: string;
    description: string;
    level: string;
    contentUrl: string;
    createdAt: string;
}

const CurriculumPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [curricula, setCurricula] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCurricula = useCallback(async () => {
        if (!token) {
            setLoading(false);
            setError(t('curriculum_page.error_auth'));
            return;
        }

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get<Curriculum[]>('http://localhost:5000/api/curriculum', config);
            setCurricula(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || t('curriculum_page.error_fetch'));
        } finally {
            setLoading(false);
        }
    }, [token, t]); // Add t to dependency array

    useEffect(() => {
        fetchCurricula();
    }, [fetchCurricula]);

    if (loading) {
        return <div className="p-10 text-center">{t('curriculum_page.loading')}</div>;
    }
    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('curriculum_page.title')}</h1>
            <div className="space-y-4">
                {curricula.length > 0 ? (
                    curricula.map((curriculum) => (
                        <div key={curriculum._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">{curriculum.title}</h2>
                            <p className="text-sm text-gray-500 mb-2">{t('curriculum_page.level_label')} {curriculum.level}</p>
                            <p className="text-gray-600 mb-3">{curriculum.description}</p>
                            <a href={curriculum.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {t('curriculum_page.view_content_button')}
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">{t('curriculum_page.no_plans_message')}</p>
                )}
            </div>
        </div>
    );
};

export default CurriculumPage;
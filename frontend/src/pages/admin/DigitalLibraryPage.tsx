// src/pages/DigitalLibraryPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Define the shape of a single resource object
interface Resource {
    _id: string;
    title: string;
    description: string;
    resourceUrl: string;
    category: 'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other';
    createdAt: string;
}

const DigitalLibraryPage = () => {
    const { t } = useTranslation();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get<Resource[]>('http://localhost:5000/api/resources');
            setResources(data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || t('digital_library_page.error'));
        } finally {
            setLoading(false);
        }
    }, [t]); // Add t to dependency array

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    if (loading) return <div className="p-10 text-center">{t('digital_library_page.loading')}</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    // Helper to get a color for each category badge
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Quran': return 'bg-green-100 text-green-800';
            case 'Hadith': return 'bg-blue-100 text-blue-800';
            case 'Fiqh': return 'bg-yellow-100 text-yellow-800';
            case 'Stories': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">{t('digital_library_page.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.length > 0 ? (
                    resources.map((resource) => (
                        <div key={resource._id} className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start ${getCategoryColor(resource.category)}`}>
                                {/* Also translate the category names */}
                                {t(`circle_detail_page.specializations.${resource.category.toLowerCase().replace(' ', '_')}` as const, resource.category)}
                            </span>
                            <h2 className="text-xl font-bold text-gray-800 mt-3">{resource.title}</h2>
                            <p className="text-gray-600 mt-2 flex-grow">{resource.description}</p>
                            <a
                                href={resource.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {t('digital_library_page.open_resource_button')}
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">{t('digital_library_page.no_resources_message')}</p>
                )}
            </div>
        </div>
    );
};

export default DigitalLibraryPage;
import React, { useState, useEffect, useCallback } from 'react'; // Corrected path
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // 1. Import useAuth
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'; // A more appropriate icon
import { Link } from 'react-router-dom';

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
    const { token } = useAuth(); // 2. Get the user's token from the context
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        // 3. The user must be logged in to fetch resources
        if (!token) {
            setError("You must be logged in to access the library.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            // 4. Add the Authorization header to the request
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<Resource[]>('http://localhost:5000/api/resources', config);
            setResources(data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || t('digital_library_page.error'));
        } finally {
            setLoading(false);
        }
    }, [token, t]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    if (loading) return <div className="p-10 text-center">{t('digital_library_page.loading')}</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    const getCategoryColor = (_category: string) => { /* ... (This helper function is correct) ... */ };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">{t('digital_library_page.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div key={resource._id} className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start ${getCategoryColor(resource.category)}`}>
                            {t(`circle_detail_page.specializations.${resource.category.toLowerCase().replace(' ', '_')}` as const, resource.category)}
                        </span>
                        <h2 className="text-xl font-bold text-gray-800 mt-3">{resource.title}</h2>
                        <p className="text-gray-600 mt-2 flex-grow">{resource.description}</p>
                       
                        {/* --- 5. THIS IS THE NEW "READ ONLINE" BUTTON --- */}
                       
                        <Link
                            to={`/library/view?url=${encodeURIComponent(resource.resourceUrl)}`}
                            className="flex items-center justify-center gap-2 text-center mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faBookOpen} />
                            <span>Read Online</span>
                        </Link>
                             {/* You can add a translation key for this */}
                    
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DigitalLibraryPage;
import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faShoppingCart } from '@fortawesome/free-solid-svg-icons'; 
import { Link } from 'react-router-dom';

interface Resource {
    price: any;
    isFree: any;
    _id: string;
    title: string;
    description: string;
    resourceUrl: string;
    category: 'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other';
    createdAt: string;
}

const DigitalLibraryPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth(); 
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        
        if (!token) {
            setError("You must be logged in to access the library.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
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

     // --- NEW FUNCTION TO HANDLE PURCHASES ---
     const handleBuyNow = async (resourceId: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data }: { data: { url: string } } = await axios.post('http://localhost:5000/api/checkout/create-session', { resourceId }, config);

            // Redirect the user to the Stripe Checkout page
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            alert('Could not initiate purchase. Please try again.');
        }
    };

    if (loading) return <div className="p-10 text-center">{t('digital_library_page.loading')}</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    //const getCategoryColor = (_category: string) => { /* ... (This helper function is correct) ... */ };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-12">{t('digital_library_page.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map((resource) => (
                    <div key={resource._id} className="bg-white p-6 rounded-lg shadow-lg border flex flex-col text-center">
                        <p className="text-sm font-semibold text-gray-500 mb-2">
                            {t(`circle_detail_page.specializations.${resource.category.toLowerCase().replace(' ', '_')}` as const, resource.category)}
                        </p>
                        <h2 className="text-2xl font-bold text-primary">{resource.title.toUpperCase()}</h2>
                        <p className="text-gray-600 mt-2 flex-grow">{resource.description}</p>
                        
                        {resource.isFree ? (
                            <Link
                                to={`/library/view?url=${encodeURIComponent(resource.resourceUrl)}`}
                                className="flex items-center justify-center gap-2 text-center mt-6 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span>Read Online</span>
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleBuyNow(resource._id)}
                                className="flex items-center justify-center gap-2 text-center mt-6 px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faShoppingCart} />
                                <span>Buy Now for ${resource.price}</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DigitalLibraryPage;
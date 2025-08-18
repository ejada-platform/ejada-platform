// src/pages/DigitalLibraryPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            // This is a public endpoint, so no token is needed
            const { data } = await axios.get<Resource[]>('http://localhost:5000/api/resources');
            setResources(data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch resources.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    if (loading) return <div className="p-10 text-center">Loading Resources...</div>;
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
            <h1 className="text-4xl font-bold text-center mb-8">Digital Library</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.length > 0 ? (
                    resources.map((resource) => (
                        <div key={resource._id} className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start ${getCategoryColor(resource.category)}`}>
                                {resource.category}
                            </span>
                            <h2 className="text-xl font-bold text-gray-800 mt-3">{resource.title}</h2>
                            <p className="text-gray-600 mt-2 flex-grow">{resource.description}</p>
                            <a
                                href={resource.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Open Resource
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No resources have been added to the library yet.</p>
                )}
            </div>
        </div>
    );
};

export default DigitalLibraryPage;
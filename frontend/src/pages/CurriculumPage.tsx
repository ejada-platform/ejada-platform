// src/pages/CurriculumPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
    const { token } = useAuth();
    // This state expects an array of Curriculum objects
    const [curricula, setCurricula] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurricula = async () => {
            if (!token) {
                setLoading(false);
                setError("You must be logged in to view curricula.");
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // =========================================================
                // === THIS IS THE FIX ===
                // We tell axios that the expected response data will be an array of Curriculum objects.
                const response = await axios.get<Curriculum[]>('http://localhost:5000/api/curriculum', config);
                // =========================================================
                
                // Now, TypeScript knows that response.data is a Curriculum[] array,
                // so it allows us to set it in the state without an error.
                setCurricula(response.data);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch curricula.");
            } finally {
                setLoading(false);
            }
        };

        fetchCurricula();
    }, [token]);

    // ... The rest of the component's JSX remains the same
    if (loading) {
        return <div className="p-10">Loading curriculum...</div>;
    }
    if (error) {
        return <div className="p-10 text-red-500">{error}</div>;
    }
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Curriculum Plans</h1>
            <div className="space-y-4">
                {curricula.length > 0 ? (
                    curricula.map((curriculum) => (
                        <div key={curriculum._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">{curriculum.title}</h2>
                            <p className="text-sm text-gray-500 mb-2">Level: {curriculum.level}</p>
                            <p className="text-gray-600 mb-3">{curriculum.description}</p>
                            <a href={curriculum.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Content
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No curriculum plans found.</p>
                )}
            </div>
        </div>
    );
};

export default CurriculumPage;
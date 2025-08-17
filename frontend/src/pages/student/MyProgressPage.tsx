// src/pages/student/MyProgressPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Define the shape of the evaluation data
interface Evaluation {
    _id: string;
    teacher: { _id: string; username: string };
    rating: number;
    notes?: string;
    date: string;
}

const MyProgressPage = () => {
    const { user, token } = useAuth();
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvaluations = useCallback(async () => {
        if (!user || !token) {
            setError("You must be logged in to view your progress.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // We use the student's own ID from the context to fetch their evaluations
            const response = await axios.get<Evaluation[]>(`http://localhost:5000/api/evaluations/student/${user._id}`, config);
            setEvaluations(response.data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch evaluations.");
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchEvaluations();
    }, [fetchEvaluations]);

    if (loading) return <div className="p-10">Loading your progress...</div>;
    if (error) return <div className="p-10 text-red-500">{error}</div>;

    // Helper to render stars for the rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Daily Progress</h1>
            <div className="space-y-4">
                {evaluations.length > 0 ? (
                    evaluations.map((evaluation) => (
                        <div key={evaluation._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Evaluation from: <strong>{evaluation.teacher.username}</strong>
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1">{evaluation.notes || "No notes provided."}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">{new Date(evaluation.date).toLocaleDateString()}</p>
                                    <div className="text-xl">{renderStars(evaluation.rating)}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no evaluations yet.</p>
                )}
            </div>
        </div>
    );
};

export default MyProgressPage;
// src/pages/student/MyProgressPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import StarStudent from '../../components/StartStudent';
import { useTranslation } from 'react-i18next'; // 


// --- Type Definitions for the data we expect from the API ---
interface Evaluation {
    _id: string;
    teacher: { _id: string; username: string };
    rating: number;
    notes?: string;
    date: string;
}

interface StudentStats {
    averageRating: number;
    totalEvaluations: number;
    totalSubmissions: number;
}

const MyProgressPage = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!user || !token) {
            setError("You must be logged in to view your progress.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const evaluationsPromise = axios.get<Evaluation[]>(`http://localhost:5000/api/evaluations/student/${user._id}`, config);
            const statsPromise = axios.get<StudentStats>(`http://localhost:5000/api/stats/student/${user._id}`, config);
            const [evaluationsResponse, statsResponse] = await Promise.all([evaluationsPromise, statsPromise]);
            setEvaluations(evaluationsResponse.data);
            setStats(statsResponse.data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(t('my_progress_page.error'));
        } finally {
            setLoading(false);
        }
    }, [user, token, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    if (loading) return <div className="p-10 text-center">Loading your progress...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <StarStudent />
            </div>
            
            <h1 className="text-3xl font-bold mb-6">{t('my_progress_page.title')}</h1>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-bold text-gray-500">{t('my_progress_page.avg_rating')}</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.averageRating} / 5</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-bold text-gray-500">{t('my_progress_page.total_submissions')}</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.totalSubmissions}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-bold text-gray-500">{t('my_progress_page.daily_evaluations')}</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.totalEvaluations}</p>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-4">{t('my_progress_page.history_title')}</h2>
            <div className="space-y-4">
                {evaluations.length > 0 ? (
                    evaluations.map((evaluation) => (
                        <div key={evaluation._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t('my_progress_page.evaluation_from', { teacher: evaluation.teacher.username })} <strong>{evaluation.teacher.username}</strong>
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800 mt-1">{evaluation.notes || t('my_progress_page.no_notes')}</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="text-sm font-bold">{new Date(evaluation.date).toLocaleDateString()}</p>
                                    <div className="text-xl mt-1">{renderStars(evaluation.rating)}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                        <p>{t('my_progress_page.no_evaluations')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProgressPage;
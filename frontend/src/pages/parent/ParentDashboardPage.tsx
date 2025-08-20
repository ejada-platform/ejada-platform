// src/pages/parent/ParentDashboardPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// --- Type Definitions ---
interface Submission { _id: string; assignment: { title: string }; content: string; status: string; grade?: string; feedback?: string; }
interface Evaluation { _id: string; teacher: { username: string }; rating: number; notes?: string; date: string; }
interface ChildData {
    _id: string;
    username: string;
    submissions: Submission[];
    evaluations: Evaluation[];
}

const ParentDashboardPage = () => {
    const { user, token } = useAuth();
    const [childrenData, setChildrenData] = useState<ChildData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChildrenData = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // THIS IS THE CORRECTED URL
            const { data } = await axios.get<ChildData[]>('http://localhost:5000/api/parent/my-children', config);
            setChildrenData(data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch children data.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchChildrenData();
    }, [fetchChildrenData]);

    // THIS IS THE CORRECTED RENDERSTARS FUNCTION
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    if (loading) return <div className="p-8">Loading Progress Reports...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Parent Dashboard</h1>
            <p className="mb-8">Welcome, {user?.username}. Here is the progress report for your children.</p>
            
            {childrenData.length > 0 ? (
                <div className="space-y-12">
                    {childrenData.map(child => (
                        <div key={child._id} className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-bold text-blue-700 border-b pb-2 mb-4">{child.username}'s Progress</h2>
                            
                            {/* --- Daily Evaluations Section --- */}
                            <h3 className="text-xl font-semibold mb-2">Daily Evaluations</h3>
                            {child.evaluations.length > 0 ? (
                                <div className="space-y-3">
                                    {child.evaluations.map(e => (
                                        <div key={e._id} className="bg-gray-50 p-3 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <p>From: <strong>{e.teacher.username}</strong> on {new Date(e.date).toLocaleDateString()}</p>
                                                <div className="text-xl">{renderStars(e.rating)}</div>
                                            </div>
                                            <p className="mt-1 italic">"{e.notes || 'No notes.'}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <p>No daily evaluations found.</p>}

                            {/* --- Assignment Submissions Section --- */}
                            <h3 className="text-xl font-semibold mt-6 mb-2">Assignment Submissions</h3>
                            {child.submissions.length > 0 ? (
                                <div className="space-y-3">
                                    {child.submissions.map(s => (
                                        <div key={s._id} className="bg-gray-50 p-3 rounded-md">
                                            <p><strong>Assignment:</strong> {s.assignment.title}</p>
                                            <p><strong>Submission:</strong> {s.content}</p>
                                            {s.status === 'Reviewed' && (
                                                <div className="mt-2 p-2 bg-green-100 rounded-md">
                                                    <p><strong>Grade:</strong> {s.grade}</p>
                                                    <p><strong>Feedback:</strong> {s.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : <p>No assignment submissions found.</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Your account is not yet linked to any students. Please contact the administrator.</p>
            )}
        </div>
    );
};

export default ParentDashboardPage;
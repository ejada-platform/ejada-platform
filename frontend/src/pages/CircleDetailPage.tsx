// src/pages/CircleDetailPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- TYPE DEFINITIONS ---
interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate?: string;
    createdBy: { _id: string; username: string };
    createdAt: string;
}

interface Submission {
    _id: string;
    student: { _id: string; username: string };
    content: string;
    status: 'Submitted' | 'Reviewed';
    grade?: string;
    feedback?: string;
    createdAt: string;
}

interface LessonLog {
    _id: string;
    date: string;
    specialization: 'Quran' | 'Arabic Language' | 'Islamic Lessons';
    topic: string;
    notes?: string;
    teacher: { _id: string, username: string };
}

// ==================================================================
// --- SUB-COMPONENT: SubmissionForm (for Students) ---
// ==================================================================
const SubmissionForm = ({ assignmentId, onSubmissionSuccess }: { assignmentId: string; onSubmissionSuccess: () => void }) => {
    const { token } = useAuth();
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!content) {
            setMessage('Please provide content for your submission.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { assignmentId, content };
            await axios.post('http://localhost:5000/api/submissions', payload, config);
            
            setMessage('Submission successful!');
            setContent('');
            onSubmissionSuccess();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.response) {
                setMessage(err.response.data.message || 'Submission failed.');
            } else {
                setMessage('An unexpected network error occurred.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold text-gray-700">Submit Your Work</h4>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste a link to your recording or type your response here..."
                className="w-full mt-2 p-2 border rounded"
                rows={3}
            ></textarea>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Submit
            </button>
            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
};

// ==================================================================
// --- SUB-COMPONENT: ReviewForm (for Teachers) ---
// ==================================================================
const ReviewForm = ({ submission, onReviewSuccess }: { submission: Submission; onReviewSuccess: () => void }) => {
    const { token } = useAuth();
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { grade, feedback };
            await axios.patch(`http://localhost:5000/api/submissions/${submission._id}/review`, payload, config);

            setMessage('Review submitted successfully!');
            onReviewSuccess();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.response) {
                setMessage(err.response.data.message || 'Failed to submit review.');
            } else {
                setMessage('An unexpected network error occurred.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 p-3 bg-yellow-50 rounded-md border border-yellow-200">
            <h5 className="font-bold text-sm text-gray-700">Provide Feedback</h5>
            <div className="mt-2">
                <label htmlFor={`grade-${submission._id}`} className="block text-xs font-medium text-gray-600">Grade</label>
                <input
                    type="text"
                    id={`grade-${submission._id}`}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g., Excellent, Good"
                    className="w-full mt-1 p-1 border rounded text-sm"
                />
            </div>
            <div className="mt-2">
                <label htmlFor={`feedback-${submission._id}`} className="block text-xs font-medium text-gray-600">Feedback</label>
                <textarea
                    id={`feedback-${submission._id}`}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your comments..."
                    className="w-full mt-1 p-1 border rounded text-sm"
                    rows={2}
                ></textarea>
            </div>
            <button type="submit" className="mt-2 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600">
                Submit Review
            </button>
            {message && <p className="text-xs mt-2">{message}</p>}
        </form>
    );
};

// ==================================================================
// --- SUB-COMPONENT: SubmissionsList (for Teachers) ---
// ==================================================================
const SubmissionsList = ({ assignmentId }: { assignmentId: string }) => {
    const { token } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get<Submission[]>(`http://localhost:5000/api/submissions/assignment/${assignmentId}`, config);
            setSubmissions(response.data);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        } finally {
            setLoading(false);
        }
    }, [assignmentId, token]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    if (loading) return <p className="mt-4">Loading submissions...</p>;

    return (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h4 className="font-semibold text-gray-700">Submissions for this Assignment</h4>
            {submissions.length > 0 ? (
                <ul className="mt-2 space-y-4">
                    {submissions.map(sub => (
                        <li key={sub._id} className="p-2 border-b">
                            <p><strong>Student:</strong> {sub.student.username}</p>
                            <p><strong>Submission:</strong> {sub.content}</p>
                            <p className="text-xs text-gray-500">Submitted on: {new Date(sub.createdAt).toLocaleDateString()}</p>
                            
                            {sub.status === 'Reviewed' ? (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <h5 className="font-bold text-sm text-blue-800">Feedback Given</h5>
                                    <p><strong>Grade:</strong> {sub.grade}</p>
                                    <p><strong>Comments:</strong> {sub.feedback}</p>
                                </div>
                            ) : (
                                <ReviewForm submission={sub} onReviewSuccess={fetchSubmissions} />
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No submissions yet.</p>
            )}
        </div>
    );
};




// ==================================================================
// --- THE MAIN PAGE COMPONENT ---
// ==================================================================
const LessonLogForm = ({ circleId, onLogSuccess }: { circleId: string; onLogSuccess: () => void }) => {
    const { token } = useAuth();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [specialization, setSpecialization] = useState<'Quran' | 'Arabic Language' | 'Islamic Lessons'>('Quran');
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { circleId, date, specialization, topic, notes };
            await axios.post('http://localhost:5000/api/lessonlogs', payload, config);
            setMessage('Lesson logged successfully!');
            setTopic('');
            setNotes('');
            onLogSuccess();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to log lesson.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow border my-8">
            <h2 className="text-2xl font-bold mb-4">Log a New Lesson</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Specialization</label>
                        <select value={specialization} onChange={e => setSpecialization(e.target.value as any)} className="w-full p-2 border rounded">
                            <option>Quran</option>
                            <option>Arabic Language</option>
                            <option>Islamic Lessons</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block font-bold mb-1">Topic Covered</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border rounded" required placeholder="e.g., Surah Al-Baqarah, Ayahs 1-10" />
                </div>
                <div className="mt-4">
                    <label className="block font-bold mb-1">Notes (Optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
                </div>
                <button type="submit" className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">
                    Save Lesson Log
                </button>
                {message && <p className="mt-2 text-center">{message}</p>}
            </form>
        </div>
    );
};

const LessonLogList = ({ circleId }: { circleId: string }) => {
    const { token } = useAuth();
    const [logs, setLogs] = useState<LessonLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<LessonLog[]>(`http://localhost:5000/api/lessonlogs/circle/${circleId}`, config);
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch lesson logs', error);
        } finally {
            setLoading(false);
        }
    }, [token, circleId]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    if (loading) return <p className="mt-8">Loading lesson history...</p>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Lesson History</h2>
            <div className="space-y-4">
                {logs.length > 0 ? logs.map(log => (
                    <div key={log._id} className="bg-white p-4 rounded-lg shadow border">
                        <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
                        <p className="font-bold">{log.topic}</p>
                        <p className="text-sm"><span className="font-semibold">Category:</span> {log.specialization}</p>
                        {log.notes && <p className="text-sm mt-1"><span className="font-semibold">Notes:</span> {log.notes}</p>}
                    </div>
                )) : <p>No lessons have been logged for this circle yet.</p>}
            </div>
        </div>
    );
};


// ==================================================================
// --- THE MAIN PAGE COMPONENT ---
// ==================================================================
const CircleDetailPage = () => {
    const { circleId } = useParams<{ circleId: string }>();
    const { user, token } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState<string | null>(null);
    const [logCount, setLogCount] = useState(0); // This state is used to trigger a refresh

    const fetchAssignments = useCallback(async () => {
        if (!token || !circleId) {
            setError("Missing information.");
            setLoadingAssignments(false);
            return;
        }
        try {
            setLoadingAssignments(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get<Assignment[]>(`http://localhost:5000/api/assignments/circle/${circleId}`, config);
            setAssignments(response.data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch assignments.");
        } finally {
            setLoadingAssignments(false);
        }
    }, [token, circleId]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const handleViewSubmissions = (assignmentId: string) => {
        setViewingSubmissionsFor(prev => (prev === assignmentId ? null : assignmentId));
    };

    if (loadingAssignments) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* THIS IS THE MISSING PIECE: The Lesson Log Form for Teachers */}
            {user?.role === 'Teacher' && circleId && (
                <LessonLogForm 
                    circleId={circleId} 
                    onLogSuccess={() => setLogCount(count => count + 1)} 
                />
            )}
            
            {/* The rest of the page layout */}
            <div className="my-8">
                <h1 className="text-3xl font-bold mb-6">Assignments</h1>
                <div className="space-y-4">
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <div key={assignment._id} className="bg-white p-4 rounded-lg shadow border">
                                <h2 className="text-xl font-semibold">{assignment.title}</h2>
                                <p className="text-sm text-gray-500">
                                    Assigned by: {assignment.createdBy.username} on {new Date(assignment.createdAt).toLocaleDateString()}
                                </p>
                                {assignment.dueDate && (
                                    <p className="text-sm text-red-600 font-semibold">
                                        Due by: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </p>
                                )}
                                <p className="text-gray-700 mt-2">{assignment.description}</p>
                                
                                {user?.role === 'Student' && (
                                    <SubmissionForm 
                                        assignmentId={assignment._id} 
                                        onSubmissionSuccess={() => alert('Submission received!')} 
                                    />
                                )}

                                {user?.role === 'Teacher' && (
                                    <button 
                                        onClick={() => handleViewSubmissions(assignment._id)} 
                                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        {viewingSubmissionsFor === assignment._id ? 'Hide Submissions' : 'View Submissions'}
                                    </button>
                                )}

                                {viewingSubmissionsFor === assignment._id && (
                                    <SubmissionsList assignmentId={assignment._id} />
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No assignments have been posted for this circle yet.</p>
                    )}
                </div>
            </div>

            <hr className="my-8" />
            
            {/* The Lesson History, which is visible to everyone */}
            {circleId && <LessonLogList key={logCount} circleId={circleId} />}
        </div>
    );
};

export default CircleDetailPage;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';


// --- TYPE DEFINITIONS ---
interface Assignment { _id: string; title: string; description: string; dueDate?: string; createdBy: { _id: string; username: string }; createdAt: string; }
interface Submission { _id: string; student: { _id: string; username: string }; content: string; status: 'Submitted' | 'Reviewed'; grade?: string; feedback?: string; createdAt: string; }
interface LessonLog { _id: string; date: string; specialization: 'Quran' | 'Arabic Language' | 'Islamic Lessons'; topic: string; notes?: string; teacher: { _id: string, username: string }; }

// ==================================================================
// --- SUB-COMPONENT: SubmissionForm ---
// ==================================================================
const SubmissionForm = ({ assignmentId, onSubmissionSuccess }: { assignmentId: string; onSubmissionSuccess: () => void }) => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!content) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/submissions', { assignmentId, content }, config);
            setMessage(t('Submission successful!'));
            setContent('');
            onSubmissionSuccess();
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Submission failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold text-gray-700">{t('circle_detail_page.submission_form.title')}</h4>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('circle_detail_page.submission_form.placeholder')}
                className="w-full mt-2 p-2 border rounded"
                rows={3}
            ></textarea>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {t('circle_detail_page.submission_form.submit_button')}
            </button>
            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
};

// ==================================================================
// --- SUB-COMPONENT: ReviewForm ---
// ==================================================================
const ReviewForm = ({ submission, onReviewSuccess }: { submission: Submission; onReviewSuccess: () => void }) => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`http://localhost:5000/api/submissions/${submission._id}/review`, { grade, feedback }, config);
            setMessage('Review submitted successfully!');
            onReviewSuccess();
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to submit review.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 p-3 bg-yellow-50 rounded-md border border-yellow-200">
            <h5 className="font-bold text-sm text-gray-700">{t('circle_detail_page.review_form.title')}</h5>
            <div className="mt-2">
                <label className="block text-xs font-medium text-gray-600">{t('circle_detail_page.review_form.grade_label')}</label>
                <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder={t('circle_detail_page.review_form.grade_placeholder')} className="w-full mt-1 p-1 border rounded text-sm" />
            </div>
            <div className="mt-2">
                <label className="block text-xs font-medium text-gray-600">{t('circle_detail_page.review_form.feedback_label')}</label>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t('circle_detail_page.review_form.feedback_placeholder')} className="w-full mt-1 p-1 border rounded text-sm" rows={2}></textarea>
            </div>
            <button type="submit" className="mt-2 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600">
                {t('circle_detail_page.review_form.submit_button')}
            </button>
            {message && <p className="text-xs mt-2">{message}</p>}
        </form>
    );
};

// ==================================================================
// --- SUB-COMPONENT: SubmissionsList ---
// ==================================================================
const SubmissionsList = ({ assignmentId }: { assignmentId: string }) => {
    const { t } = useTranslation();
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

    if (loading) return <p className="mt-4">{t('circle_detail_page.submissions_list.loading')}</p>;

    return (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h4 className="font-semibold text-gray-700">{t('circle_detail_page.submissions_list.title')}</h4>
            {submissions.length > 0 ? (
                <ul className="mt-2 space-y-4">
                    {submissions.map(sub => (
                        <li key={sub._id} className="p-2 border-b">
                            <p><strong>{t('circle_detail_page.submissions_list.student_label')}</strong> {sub.student.username}</p>
                            <p><strong>{t('circle_detail_page.submissions_list.submission_label')}</strong> {sub.content}</p>
                            <p className="text-xs text-gray-500">{t('circle_detail_page.submissions_list.submitted_on')} {new Date(sub.createdAt).toLocaleDateString()}</p>
                            {sub.status === 'Reviewed' ? (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <h5 className="font-bold text-sm text-blue-800">{t('circle_detail_page.submissions_list.feedback_given')}</h5>
                                    <p><strong>{t('circle_detail_page.review_form.grade_label')}</strong> {sub.grade}</p>
                                    <p><strong>{t('circle_detail_page.submissions_list.comments_label')}</strong> {sub.feedback}</p>
                                </div>
                            ) : (
                                <ReviewForm submission={sub} onReviewSuccess={fetchSubmissions} />
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{t('circle_detail_page.submissions_list.no_submissions')}</p>
            )}
        </div>
    );
};

// ==================================================================
// --- SUB-COMPONENT: LessonLogForm ---
// ==================================================================
const LessonLogForm = ({ circleId, onLogSuccess }: { circleId: string; onLogSuccess: () => void }) => {
    const { t } = useTranslation();
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
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to log lesson.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow border my-8">
            <h2 className="text-2xl font-bold mb-4">{t('circle_detail_page.log_new_lesson')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-1 rtl:text-right">{t('circle_detail_page.lesson_log_form.date_label')}</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1 rtl:text-right">{t('circle_detail_page.lesson_log_form.specialization_label')}</label>
                        <select value={specialization} onChange={e => setSpecialization(e.target.value as any)} className="w-full p-2 border rounded">
                            <option value="Quran">{t('circle_detail_page.specializations.quran')}</option>
                            <option value="Arabic Language">{t('circle_detail_page.specializations.arabic_language')}</option>
                            <option value="Islamic Lessons">{t('circle_detail_page.specializations.islamic_lessons')}</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block font-bold mb-1 rtl:text-right">{t('circle_detail_page.lesson_log_form.topic_label')}</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border rounded" required placeholder={t('circle_detail_page.lesson_log_form.topic_placeholder')} />
                </div>
                <div className="mt-4">
                    <label className="block font-bold mb-1 rtl:text-right">{t('circle_detail_page.lesson_log_form.notes_label')}</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
                </div>
                <button type="submit" className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">
                    {t('circle_detail_page.lesson_log_form.submit_button')}
                </button>
                {message && <p className="mt-2 text-center">{message}</p>}
            </form>
        </div>
    );
};

// ==================================================================
// --- SUB-COMPONENT: LessonLogList ---
// ==================================================================
const LessonLogList = ({ circleId, logCount }: { circleId: string; logCount: number }) => {
    const { t } = useTranslation();
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
    }, [fetchLogs, logCount]); 

    if (loading) return <p className="mt-8">{t('circle_detail_page.loading_history')}</p>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{t('circle_detail_page.lesson_history_title')}</h2>
            <div className="space-y-4">
                {logs.length > 0 ? logs.map(log => (
                    <div key={log._id} className="bg-white p-4 rounded-lg shadow border">
                        <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
                        <p className="font-bold">{log.topic}</p>
                        <p className="text-sm"><span className="font-semibold">{t('circle_detail_page.lesson_log_list.category_label')}</span> {t(`circle_detail_page.specializations.${log.specialization.toLowerCase().replace(' ', '_')}` as const, log.specialization)}</p>
                        {log.notes && <p className="text-sm mt-1"><span className="font-semibold">{t('circle_detail_page.lesson_log_list.notes_label')}</span> {log.notes}</p>}
                    </div>
                )) : <p>{t('circle_detail_page.no_lessons_logged')}</p>}
            </div>
        </div>
    );
};

// ==================================================================
// --- THE MAIN PAGE COMPONENT ---
// ==================================================================
const CircleDetailPage = () => {
    const { t } = useTranslation();
    const { circleId } = useParams<{ circleId: string }>();
    const { user, token } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState<string | null>(null);
    const [logCount, setLogCount] = useState(0);

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

    if (loadingAssignments) return <div className="p-10 text-center">{t('circle_detail_page.loading_assignments')}</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {user?.role === 'Teacher' && circleId && (
                <LessonLogForm 
                    circleId={circleId} 
                    onLogSuccess={() => setLogCount(count => count + 1)} 
                />
            )}
            
            <div className="my-8">
                <h1 className="text-3xl font-bold mb-6">{t('circle_detail_page.assignments_title')}</h1>
                <div className="space-y-4">
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <div key={assignment._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">{assignment.title}</h2>
                                <p className="text-sm text-gray-500" dir="auto">
                                    {t('circle_detail_page.assigned_by', { teacher: assignment.createdBy.username, date: new Date(assignment.createdAt).toLocaleDateString() })}
                                </p>
                                {assignment.dueDate && (
                                    <p className="text-sm text-red-600 font-semibold" dir="auto">
                                        {t('circle_detail_page.due_by', { date: new Date(assignment.dueDate).toLocaleDateString() })}
                                    </p>
                                )}
                                <p className="text-gray-700 mt-2">{assignment.description}</p>
                                
                                {user?.role === 'Student' && (
                                    <SubmissionForm 
                                        assignmentId={assignment._id} 
                                        onSubmissionSuccess={() => alert(t('Submission received!'))} 
                                    />
                                )}

                                {user?.role === 'Teacher' && (
                                    <button 
                                        onClick={() => handleViewSubmissions(assignment._id)} 
                                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        {viewingSubmissionsFor === assignment._id ? t('circle_detail_page.hide_submissions_button') : t('circle_detail_page.view_submissions_button')}
                                    </button>
                                )}

                                {viewingSubmissionsFor === assignment._id && (
                                    <SubmissionsList assignmentId={assignment._id} />
                                )}
                            </div>
                        ))
                    ) : (
                        <p>{t('circle_detail_page.no_assignments_message')}</p>
                    )}
                </div>
            </div>

            <hr className="my-8" />
            
            {circleId && <LessonLogList key={logCount} circleId={circleId} logCount={0} />}
        </div>
    );
};

export default CircleDetailPage;
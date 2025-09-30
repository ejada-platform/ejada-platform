import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { showConfirmationDialog, showErrorAlert, showSuccessAlert } from '../services/alert.service';

// --- TYPE DEFINITIONS ---
interface PopulatedUser {
    _id: string;
    username: string;
}
interface ScheduleEntry {
    day: string;
    time: string;
}
interface CircleData {
    _id: string;
    name: string;
    description?: string;
    teacher?: PopulatedUser;
    students?: PopulatedUser[];
    liveClassUrl?: string;
    schedule?: ScheduleEntry[];
    starStudent?: string;
}

// ==================================================================
// --- SUB-COMPONENT: EvaluationForm (for Teachers) ---
// This component remains unchanged.
// ==================================================================
const EvaluationForm = ({ studentId, circleId, onEvaluationSuccess }: { studentId: string; circleId: string; onEvaluationSuccess: () => void }) => {
    const { token } = useAuth();
    const [rating, setRating] = useState(5);
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { studentId, circleId, rating, notes };
            await axios.post('http://localhost:5000/api/evaluations', payload, config);
            setMessage('Evaluation saved successfully!');
            setNotes('');
            onEvaluationSuccess();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to save evaluation.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2 p-3 bg-gray-50 rounded-md border">
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600">Notes for today</label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Excellent recitation"
                        className="w-full mt-1 p-1 border rounded text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600">Rating (1-5)</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value, 10))}
                        className="w-20 mt-1 p-1 border rounded text-sm"
                    />
                </div>
            </div>
            <button type="submit" className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                Save Evaluation
            </button>
            {message && <p className="text-xs mt-2">{message}</p>}
        </form>
    );
};


// ==================================================================
// --- THE MAIN PAGE COMPONENT (WITH UPDATES) ---
// ==================================================================
const MyCirclesPage = () => {
    const {t} = useTranslation();
    const { user, token } = useAuth();
    const [circles, setCircles] = useState<CircleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [evaluatingStudentId, setEvaluatingStudentId] = useState<string | null>(null);

    const fetchMyCircles = useCallback(async () => {
        if (!token) {
            setLoading(false);
            setError("You must be logged in to view your circles.");
            return;
        }
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get<CircleData[]>('http://localhost:5000/api/circles/my-circles', config);
            setCircles(response.data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch circles.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMyCircles();
    }, [fetchMyCircles]);

    const handleEvaluateClick = (studentId: string) => {
        setEvaluatingStudentId(prevId => (prevId === studentId ? null : prevId));
    };

    if (loading) return <div className="p-10">{t('my_circles_page.loading')}</div>;
    if (error) return <div className="p-10 text-red-500">{error}</div>;

    const handleSetStarStudent = async (circleId: string, studentId: string) => {
        const result = await showConfirmationDialog('Set Star Student?', 'This will make them the featured student for this circle.');
        if (result.isConfirmed) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const payload = { starStudent: studentId };
                await axios.put(`http://localhost:5000/api/circles/${circleId}`, payload, config);
                showSuccessAlert('Success!', 'Star Student has been updated.');
                fetchMyCircles(); // Refresh the data to show the new star
            } catch (err) {
                showErrorAlert('Error!', 'Failed to set star student.');
            }
        }
    };

    
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('my_circles_page.title')}</h1>
            <div className="space-y-6">
                {circles.length > 0 ? (
                    circles.map((circle) => (
                        <div key={circle._id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <Link to={`/circle/${circle._id}`}>
                                    <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600">{circle.name}</h2>
                                </Link>
                                {user?.role === 'Teacher' && (
                                    <Link to={`/teacher/edit-circle/${circle._id}`} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600">
                                        {t('my_circles_page.edit_button')}
                                    </Link>
                                )}
                            </div>

                            {circle.description && <p className="text-gray-600 my-2">{circle.description}</p>}

                            {circle.schedule && circle.schedule.length > 0 && (
                                <div className="my-3">
                                    {circle.schedule.map((s, index) => (
                                        <p key={index} className="text-sm text-gray-700 font-semibold">
                                            - Every {s.day} at {s.time}
                                        </p>
                                    ))}
                                </div>
                            )}
                            
                            {/* Student's view can be added here if needed */}
                            {user?.role === 'Student' && (
                            <div className="mt-4">
                                 {/* The new banner that shows if the logged-in student is the star of THIS circle */}
                                 {circle.starStudent === user._id && (
                                    <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md mb-4">
                                        <p className="font-bold flex items-center">
                                            <span className="text-xl mr-2">★</span>
                                            Congratulations! You are the Star Student of this circle!
                                        </p>
                                    </div>
                                )}
                                
                                {circle.teacher && (
                                    <p className="text-gray-700 mb-4">
                                        <strong>{t('my_circles_page.teacher_label')}</strong> {circle.teacher.username}
                                    </p>
                                )}

                                {circle.liveClassUrl ? (
                                    <a
                                        href={circle.liveClassUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-lg">{t('my_circles_page.join_class_button')}</p>
                                                <p className="text-sm opacity-90">Your lesson is waiting!</p>
                                            </div>
                                            {/* Play Icon */}
                                            <div className="text-3xl">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                )  : (
                                    <p>{t('my_circles_page.no_link_message')}</p>
                                )}
                            </div>
                        )}
                            
                            {/* --- THIS IS THE UPDATED TEACHER'S VIEW --- */}
                            {user?.role === 'Teacher' && (
                                <>
                                    <div className="mt-4">
                                        <Link to={`/teacher/attendance/${circle._id}`} className="inline-block px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                                            {t('my_circles_page.take_attendance_button')}
                                        </Link>
                                    </div>
                                    {circle.students && circle.students.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mt-4 mb-2">{t('my_circles_page.students_in_circle')}</h3>
                                            <ul className="space-y-2">
                                                {circle.students.map(student => (
                                                    <li key={student._id} className="p-2 border-t">
                                                        <div className="flex justify-between items-center">
                                                            <span>{student.username}
                                                            {circle.starStudent === student._id && <span className="ml-2 text-yellow-400">★</span>}
                                                            </span>
                                                            </div>
                                                        <div className="space-x-2">
                                                                 {/* --- NEW BUTTON --- */}
                                                                 {circle.starStudent !== student._id && (
                                                                     <button onClick={() => handleSetStarStudent(circle._id, student._id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded">
                                                                         Make Star
                                                                     </button>
                                                                 )}
                                                            <button
                                                                onClick={() => handleEvaluateClick(student._id)}
                                                                className="px-3 py-1 bg-blue-500 text-gray-800 text-sm rounded hover:bg-blue-500"
                                                            >
                                                                {evaluatingStudentId === student._id ?  t('my_circles_page.close_button') : t('my_circles_page.evaluate_button')}
                                                            </button>
                                                        </div>
                                                        {evaluatingStudentId === student._id && (
                                                            <EvaluationForm 
                                                                studentId={student._id} 
                                                                circleId={circle._id} 
                                                                onEvaluationSuccess={() => {
                                                                    alert(t('my_circles_page.evaluation_saved'));
                                                                    setEvaluatingStudentId(null);
                                                                }}
                                                            />
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>You are not yet assigned to any educational circles.</p>
                )}
            </div>
        </div>
    );
};

export default MyCirclesPage;
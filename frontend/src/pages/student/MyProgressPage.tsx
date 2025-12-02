import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import StarStudent from '../../components/StartStudent';
import { useTranslation } from 'react-i18next'; // 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';


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

interface Certificate {
    certificateUrl: string | undefined;
    _id: string;
    program: string;
    issueDate: string;
    awardedBy: { username: string };
}

const handleDownload = (url: string, filename: string) => {
    axios.get(url, { responseType: 'blob' }) 
        .then((res) => {
            const href = window.URL.createObjectURL(res.data as Blob); 
            const link = document.createElement('a'); 
            link.href = href;
            link.setAttribute('download', `${filename}.png`);
            document.body.appendChild(link); 
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(href);
        })
        .catch(console.error);
};

const MyProgressPage = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
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
            const certificatesPromise = axios.get<Certificate[]>(`http://localhost:5000/api/certificates/student/${user._id}`, config);
            const [evaluationsResponse, statsResponse, certificatesResponse] = await Promise.all([evaluationsPromise, statsPromise, certificatesPromise]);
            setEvaluations(evaluationsResponse.data);
            setStats(statsResponse.data);
            setCertificates(certificatesResponse.data);
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

             {/* --- NEW CERTIFICATES SECTION --- */}
             <h2 className="text-2xl font-bold mb-4 mt-8">My Certificates</h2>
            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map(cert => (
                        <div key={cert._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400 flex items-center">
                            <FontAwesomeIcon icon={faCertificate} className="text-5xl text-yellow-400 mr-4" />
                            <div>
                                <p className="font-bold text-lg">Certificate of Completion</p>
                                <p className="font-semibold text-primary">{cert.program}</p>
                                <p className="text-sm text-gray-500">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
                            </div>

                            <button 
                                onClick={() => cert.certificateUrl && handleDownload(cert.certificateUrl, `Ejada_Certificate_${cert.program}`)}
                                className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600"
                            >
                                Download Certificate
                            </button>

                        </div>
                        
                    ))}
                </div>
            ) : (
                <p className="text-blue-500 text-center">You have not earned any certificates yet.</p>
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
                    <div className="bg-green-600 p-2 rounded-lg shadow text-center text-white font-bold text-3xl">
                        <p>{t('my_progress_page.no_evaluations')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProgressPage;
// src/pages/teacher/StudentProgressPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';
import Modal from '../../components/Modal';

// --- Type Definitions ---
interface Section { _id: string; title: string; description?: string; }
interface CompletedAssessment {
    section: Section;
    grade: string;
    assessmentDate: string;
}
interface StudentProgress {
    currentSection: Section;
    completedAssessments: CompletedAssessment[];
}
interface AssessmentDetails { _id: string; title: string; }

// --- Sub-Component: The Assessment Form inside the Modal ---
const ConductAssessmentForm = ({ studentId, section, onSuccess, onCancel }: { studentId: string; section: Section; onSuccess: () => void; onCancel: () => void; }) => {
    const { token } = useAuth();
    const [grade, setGrade] = useState<'Passed' | 'Needs Improvement'>('Passed');
    const [notes, setNotes] = useState('');
    const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch the assessment linked to this section
        // (This assumes a new backend endpoint: GET /api/curriculum-builder/assessment/section/:sectionId)
    }, [section._id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                studentId,
                sectionId: section._id,
                assessmentId: assessment?._id, // This needs to be fetched
                grade,
                notes
            };
            await axios.post('http://localhost:5000/api/progress/complete-assessment', payload, config);
            showSuccessAlert('Success!', 'Assessment has been recorded.');
            onSuccess();
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to record assessment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-bold mb-1">Assessment Grade</label>
                <select value={grade} onChange={e => setGrade(e.target.value as any)} className="w-full p-2 border rounded-md bg-white">
                    <option value="Passed">Passed</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                </select>
            </div>
            <div>
                <label className="block font-bold mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-md" rows={3}></textarea>
            </div>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
                    {loading ? 'Saving...' : 'Confirm Assessment'}
                </button>
            </div>
        </form>
    );
};


// --- The Main Page Component ---
const StudentProgressPage = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { token } = useAuth();
    const [progress, setProgress] = useState<StudentProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProgress = useCallback(async () => {
        if (!token || !studentId) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<StudentProgress>(`http://localhost:5000/api/progress/student/${studentId}`, config);
            setProgress(data);
        } catch (error) {
            console.error("Failed to fetch student progress", error);
        } finally {
            setLoading(false);
        }
    }, [token, studentId]);

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    if (loading) return <div className="p-8 text-center">Loading Student Progress...</div>;
    if (!progress) return <div className="p-8 text-center text-red-500">Could not find progress records for this student.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Student Progress</h1>
            
            {/* --- Current Section --- */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-2">Current Section</h2>
                <p className="text-xl font-semibold text-primary">{progress.currentSection.title}</p>
                <p className="text-gray-600">{progress.currentSection.description}</p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 inline-block py-2 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                    Conduct Assessment for this Section
                </button>
            </div>

            {/* --- Completed Sections History --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Completed Sections</h2>
                <div className="space-y-3">
                    {progress.completedAssessments.length > 0 ? progress.completedAssessments.map(item => (
                        <div key={item.section._id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                            <div>
                                <p className="font-bold">{item.section.title}</p>
                                <p className="text-xs text-gray-500">Assessed on: {new Date(item.assessmentDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`font-semibold px-3 py-1 rounded-full text-sm ${item.grade === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.grade}
                            </span>
                        </div>
                    )) : <p className="text-gray-500">No sections have been completed yet.</p>}
                </div>
            </div>

            {/* --- The Assessment Modal --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Assess: ${progress.currentSection.title}`}
            >
                {studentId && (
                    <ConductAssessmentForm 
                        studentId={studentId}
                        section={progress.currentSection}
                        onSuccess={() => { setIsModalOpen(false); fetchProgress(); }}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default StudentProgressPage;
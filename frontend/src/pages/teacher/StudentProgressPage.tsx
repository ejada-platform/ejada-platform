import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';
import Modal from '../../components/Modal';
import { useTranslation } from 'react-i18next';

// --- Type Definitions (No change) ---
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
    const { t, i18n } = useTranslation(); 
    const { token } = useAuth();
    const [grade, setGrade] = useState<'Passed' | 'Needs Improvement'>('Passed'); 
    const [notes, setNotes] = useState('');
    const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch the assessment linked to this section
    }, [section._id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                studentId,
                sectionId: section._id,
                assessmentId: assessment?._id, 
                grade,
                notes
            };
            await axios.post('http://localhost:5000/api/progress/complete-assessment', payload, config);
            // Use translation keys for alerts
            showSuccessAlert(t('student_progress_page.alert_success_title'), t('student_progress_page.alert_success_message'));
            onSuccess();
        } catch (err: any) {
            // Use translation keys for alerts
            showErrorAlert(t('student_progress_page.alert_error_title'), err.response?.data?.message || t('student_progress_page.alert_error_message'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" dir={i18n.dir()}> 
            <div>
                <label className="block font-bold mb-1">{t('student_progress_page.form_grade_label')}</label>
                <select value={grade} onChange={e => setGrade(e.target.value as any)} className="w-full p-2 border rounded-md bg-white">
                    <option value="Passed">{t('student_progress_page.grade_passed')}</option>
                    <option value="Needs Improvement">{t('student_progress_page.grade_needs_improvement')}</option>
                </select>
            </div>
            <div>
                <label className="block font-bold mb-1">{t('student_progress_page.form_notes_label')}</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-md" rows={3}></textarea>
            </div>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">{t('student_progress_page.form_button_cancel')}</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
                    {loading ? t('student_progress_page.form_button_saving') : t('student_progress_page.form_button_confirm')}
                </button>
            </div>
        </form>
    );
};


// --- The Main Page Component ---
const StudentProgressPage = () => {
    const { t, i18n } = useTranslation(); 
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

  // Inside StudentProgressPage.tsx

const getTranslatedSectionTitle = (t: (key: string) => string, englishTitle: string | undefined | null) => {
    // === CRITICAL FIX: CHECK FOR NULL/UNDEFINED/EMPTY STRING ===
    if (!englishTitle || typeof englishTitle !== 'string' || englishTitle.trim() === '') {
        return t('student_progress_page.section_title_missing') || ''; // Return a translated message or an empty string
    }
    
    // --- Now we can safely call toLowerCase() and other string methods ---

    const cleanedTitle = englishTitle.trim().toLowerCase(); 

    // The logic below is the final attempt to translate the dynamic string
    if (cleanedTitle.includes('section')) {
        // Find the "1-10" part and append it to the translation
        const rangeMatch = englishTitle.match(/\d+-\d+/);
        const range = rangeMatch ? ` ${rangeMatch[0]}` : '';
        
        // Return the translated generic name plus the range
        return t('student_progress_page.section_title_reading_section') + range;
    }
    
    // Fallback: Return original
    return englishTitle;
};
    
    // Apply translation logic before rendering
    const currentSectionTitle = progress ? getTranslatedSectionTitle(t, progress.currentSection.title) : '';

    if (loading) return <div className="p-8 text-center">{t('student_progress_page.loading_progress')}</div>;
    if (!progress) return <div className="p-8 text-center text-red-500">{t('student_progress_page.error_not_found')}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto" dir={i18n.dir()}> 
            <h1 className="text-3xl font-bold mb-6">{t('student_progress_page.page_title')}</h1>
            
            {/* --- Current Section --- */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-2">{t('student_progress_page.current_section_title')}</h2>
                {/* FIX APPLIED HERE */}
                <p className="text-xl font-semibold text-primary">{currentSectionTitle}</p>
                <p className="text-gray-600">{progress.currentSection.description}</p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 inline-block py-2 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                    {t('student_progress_page.conduct_assessment_button')}
                </button>
            </div>

            {/* --- Completed Sections History --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('student_progress_page.completed_sections_title')}</h2>
                <div className="space-y-3">
                    {progress.completedAssessments.length > 0 ? progress.completedAssessments.map(item => {
                        const completedSectionTitle = getTranslatedSectionTitle(t, item.section.title); // Use helper here too
                        return (
                            <div key={item.section._id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{completedSectionTitle}</p>
                                    <p className="text-xs text-gray-500">
                                        {t('student_progress_page.assessed_on')} {new Date(item.assessmentDate).toLocaleDateString(i18n.language)}
                                    </p>
                                </div>
                                <span className={`font-semibold px-3 py-1 rounded-full text-sm ${item.grade === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {item.grade === 'Passed' ? t('student_progress_page.grade_passed') : t('student_progress_page.grade_needs_improvement')}
                                </span>
                            </div>
                        );
                    }) : <p className="text-gray-500">{t('student_progress_page.no_sections_completed')}</p>}
                </div>
            </div>

            {/* --- The Assessment Modal --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${t('student_progress_page.modal_assess_title')} ${currentSectionTitle}`}
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
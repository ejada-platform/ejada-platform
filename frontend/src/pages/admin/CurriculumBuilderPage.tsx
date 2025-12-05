import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next'; // ADDED useTranslation
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';

// --- Type Definitions ---
interface Section {
    _id: string;
    title: string;
    order: number;
    description?: string;
    hasAssessment?: boolean;
}
interface Assessment {
    _id: string;
    title: string;
    section: string; 
}

// Map the API value to the translation key
const programMap = {
    'Reading <7': 'program_reading_under_7',
    'Reading 7+': 'program_reading_7_plus',
    'Reciting': 'program_reciting',
    'Memorizing': 'program_memorizing',
};

const programs = ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing']; // Keep English for API/Value

const CurriculumBuilderPage = () => {
    const { t, i18n } = useTranslation(); // ADDED useTranslation
    const { token } = useAuth();
    const [selectedProgram, setSelectedProgram] = useState(programs[0]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Form State for adding a new section ---
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDesc, setNewSectionDesc] = useState('');

    const fetchProgramData = useCallback(async () => {
        if (!token || !selectedProgram) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Fetch both sections and assessments for the selected program
            const sectionsPromise = axios.get<Section[]>(`http://localhost:5000/api/curriculum-builder/sections/${selectedProgram}`, config);
            const assessmentsPromise = axios.get<Assessment[]>(`http://localhost:5000/api/curriculum-builder/assessments/${selectedProgram}`, config);

            const [sectionsRes, assessmentsRes] = await Promise.all([sectionsPromise, assessmentsPromise]);
            
            // Create a Set of section IDs that have an assessment for quick lookup
            const assessedSectionIds = new Set(assessmentsRes.data.map(a => a.section));

            // Add a 'hasAssessment' flag to each section
            const sectionsWithStatus = sectionsRes.data.map(s => ({
                ...s,
                hasAssessment: assessedSectionIds.has(s._id)
            }));

            setSections(sectionsWithStatus);
        } catch (error) {
            console.error("Failed to fetch program data", error);
        } finally {
            setLoading(false);
        }
    }, [token, selectedProgram]);

    useEffect(() => {
        fetchProgramData();
    }, [fetchProgramData]);

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                title: newSectionTitle,
                description: newSectionDesc,
                program: selectedProgram,
                order: sections.length + 1 // Automatically set the next order number
            };
            await axios.post('http://localhost:5000/api/curriculum-builder/sections', payload, config);
            showSuccessAlert(t('curriculum_builder_page.alert_success_title'), t('curriculum_builder_page.alert_section_success'));
            setNewSectionTitle('');
            setNewSectionDesc('');
            fetchProgramData(); // Refresh the list
        } catch (err: any) {
            showErrorAlert(t('curriculum_builder_page.alert_error_title'), err.response?.data?.message || t('curriculum_builder_page.alert_error_message'));
        }
    };

    const handleAddAssessment = async (sectionId: string, sectionTitle: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                title: t('curriculum_builder_page.assessment_for', { sectionTitle: sectionTitle }), // New key for dynamic title
                section: sectionId,
                program: selectedProgram
            };
            await axios.post('http://localhost:5000/api/curriculum-builder/assessments', payload, config);
            showSuccessAlert(t('curriculum_builder_page.alert_success_title'), t('curriculum_builder_page.alert_assessment_success'));
            fetchProgramData(); // Refresh the list
        } catch (err: any) {
            showErrorAlert(t('curriculum_builder_page.alert_error_title'), err.response?.data?.message || t('curriculum_builder_page.alert_assessment_error'));
        }
    };
    
    // Get the translated program name for the UI (e.g., "Sections for 'Reciting'")
    const translatedProgramName = programMap[selectedProgram as keyof typeof programMap] ? t(`curriculum_builder_page.${programMap[selectedProgram as keyof typeof programMap]}`) : selectedProgram;


    return (
        <div className="p-8 max-w-4xl mx-auto" dir={i18n.dir()}> {/* Applied RTL */}
            <h1 className="text-3xl font-bold mb-6">{t('curriculum_builder_page.page_title')}</h1>

            {/* --- Program Selector --- */}
            <div className="mb-6">
                <label className="block font-bold mb-1">{t('curriculum_builder_page.select_program_label')}</label>
                <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    {programs.map(p => 
                        // Display translated text, but keep the original English value for the API
                        <option key={p} value={p}>
                            {programMap[p as keyof typeof programMap] ? t(`curriculum_builder_page.${programMap[p as keyof typeof programMap]}`) : p}
                        </option>
                    )}
                </select>
            </div>

            {/* --- List of Sections --- */}
            <div className="bg-green-700 text-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('curriculum_builder_page.sections_for')} "{translatedProgramName}"</h2>
                {loading ? <p>{t('curriculum_builder_page.loading_sections')}</p> : (
                    <div className="space-y-3">
                        {sections.map(section => (
                            <div key={section._id} className="border rounded-lg p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{section.order}. {section.title}</p>
                                    <p className="text-sm text-black-300 border-l-8 border-l-black pl-2">
                                        {section.description ? `${t('curriculum_builder_page.section_description_prefix')} ${section.description}` : ''}
                                    </p>
                                </div>
                                {section.hasAssessment ? (
                                    <span className="text-sm font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full">{t('curriculum_builder_page.assessment_added')}</span>
                                ) : (
                                    <button onClick={() => handleAddAssessment(section._id, section.title)} className="px-3 font-bold py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                                        {t('curriculum_builder_page.button_add_assessment')}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Form to Add New Section --- */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">{t('curriculum_builder_page.add_section_title')}</h2>
                <form onSubmit={handleAddSection} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">{t('curriculum_builder_page.section_title_label')}</label>
                        <input type="text" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">{t('curriculum_builder_page.section_desc_label')}</label>
                        <input type="text" value={newSectionDesc} onChange={e => setNewSectionDesc(e.target.value)} className="w-full p-2 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-green-700 text-white font-bold rounded hover:opacity-90">
                        {t('curriculum_builder_page.button_add_section_prefix')} "{translatedProgramName}"
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CurriculumBuilderPage;
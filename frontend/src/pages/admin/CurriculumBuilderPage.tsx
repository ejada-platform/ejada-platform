import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
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

const programs = ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'];

const CurriculumBuilderPage = () => {
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
            showSuccessAlert('Success!', 'New section has been added.');
            setNewSectionTitle('');
            setNewSectionDesc('');
            fetchProgramData(); // Refresh the list
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to add section.');
        }
    };

    const handleAddAssessment = async (sectionId: string, sectionTitle: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                title: `Assessment for: ${sectionTitle}`,
                section: sectionId,
                program: selectedProgram
            };
            await axios.post('http://localhost:5000/api/curriculum-builder/assessments', payload, config);
            showSuccessAlert('Success!', 'Assessment has been added to the section.');
            fetchProgramData(); // Refresh the list
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to add assessment.');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Curriculum Builder</h1>

            {/* --- Program Selector --- */}
            <div className="mb-6">
                <label className="block font-bold mb-1">Select Program to Edit</label>
                <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    {programs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            {/* --- List of Sections --- */}
            <div className="bg-green-700 text-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Sections for "{selectedProgram}"</h2>
                {loading ? <p>Loading sections...</p> : (
                    <div className="space-y-3">
                        {sections.map(section => (
                            <div key={section._id} className="border rounded-lg p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{section.order}. {section.title}</p>
                                    <p className="text-sm text-black-300 border-l-8 border-l-black pl-2">{section.description}</p>
                                </div>
                                {section.hasAssessment ? (
                                    <span className="text-sm font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Assessment Added</span>
                                ) : (
                                    <button onClick={() => handleAddAssessment(section._id, section.title)} className="px-3 font-bold py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                                        + Add Assessment
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Form to Add New Section --- */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Add a New Section</h2>
                <form onSubmit={handleAddSection} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">Section Title</label>
                        <input type="text" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Description (e.g., Pages 1-20)</label>
                        <input type="text" value={newSectionDesc} onChange={e => setNewSectionDesc(e.target.value)} className="w-full p-2 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-green-700 text-white font-bold rounded hover:opacity-90">
                        Add Section to "{selectedProgram}"
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CurriculumBuilderPage;
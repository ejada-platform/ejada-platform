import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';

// --- Type Definitions ---
interface Student { _id: string; username: string; }
// UPDATED: Circle now MUST include 'program' to fetch sections
interface Circle { _id: string; name: string; students: Student[]; program: string; } 
// NEW: Section interface
interface Section { _id: string; title: string; order: number; } 
interface SelectOption { value: string; label: string; }

const CreateAssignmentPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    
    // Core State
    const [myCircles, setMyCircles] = useState<Circle[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(true);

    // Circle and Section State (NEW)
    const [selectedCircle, setSelectedCircle] = useState<SelectOption | null>(null);
    const [sections, setSections] = useState<Section[]>([]); // NEW
    const [selectedSection, setSelectedSection] = useState<SelectOption | null>(null); // NEW
    
    // Student State
    const [studentOptions, setStudentOptions] = useState<SelectOption[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<SelectOption[]>([]);

    const fetchMyCircles = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Ensure this backend route returns the 'program' field on the Circle object!
            const { data } = await axios.get<Circle[]>('http://localhost:5000/api/circles/my-circles', config);
            setMyCircles(data);
        } catch (error) {
            console.error("Failed to fetch circles", error);
        } finally {
            setLoading(false);
        }
    }, [token]);
    
    // NEW FUNCTION: Fetch sections for the program name (e.g., "Reading 7+")
    const fetchSectionsForProgram = useCallback(async (programName: string) => { 
        if (!token || !programName) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // *** NOTE: YOU MUST HAVE THIS BACKEND ROUTE WORKING! ***
            const { data } = await axios.get<Section[]>(`http://localhost:5000/api/sections/program/${programName}`, config);
            setSections(data.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error(`Failed to fetch sections for program ${programName}`, error);
            setSections([]);
        }
    }, [token]);

    useEffect(() => {
        fetchMyCircles();
    }, [fetchMyCircles]);

    const handleCircleChange = (option: SelectOption | null) => {
        setSelectedCircle(option);
        setSelectedSection(null); // CRITICAL: Reset section state
        setSections([]); // CRITICAL: Clear section options

        if (option) {
            const circle = myCircles.find(c => c._id === option.value);
            if (circle) {
                // Students logic
                const options = circle.students.map(s => ({ value: s._id, label: s.username }));
                setStudentOptions(options);
                setSelectedStudents(options); 
                
                // Section logic
                fetchSectionsForProgram(circle.program); 
            }
        } else {
            setStudentOptions([]);
            setSelectedStudents([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // UPDATED VALIDATION: Must select a section
        if (!title || !selectedCircle || !selectedSection || selectedStudents.length === 0) {
            showErrorAlert('Missing Fields', 'Please provide a title, select a circle, a section, and at least one student.');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                title,
                description,
                dueDate: dueDate || undefined,
                circleId: selectedCircle.value,
                sectionId: selectedSection.value, // CRITICAL: ADDED sectionId to payload
                studentIds: selectedStudents.map(s => s.value),
            };
            await axios.post('http://localhost:5000/api/assignments', payload, config);
            showSuccessAlert('Success!', t('create_assignment_page.success_message'));
            setTitle(''); setDescription(''); setDueDate(''); setSelectedCircle(null); setSelectedSection(null); // Reset all states
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to create assignment.');
        }
    };

    const circleOptions = myCircles.map(c => ({ value: c._id, label: c.name }));
    // NEW: Options for the section select dropdown
    const sectionOptions = sections.map(s => ({ value: s._id, label: `${s.order}. ${s.title}` }));

    if (loading) return <div className="p-8">Loading your circles...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('create_assignment_page.title')}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.assignment_title_label')}</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.description_label')}</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" rows={4} />
                </div>
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.due_date_label')}</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                
                {/* 1. Select Circle */}
                <div>
                    <label className="block font-bold mb-1">{t('create_assignment_page.select_circle_label')}</label>
                    <Select options={circleOptions} value={selectedCircle} onChange={handleCircleChange} required />
                </div>
                
                {/* 2. NEW: Select Section (Appears after circle is selected and sections are loaded) */}
                {selectedCircle && sections.length > 0 && (
                    <div>
                        <label className="block font-bold mb-1">{t('create_assignment_page.select_section')}</label>
                        <Select 
                            options={sectionOptions} 
                            value={selectedSection} 
                            onChange={setSelectedSection} 
                            placeholder={t('create_assignment_page.select_section_placeholder')} 
                            required 
                        />
                    </div>
                )}

                {/* 3. Assign To (Students) */}
                {selectedCircle && (
                    <div>
                        <label className="block font-bold mb-1">{t('create_assignment_page.assign_to')}</label>
                        <Select
                            isMulti
                            options={studentOptions}
                            value={selectedStudents}
                            onChange={newValue => setSelectedStudents(newValue as SelectOption[])}
                            placeholder={t('create_assignment_page.assign_to_placeholder')}
                        />
                    </div>
                )}
                
                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                    {t('create_assignment_page.submit_button')}
                </button>
            </form>
        </div>
    );
};

export default CreateAssignmentPage;
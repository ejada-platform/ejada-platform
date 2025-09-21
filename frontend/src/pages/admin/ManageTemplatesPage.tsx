// src/pages/admin/ManageTemplatesPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert, showErrorAlert, showConfirmationDialog } from '../../services/alert.service';

interface Template {
    program: string;
    templateUrl: string;
}

const ManageTemplatesPage = () => {
    const { token } = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [program, setProgram] = useState('Reciting');
    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchTemplates = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<Template[]>('http://localhost:5000/api/certificates/templates', config);
            setTemplates(data);
        } catch (error) {
            console.error("Failed to fetch templates");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateFile) {
            showErrorAlert('No File', 'Please select a template file to upload.');
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append('program', program);
        formData.append('templateFile', templateFile);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/certificates/templates', formData, config);
            showSuccessAlert('Success!', 'Certificate template uploaded successfully.');
            fetchTemplates();
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to upload template.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (program: string) => {
        const result = await showConfirmationDialog('Delete Template?', `Are you sure you want to delete the template for the ${program} program?`);
        if (result.isConfirmed) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` }, data: { program } };
                await axios.delete('http://localhost:5000/api/certificates/templates', config);
                showSuccessAlert('Success!', 'Template deleted successfully.');
                fetchTemplates();
            } catch (err: any) {
                showErrorAlert('Error!', err.response?.data?.message || 'Failed to delete template.');
            }
        }
    };


    if (loading) return <div className="p-8">Loading templates...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Manage Certificate Templates</h1>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">Upload a New Template</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">Program</label>
                        <select value={program} onChange={e => setProgram(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                            <option value="Reciting">Reciting</option>
                            <option value="Memorizing">Memorizing</option>
                            <option value="Reading 7+">Reading (7+)</option>
                            <option value="Reading <7">Reading (&lt;7)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Template File (PDF or Image)</label>
                        <input type="file" onChange={e => { if (e.target.files) setTemplateFile(e.target.files[0]); }} className="w-full p-2 border rounded file:..." required />
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded hover:opacity-90 disabled:bg-gray-400">
                        {isUploading ? 'Uploading...' : 'Upload Template'}
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Existing Templates</h2>
                <div className="space-y-2">
                    {templates.map(temp => (
                        <div key={temp.program} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                            <span className="font-semibold">{temp.program}</span>
                            <a href={temp.templateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a>
                            <button onClick={() => handleDelete(temp.program)} className="text-red-500 hover:underline text-sm font-semibold">
                                    Delete
                                </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageTemplatesPage;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert, showErrorAlert, showConfirmationDialog } from '../../services/alert.service';
import { useTranslation } from 'react-i18next'; // ADDED useTranslation

interface Template {
    program: string;
    templateUrl: string;
}

// Helper to map program values to translation keys
const programOptionsMap: { value: string; key: string }[] = [
    { value: "Reciting", key: 'program_reciting' },
    { value: "Memorizing", key: 'program_memorizing' },
    { value: "Reading 7+", key: 'program_reading_7_plus' },
    { value: "Reading <7", key: 'program_reading_under_7' },
];

const ManageTemplatesPage = () => {
    const { t, i18n } = useTranslation(); // ADDED useTranslation
    const { token } = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Default to a valid program value
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
            showErrorAlert(t('manage_templates_page.alert_no_file_title'), t('manage_templates_page.alert_no_file_message'));
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append('program', program);
        formData.append('templateFile', templateFile);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/certificates/templates', formData, config);
            showSuccessAlert(t('manage_templates_page.alert_success_title'), t('manage_templates_page.alert_upload_success'));
            fetchTemplates();
        } catch (err: any) {
            showErrorAlert(t('manage_templates_page.alert_error_title'), err.response?.data?.message || t('manage_templates_page.alert_upload_error'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (programValue: string) => {
        // Find the translated name of the program for the confirmation message
        const programKey = programOptionsMap.find(p => p.value === programValue)?.key;
        const translatedProgramName = programKey ? t(`manage_templates_page.${programKey}`) : programValue;

        // Construct the dynamic confirmation message using the translated strings
        const message = `${t('manage_templates_page.alert_delete_confirm_message_prefix')} ${translatedProgramName} ${t('manage_templates_page.alert_delete_confirm_message_suffix')}`;
        
        const result = await showConfirmationDialog(t('manage_templates_page.alert_delete_confirm_title'), message);

        if (result.isConfirmed) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` }, data: { program: programValue } };
                await axios.delete('http://localhost:5000/api/certificates/templates', config);
                showSuccessAlert(t('manage_templates_page.alert_success_title'), t('manage_templates_page.alert_delete_success'));
                fetchTemplates();
            } catch (err: any) {
                showErrorAlert(t('manage_templates_page.alert_error_title'), err.response?.data?.message || t('manage_templates_page.alert_delete_error'));
            }
        }
    };


    if (loading) return <div className="p-8">{t('manage_templates_page.loading_templates')}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto" dir={i18n.dir()}> {/* Applied RTL */}
            <h1 className="text-3xl font-bold mb-6">{t('manage_templates_page.page_title')}</h1>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('manage_templates_page.upload_section_title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">{t('manage_templates_page.program_label')}</label>
                        <select value={program} onChange={e => setProgram(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                            {programOptionsMap.map(option => (
                                // The value is the English/API key, but the display text is translated
                                <option key={option.value} value={option.value}>
                                    {t(`manage_templates_page.${option.key}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold mb-1">{t('manage_templates_page.file_label')}</label>
                        <input type="file" onChange={e => { if (e.target.files) setTemplateFile(e.target.files[0]); }} className="w-full p-2 border rounded file:..." required />
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded hover:opacity-90 disabled:bg-gray-400">
                        {isUploading ? t('manage_templates_page.button_uploading') : t('manage_templates_page.button_upload')}
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">{t('manage_templates_page.existing_section_title')}</h2>
                <div className="space-y-2">
                    {templates.map(temp => (
                        <div key={temp.program} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                            {/* Display the translated program name */}
                            <span className="font-semibold">{programOptionsMap.find(p => p.value === temp.program)?.key ? t(`manage_templates_page.${programOptionsMap.find(p => p.value === temp.program)?.key}`) : temp.program}</span>
                            
                            <a href={temp.templateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {t('manage_templates_page.button_view')}
                            </a>
                            <button onClick={() => handleDelete(temp.program)} className="text-red-500 hover:underline text-sm font-semibold">
                                    {t('manage_templates_page.button_delete')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageTemplatesPage;
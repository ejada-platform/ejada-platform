import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { showSuccessAlert, showErrorAlert, showConfirmationDialog } from '../../services/alert.service';

interface Resource {
    _id: string;
    title: string;
    description: string;
    resourceUrl: string;
    category: 'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other';
    price: number;
}

const ManageLibraryPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other'>('Quran');
    const [price, setPrice] = useState(0);
    const [resourceFile, setResourceFile] = useState<File | null>(null);

    const fetchResources = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<Resource[]>('http://localhost:5000/api/resources', config);
            setResources(data);
        } catch (error) {
            console.error('Failed to load resources.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resourceFile) {
            showErrorAlert('No File Selected', 'Please select a file to upload.');
            return;
        }
        if (!title.trim()) {
            showErrorAlert('Title Required', 'Please provide a title for the resource.');
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price.toString());
        formData.append('resourceFile', resourceFile);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/resources', formData, config);
            showSuccessAlert('Success!', t('admin_pages.manage_library.success_add'));
            setTitle('');
            setDescription('');
            setPrice(0);
            setResourceFile(null);
            (e.target as HTMLFormElement).reset();
            fetchResources();
        } catch (err: any) {
            showErrorAlert('Upload Failed!', err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (resourceId: string) => {
        const result = await showConfirmationDialog(
            t('admin_pages.manage_library.delete_confirm_title'),
            t('admin_pages.manage_library.delete_confirm_text')
        );
        if (result.isConfirmed) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/resources/${resourceId}`, config);
                showSuccessAlert(t('admin_pages.manage_library.delete_success_title'), t('admin_pages.manage_library.delete_success_text'));
                fetchResources();
            } catch (error) {
                showErrorAlert(t('admin_pages.manage_library.delete_error_title'), t('admin_pages.manage_library.delete_error_text'));
            }
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('admin_pages.manage_library.add_title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.title_label')}</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.upload_file_label')}</label>
                        <input type="file" onChange={e => { if (e.target.files) setResourceFile(e.target.files[0]); }} className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.price_label')}</label>
                        <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(parseFloat(e.target.value))} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.category_label')}</label>
                        <select value={category} onChange={e => setCategory(e.target.value as Resource['category'])} className="w-full p-2 border rounded bg-white">
                            <option value="Quran">{t('circle_detail_page.specializations.quran')}</option>
                            <option value="Hadith">{t('circle_detail_page.specializations.hadith')}</option>
                            <option value="Fiqh">{t('circle_detail_page.specializations.fiqh')}</option>
                            <option value="Stories">{t('circle_detail_page.specializations.stories')}</option>
                            <option value="Other">{t('circle_detail_page.specializations.other')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.description_label')}</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={3} required />
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-blue-300">
                        {isUploading ? 'Uploading...' : t('admin_pages.manage_library.submit_button')}
                    </button>
                </form>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('admin_pages.manage_library.existing_title')}</h2>
                <div className="space-y-4">
                    {resources.map(resource => (
                        <div key={resource._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{resource.title}</h3>
                                <p className="text-sm text-gray-500">{t(`circle_detail_page.specializations.${resource.category.toLowerCase().replace(' ', '_')}` as const, resource.category)}</p>
                            </div>
                            <button onClick={() => handleDelete(resource._id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                {t('admin_pages.manage_library.delete_button')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageLibraryPage;
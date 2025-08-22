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
}

const ManageLibraryPage = () => {
   const { t } = useTranslation();
    const { token } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // --- Form State ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [category, setCategory] = useState<'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other'>('Quran');

    //const [resourceFile, setResourceFile] = useState<File | null>(null);
    //const [isUploading, setIsUploading] = useState(false);

    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get<Resource[]>('http://localhost:5000/api/resources');
            setResources(data);
        } catch (error) {
            setMessage('Failed to load resources.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        // formData.append('resourceUrl', resourceUrl);   // Include URL if provided   
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { title, description, resourceUrl, category };
            await axios.post('http://localhost:5000/api/resources', payload, config);
            
            showSuccessAlert('Success!','Resource uploaded successfully!');
            // Clear form and refresh list
            setTitle('');
            setDescription('');
            setResourceUrl('');
            //setCategory('Quran');
            fetchResources();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
             showErrorAlert('Error!', err.response?.data?.message || 'Failed to add resource.');
        }
    };

     const handleDelete = async (resourceId: string) => {
        const result = await showConfirmationDialog(
            t('admin_pages.manage_library.delete_confirm_title'), // Add this key
            t('admin_pages.manage_library.delete_confirm_text')  // Add this key
        );

        if (result.isConfirmed) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/resources/${resourceId}`, config);
                
                showSuccessAlert(
                    t('admin_pages.manage_library.delete_success_title'), // Add this key
                    t('admin_pages.manage_library.delete_success_text')   // Add this key
                );
                
                fetchResources(); // Refresh list
            } catch (error) {
                showErrorAlert(
                    t('admin_pages.manage_library.delete_error_title'), // Add this key
                    t('admin_pages.manage_library.delete_error_text')  // Add this key
                );
            }
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

   // if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* --- Form to Add New Resource --- */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('admin_pages.manage_library.add_title')}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Form fields... */}
                    <div className="mb-4">
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.title_label')}</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                     <div className="mb-4">
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.url_label')}</label>
                        <input type="url" value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} className="w-full p-2 border rounded" placeholder="https://..." required />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.category_label')}</label>
                        <select value={category} onChange={e => setCategory(e.target.value as Resource['category'])} className="w-full p-2 border rounded">
                            <option value="Quran">Quran</option>
                            <option value="Hadith">Hadith</option>
                            <option value="Fiqh">Fiqh</option>
                            <option value="Stories">Stories</option>
                            <option value="Stories">Aqeedah(Creed)</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">{t('admin_pages.manage_library.description_label')}</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={3} required />
                    </div>
                     <button type="submit"  className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-blue-300">
                        {t('admin_pages.manage_library.submit_button')}
                    </button>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </form>
            </div>

            {/* --- List of Existing Resources --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">{t('admin_pages.manage_library.existing_title')}</h2>
                <div className="space-y-4">
                    {resources.map(resource => (
                        <div key={resource._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{resource.title}</h3>
                                <p className="text-sm text-gray-500">{resource.category}</p>
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
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert } from '../../services/alert.service'; // Note: showErrorAlert is often used, but not imported here
import Modal from '../../components/Modal';
import { useTranslation } from 'react-i18next'; // ADDED useTranslation

// --- TYPE DEFINITIONS ---
interface Application {
    _id: string;
    fullName: string;
    email: string;
    program: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
}

// ==================================================================
// --- SUB-COMPONENT: The Form inside the Modal ---
// ==================================================================
const ApproveApplicationForm = ({ applicationId, onSuccess, onCancel }: { applicationId: string; onSuccess: (username: string, password: string) => void; onCancel: () => void; }) => {
    const { t, i18n } = useTranslation();
    const { token } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { username, password };
            await axios.post(`http://localhost:5000/api/applications/${applicationId}/approve`, payload, config);
     
            onSuccess(username, password);
        } catch (err: any) {
            setError(err.response?.data?.message || t('app_review_page.form_error_generic'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} dir={i18n.dir()}>
            <p className="mb-4 text-sm text-gray-600">{t('app_review_page.form_intro')}</p>
            <div className="mb-4">
                <label className="block font-bold mb-1">{t('app_review_page.form_username_label')}</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div className="mb-6">
                <label className="block font-bold mb-1">{t('app_review_page.form_password_label')}</label>
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">{t('app_review_page.form_button_cancel')}</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
                    {loading ? t('app_review_page.form_button_approving') : t('app_review_page.form_button_approve')}
                </button>
            </div>
        </form>
    );
};


// ==================================================================
// --- THE MAIN PAGE COMPONENT ---
// ==================================================================
const ApplicationReviewPage = () => {
    const { t, i18n } = useTranslation();
    const { token } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    // Note: Replaced generic 'error' state with translation key for generic load error
    const [error, setError] = useState(''); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<Application[]>('http://localhost:5000/api/applications', config);
            setApplications(data);
        } catch (err) {
            setError(t('app_review_page.error_load_applications'));
        } finally {
            setLoading(false);
        }
    }, [token, t]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleApproveClick = (applicationId: string) => {
        setSelectedAppId(applicationId);
        setIsModalOpen(true);
    };

    const handleApprovalSuccess = (username: string, password: string) => {
        setIsModalOpen(false);
        // Constructed the success message using translation keys
        const message = `${t('app_review_page.alert_success_message_prefix')}\n\n` +
                       `${t('app_review_page.alert_success_username')} ${username}\n` +
                       `${t('app_review_page.alert_success_password')} ${password}`;

        showSuccessAlert(
            t('app_review_page.alert_success_title'),
            message
        );
        fetchApplications(); 
    };

    if (loading) return <div className="p-8 text-center">{t('app_review_page.loading_applications')}</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto" dir={i18n.dir()}> {/* Added dir={i18n.dir()} */}
            <h1 className="text-3xl font-bold mb-6">{t('app_review_page.page_title')}</h1>
            
            <div className="bg-white p-6 rounded-lg shadow">
                {applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-grow">
                                    <p className="font-bold text-lg">{app.fullName}</p>
                                    <p className="text-sm text-gray-600">{app.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('app_review_page.app_card_program')} <span className="font-semibold">{app.program}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {t('app_review_page.app_card_applied_on')} {new Date(app.createdAt).toLocaleDateString(i18n.language)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => handleApproveClick(app._id)}
                                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                                    >
                                        {t('app_review_page.button_approve')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">{t('app_review_page.no_pending_applications')}</p>
                )}
            </div>

            {/* --- The Modal for Approving --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('app_review_page.modal_title')}
            >
                {selectedAppId && (
                    <ApproveApplicationForm
                        applicationId={selectedAppId}
                        onSuccess={handleApprovalSuccess}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ApplicationReviewPage;
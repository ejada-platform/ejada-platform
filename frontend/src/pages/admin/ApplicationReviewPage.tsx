// src/pages/admin/ApplicationReviewPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';
import Modal from '../../components/Modal';

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
            
            // On success, pass the credentials up to the parent to display
            onSuccess(username, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to approve application.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className="mb-4 text-sm text-gray-600">Please create the credentials for this new student. You will need to send these to them via WhatsApp.</p>
            <div className="mb-4">
                <label className="block font-bold mb-1">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div className="mb-6">
                <label className="block font-bold mb-1">Temporary Password</label>
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
                    {loading ? 'Approving...' : 'Approve & Create User'}
                </button>
            </div>
        </form>
    );
};


// ==================================================================
// --- THE MAIN PAGE COMPONENT ---
// ==================================================================
const ApplicationReviewPage = () => {
    const { token } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for managing the modal
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
            setError('Failed to load applications.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleApproveClick = (applicationId: string) => {
        setSelectedAppId(applicationId);
        setIsModalOpen(true);
    };

    const handleApprovalSuccess = (username: string, password: string) => {
        setIsModalOpen(false);
        // Use a beautiful SweetAlert2 pop-up to show the credentials to the Admin
        showSuccessAlert(
            'User Created Successfully!',
            `Please copy and send these credentials to the user:\n\nUsername: ${username}\nPassword: ${password}`
        );
        fetchApplications(); // Refresh the list of pending applications
    };

    if (loading) return <div className="p-8 text-center">Loading applications...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Review Student Applications</h1>
            
            <div className="bg-white p-6 rounded-lg shadow">
                {applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-grow">
                                    <p className="font-bold text-lg">{app.fullName}</p>
                                    <p className="text-sm text-gray-600">{app.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">Program: <span className="font-semibold">{app.program}</span></p>
                                    <p className="text-xs text-gray-400">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => handleApproveClick(app._id)}
                                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                                    >
                                        Approve & Create Credentials
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">There are no pending applications to review.</p>
                )}
            </div>

            {/* --- The Modal for Approving --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Credentials for New Student"
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
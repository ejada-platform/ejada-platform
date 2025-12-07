import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import EditUserForm from './EditUserForm';
import { showSuccessAlert, showErrorAlert, showConfirmationDialog } from '../../services/alert.service';
import { useTranslation } from 'react-i18next';


// --- AWARD CERTIFICATE SUB-COMPONENT ---
const AwardCertificateForm = ({ student, onSuccess, onCancel }: { student: User; onSuccess: () => void; onCancel: () => void; }) => {
    const { t, i18n } = useTranslation();
    const { token } = useAuth();
    // Assuming studentProfile program holds the English value (e.g., 'Reciting')
    const [program, setProgram] = useState( (student as any).studentProfile?.program || 'Reciting');
    const [loading, setLoading] = useState(false);

    // NOTE: This helper is necessary to translate the options in the dropdown
    const getTranslatedProgram = (program: string) => {
        const programMapKey = program.toLowerCase().replace(/[ <+]/g, '_');
        return t(`admin_pages.create_circle.program_${programMapKey}`);
    };
    // The options array must match the API values
    const programValues: ('Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing')[] = ['Reciting', 'Memorizing', 'Reading 7+', 'Reading <7'];


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { studentId: student._id, program };
            await axios.post('http://localhost:5000/api/certificates', payload, config);
            
            // Success alert with interpolation
            showSuccessAlert(t('admin_pages.manage_users.alert_success_title'), 
                             t('admin_pages.manage_users.cert_alert_success', { program: program, username: student.username }));
            onSuccess();
        } catch (err: any) {
            showErrorAlert(t('admin_pages.manage_users.alert_error_title'), err.response?.data?.message || t('admin_pages.manage_users.cert_alert_error'));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} dir={i18n.dir()}>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{t('admin_pages.manage_users.cert_form_intro')}</p>
            <div className="mb-6">
                <label className="block font-bold mb-1 dark:text-gray-200">{t('admin_pages.manage_users.cert_form_program_label')}</label>
                <select value={program} onChange={e => setProgram(e.target.value as any)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {programValues.map(p => (
                        <option key={p} value={p}>{getTranslatedProgram(p)}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    {t('admin_pages.manage_users.cancel_button')}
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
                    {loading ? t('admin_pages.manage_users.cert_form_button_awarding') : t('admin_pages.manage_users.cert_form_button_award')}
                </button>
            </div>
        </form>
    );
};


// --- MAIN PAGE COMPONENT ---
const UserManagementPage = () => {
    const { t, i18n } = useTranslation();
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [certifyingStudent, setCertifyingStudent] = useState<User | null>(null);
    
    const fetchUsers = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get<User[]>('http://localhost:5000/api/users', config);
            setUsers(data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || t('admin_pages.manage_users.load_students_error'));
        } finally {
            setLoading(false);
        }
    }, [token, t]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId: string) => {
        const result = await showConfirmationDialog(
            t('admin_pages.manage_users.delete_confirm_title'),
            t('admin_pages.manage_users.delete_confirm_text')
        );
        if (result.isConfirmed) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
                showSuccessAlert(t('admin_pages.manage_users.delete_success_title'), t('admin_pages.manage_users.delete_success_text'));
                fetchUsers();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                showErrorAlert(t('admin_pages.manage_users.delete_error_title'), t('admin_pages.manage_users.delete_error_text'));
            }
        }
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleUpdateSuccess = () => {
        handleCloseModal();
        fetchUsers();
    };

    const handleAwardClick = (student: User) => {
        setCertifyingStudent(student);
        setIsCertModalOpen(true);
    };

    const handleCloseCertModal = () => {
        setIsCertModalOpen(false);
        setCertifyingStudent(null);
    };

    // Helper function to translate roles
    const getTranslatedRole = (role: User['role']) => {
        switch (role) {
            case 'Admin': return t('admin_pages.manage_users.role_admin');
            case 'Teacher': return t('admin_pages.manage_users.role_teacher');
            case 'Student': return t('admin_pages.manage_users.role_student');
            case 'Parent': return t('admin_pages.manage_users.role_parent');
            default: return role;
        }
    };

    if (loading) return <div className="p-4 md:p-8 text-center">{t('admin_pages.manage_users.loading_applications')}</div>;
    if (error) return <div className="p-4 md:p-8 text-red-500 text-center">{error}</div>;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto" dir={i18n.dir()}>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{t('admin_pages.manage_users.title')}</h1>
            
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
                
                {/* --- DESKTOP TABLE --- */}
                <table className="w-full text-left hidden md:table">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="py-3 px-2 text-gray-600 dark:text-gray-300">{t('admin_pages.manage_users.username_header')}</th>
                            <th className="py-3 px-2 text-gray-600 dark:text-gray-300">{t('admin_pages.manage_users.role_header')}</th>
                            <th className="py-3 px-2 text-gray-600 dark:text-gray-300">{t('admin_pages.manage_users.status_header')}</th>
                            <th className="py-3 px-2 text-right text-gray-600 dark:text-gray-300">{t('admin_pages.manage_users.actions_header')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="py-3 px-2 font-medium dark:text-gray-200">{user.username}</td>
                                <td className="py-3 px-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'Admin' ? 'bg-red-200 text-red-800' :
                                        user.role === 'Teacher' ? 'bg-blue-200 text-blue-800' :
                                        'bg-green-200 text-green-800'
                                    }`}>
                                        {getTranslatedRole(user.role)} {/* FIXED: Translate role */}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    {user.isFeatured && (
                                        <span className="text-yellow-500 font-bold flex items-center">{t('admin_pages.manage_users.star_student_status')}</span>
                                    )}
                                </td>
                                <td className="py-3 px-2 space-x-2 text-right">
                                    {user.role === 'Student' && (
                                        <button onClick={() => handleAwardClick(user)} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                                            {t('admin_pages.manage_users.award_cert_button')} {/* FIXED: Translate button */}
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                                    >
                                        {t('admin_pages.manage_users.edit_button')}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user._id)}
                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                    >
                                        {t('admin_pages.manage_users.delete_button')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- MOBILE CARD VIEW --- */}
                <div className="md:hidden space-y-4">
                    {users.map(user => (
                        <div key={user._id} className="border dark:border-gray-700 rounded-lg p-4 shadow-sm">
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{user.username}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'Admin' ? 'bg-red-200 text-red-800' :
                                        user.role === 'Teacher' ? 'bg-blue-200 text-blue-800' :
                                        'bg-green-200 text-green-800'
                                    }`}>
                                        {getTranslatedRole(user.role)} {/* FIXED: Translate role */}
                                    </span>
                                </div>
                                {user.isFeatured && (
                                    <span className="text-yellow-500 font-bold text-sm">{t('admin_pages.manage_users.star_student_status')}</span>
                                )}
                            </div>
                            
                            {/* Card Body & Actions */}
                            <div className="border-t dark:border-gray-700 pt-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('admin_pages.manage_users.actions_header')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.role === 'Student' && (
                                        <button onClick={() => handleAwardClick(user)} className="flex-grow px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                                            {t('admin_pages.manage_users.award_cert_button')} {/* FIXED: Translate button */}
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="flex-grow px-3 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                                    >
                                        {t('admin_pages.manage_users.edit_button')}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user._id)}
                                        className="flex-grow px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                    >
                                        {t('admin_pages.manage_users.delete_button')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* --- MODALS --- */}
            {selectedUser && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    title={t('admin_pages.manage_users.edit_modal_title', { username: selectedUser.username })}
                >
                    <EditUserForm 
                        user={selectedUser} 
                        onSuccess={handleUpdateSuccess}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}

            {certifyingStudent && (
                <Modal 
                    isOpen={isCertModalOpen} 
                    onClose={handleCloseCertModal} 
                    title={t('admin_pages.manage_users.award_cert_modal_title', { username: certifyingStudent.username })}
                >
                    <AwardCertificateForm student={certifyingStudent} onSuccess={handleCloseCertModal} onCancel={handleCloseCertModal} />
                </Modal>
            )}
        </div>
    );
};

export default UserManagementPage;
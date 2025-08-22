// src/pages/admin/UserManagementPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import EditUserForm from './EditUserForm';
import { showSuccessAlert, showErrorAlert, showConfirmationDialog } from '../../services/alert.service';
import { useTranslation } from 'react-i18next';


const UserManagementPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
            setError(err.response?.data?.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId: string) => {
        const result = await showConfirmationDialog(
            'Are you sure?',
            "You won't be able to revert this!"
        );
        if (result.isConfirmed) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
                //alert('User deleted successfully.');
                showSuccessAlert('Deleted!', 'The user has been removed successfully.');
                fetchUsers();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                showErrorAlert('Error!', 'Failed to delete the user.');
            }
        }
    };

 const handleFeature = async (userToFeature: User) => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // We only need to make ONE API call now.
            // The backend will handle un-featuring anyone else.
            await axios.put(`http://localhost:5000/api/users/${userToFeature._id}`, { isFeatured: true }, config);
            
           showSuccessAlert('Success!', `${userToFeature.username} is now the Star Student!`);
           // alert(`${userToFeature.username} is now the Star Student!`);
            fetchUsers(); // Refresh the list to get the definitive state from the server
        } catch {
            showErrorAlert('Error!', 'Failed to update the featured student.');
            //alert('Failed to update featured student.');
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

    if (loading) return <div className="p-8">Loading users...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('admin_pages.manage_users.title')}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="py-2">{t('admin_pages.manage_users.username_header')}</th>
                            <th className="py-2">{t('admin_pages.manage_users.role_header')}</th>
                            <th className="py-2">{t('admin_pages.manage_users.status_header')}</th>
                            <th className="py-2 text-right">{t('admin_pages.manage_users.actions_header')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{user.username}</td>
                                <td className="py-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'Admin' ? 'bg-red-200 text-red-800' :
                                        user.role === 'Teacher' ? 'bg-blue-200 text-blue-800' :
                                        'bg-green-200 text-green-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-2">
                                    {user.isFeatured && (
                                        <span className="text-yellow-500 font-bold">★ Star Student</span>
                                    )}
                                </td>
                                <td className="py-2 space-x-2 text-right">
                                    {user.role === 'Student' && !user.isFeatured && (
                                        <button 
                                            onClick={() => handleFeature(user)}
                                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                        >
                                            {t('admin_pages.manage_users.star_student_status')}
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                                    >
                                        {t('admin_pages.manage_users.edit_button')}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user._id)}
                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                    >
                                        {t('admin_pages.manage_users.delete_button')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedUser && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    title={`Edit User: ${selectedUser.username}`}
                >
                    <EditUserForm 
                        user={selectedUser} 
                        onSuccess={handleUpdateSuccess}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default UserManagementPage;

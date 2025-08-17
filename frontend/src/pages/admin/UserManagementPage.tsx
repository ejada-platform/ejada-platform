// src/pages/admin/UserManagementPage.tsx

import React, { useState, useEffect, useCallback } from 'react'; // THIS LINE IS NOW CORRECT
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import EditUserForm from './EditUserForm';

const UserManagementPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for managing the Edit User modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Function to fetch all users from the backend
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

    // Fetch users when the component first loads
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Function to handle deleting a user
    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
                alert('User deleted successfully.');
                fetchUsers(); // Refresh the list after deleting
            // We can ignore the unused 'err' warning here as a simple alert is sufficient
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                alert('Failed to delete user.');
            }
        }
    };

    // --- Modal Handling Functions ---
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
        fetchUsers(); // Refresh the user list after a successful update
    };

    if (loading) return <div className="p-8">Loading users...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="py-2">Username</th>
                            <th className="py-2">Role</th>
                            <th className="py-2 text-right">Actions</th>
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
                                <td className="py-2 space-x-2 text-right">
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user._id)}
                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                    >
                                        Delete
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
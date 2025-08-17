// src/pages/admin/EditUserForm.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';

interface EditUserFormProps {
    user: User;
    onSuccess: () => void; // A function to call when the update is successful
    onCancel: () => void;
}

const EditUserForm = ({ user, onSuccess, onCancel }: EditUserFormProps) => {
    const { token } = useAuth();
    const [username, setUsername] = useState(user.username);
    const [role, setRole] = useState(user.role);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setUsername(user.username);
        setRole(user.role);
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { username, role };
            await axios.put(`http://localhost:5000/api/users/${user._id}`, payload, config);
            
            alert('User updated successfully!');
            onSuccess(); // Close the modal and refresh the list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to update user.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block font-bold mb-1">Username</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className="w-full p-2 border rounded" 
                />
            </div>
            <div className="mb-6">
                <label className="block font-bold mb-1">Role</label>
                <select 
                    value={role} 
                    onChange={e => setRole(e.target.value as User['role'])} 
                    className="w-full p-2 border rounded"
                >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Save Changes
                </button>
            </div>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </form>
    );
};

export default EditUserForm;
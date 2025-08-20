// src/pages/admin/EditUserForm.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth, type User } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface EditUserFormProps {
    user: User & { children?: string[] }; // Ensure the user prop can have children
    onSuccess: () => void;
    onCancel: () => void;
}

interface SelectOption {
    value: string;
    label: string;
}

const EditUserForm = ({ user, onSuccess, onCancel }: EditUserFormProps) => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [username, setUsername] = useState(user.username);
    const [role, setRole] = useState(user.role);
    const [message, setMessage] = useState('');
    
    // State for linking children to a parent account
    const [allStudents, setAllStudents] = useState<SelectOption[]>([]);
    const [selectedChildren, setSelectedChildren] = useState<SelectOption[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    // This effect runs when the component mounts or the user prop changes
    useEffect(() => {
        // Reset state when a new user is selected
        setUsername(user.username);
        setRole(user.role);
        setMessage('');

        // If the user being edited is a Parent, fetch all students
        if (user.role === 'Parent') {
            const fetchStudents = async () => {
                if (!token) return;
                setLoadingStudents(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get<User[]>('http://localhost:5000/api/users', config);
                    
                    const studentOptions = data
                        .filter(u => u.role === 'Student')
                        .map(s => ({ value: s._id, label: s.username }));
                    setAllStudents(studentOptions);

                    // Pre-select the children that are already linked to this parent
                    if (user.children) {
                        const preSelected = studentOptions.filter(opt => user.children!.includes(opt.value));
                        setSelectedChildren(preSelected);
                    } else {
                        setSelectedChildren([]);
                    }
                } catch (error) {
                    setMessage("Failed to load student list.");
                } finally {
                    setLoadingStudents(false);
                }
            };
            fetchStudents();
        }
    }, [user, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Construct the payload based on the role
            const payload: any = { username, role };
            if (role === 'Parent') {
                payload.children = selectedChildren.map(c => c.value);
            }

            await axios.put(`http://localhost:5000/api/users/${user._id}`, payload, config);
            
            alert('User updated successfully!');
            onSuccess(); // This will close the modal and refresh the user list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to update user.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block font-bold mb-1">{t('admin_pages.manage_users.username_header')}</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className="w-full p-2 border rounded" 
                />
            </div>
            <div className="mb-6">
                <label className="block font-bold mb-1">{t('admin_pages.manage_users.role_header')}</label>
                <select 
                    value={role} 
                    onChange={e => setRole(e.target.value as User['role'])} 
                    className="w-full p-2 border rounded"
                >
                    <option value="Student">{t('register_page.role_student')}</option>
                    <option value="Teacher">{t('register_page.role_teacher')}</option>
                    <option value="Parent">Parent</option> {/* Added Parent role */}
                    <option value="Admin">Admin</option>
                </select>
            </div>
            
            {/* Conditional section for linking students to parents */}
            {role === 'Parent' && (
                <div className="mb-6">
                    <label className="block font-bold mb-1">Linked Student Accounts</label>
                    <Select
                        isMulti
                        isLoading={loadingStudents}
                        options={allStudents}
                        value={selectedChildren}
                        onChange={newValue => setSelectedChildren(newValue as SelectOption[])}
                    />
                </div>
            )}

            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    {t('admin_pages.manage_users.cancel_button')}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {t('admin_pages.manage_users.save_button')}
                </button>
            </div>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </form>
    );
};

export default EditUserForm;
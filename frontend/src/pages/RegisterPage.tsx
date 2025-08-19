// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // 1. Import the hook
import type { User } from '../context/AuthContext';

const RegisterPage = () => {
    const { t } = useTranslation(); // 2. Initialize the hook

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const payload = { username, password, role };
            const response = await axios.post<User>('http://localhost:5000/api/auth/register', payload);

            setMessage(t('register_page.success_message', { username: response.data.username }));
            setUsername('');
            setPassword('');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response) {
                if (error.response.data.message === 'User already exists') {
                    setMessage(t('register_page.error_user_exists'));
                } else {
                    setMessage(error.response.data.message);
                }
            } else {
                setMessage(t('register_page.error_generic'));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {/* 3. Replace all hard-coded text */}
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{t('register_page.title')}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            {t('register_page.username_label')}
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            {t('register_page.password_label')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            {t('register_page.role_label')}
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="Student">{t('register_page.role_student')}</option>
                            <option value="Teacher">{t('register_page.role_teacher')}</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            {t('register_page.submit_button')}
                        </button>
                    </div>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-red-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
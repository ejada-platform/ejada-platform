// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth, type User } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

interface LoginResponse extends User {
    token: string;
    generatedCode?: string;
}

const LoginPage = () => {
    const { t } = useTranslation(); // 2. Initialize the hook
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const payload = { username, password };
            const response = await axios.post<LoginResponse>('http://localhost:5000/api/auth/login', payload);
            const { token, ...userData } = response.data;
            
            login(userData, token);
            
            // We don't need the success message anymore since we redirect immediately
            // setMessage(t('login_page.success_message', { username: response.data.username }));
            
            if (userData.role === 'Admin') navigate('/admin-dashboard');
            else if (userData.role === 'Teacher') navigate('/teacher-dashboard');
            else navigate('/student-dashboard');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response) {
                // Check if the error message from the backend matches our key
                if (error.response.data.message === 'Invalid credentials') {
                    setMessage(t('login_page.error_credentials'));
                } else {
                    setMessage(error.response.data.message);
                }
            } else {
                setMessage(t('login_page.error_generic'));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {/* 3. Replace all hard-coded text with t('key') */}
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{t('login_page.title')}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            {t('login_page.username_label')}
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

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            {t('login_page.password_label')}
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

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            {t('login_page.submit_button')}
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

export default LoginPage;
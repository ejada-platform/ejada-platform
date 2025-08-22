// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type User } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faYoutube, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';

interface LoginResponse extends User {
    token: string;
    generatedCode?: string;
}

// Reusable component for the right-side branding panel
const BrandingPanel = () => (
    <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gray-100 p-12 text-center">
        <img src="/images/slider1.jpeg" alt="Ejada Logo" className="w-40 h-40 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800">Ejada Platform</h2>
        <p className="text-gray-500">For Education And Development</p>
        <div className="mt-8 flex space-x-6">
            <img src="/images/slider3.jpeg" alt="Program 1" className="h-16" />
            <img src="/images/slider2.jpeg" alt="Program 2" className="h-16" />
            <img src="/images/slider1.jpeg" alt="Program 3" className="h-16" />
        </div>
    </div>
);

const LoginPage = () => {
    const { t } = useTranslation();
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
            navigate('/dashboard');
        } catch (error: any) {
            if (error.response?.data?.message === 'Invalid credentials') {
                setMessage(t('login_page.error_credentials'));
            } else {
                setMessage(t('login_page.error_generic'));
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* --- Left Side: Login Form --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome to Ejada 👋</h1>
                        <p className="mt-2 text-gray-600">Please log in to your account to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">{t('login_page.username_label')}</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">{t('login_page.password_label')}</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 border rounded-md" required />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-gray-900">Remember me</label>
                            </div>
                            <div>
                                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                {t('login_page.submit_button')}
                            </button>
                        </div>
                    </form>

                    {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
                    
                    <div className="mt-12 flex justify-center space-x-6 text-gray-400 text-xl">
                        <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faWhatsapp} /></a>
                        <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faTelegram} /></a>
                        <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faYoutube} /></a>
                        <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faFacebook} /></a>
                    </div>
                </div>
            </div>
            
            {/* --- Right Side: Branding --- */}
            <BrandingPanel />
        </div>
    );
};
    
export default LoginPage;
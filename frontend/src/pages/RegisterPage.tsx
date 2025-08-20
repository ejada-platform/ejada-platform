// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type { User } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faYoutube, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

// Reusable component for the right-side branding panel
const BrandingPanel = () => (
    <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gray-100 p-12 text-center">
        <img src="/images/ejada-logo.png" alt="Ejada Logo" className="w-40 h-40 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800">Itqan Foundation</h2>
        <p className="text-gray-500">For Education And Development</p>
        <div className="mt-8 flex space-x-6">
            <img src="/images/program-logo1.png" alt="Program 1" className="h-16" />
            <img src="/images/program-logo2.png" alt="Program 2" className="h-16" />
            <img src="/images/program-logo3.png" alt="Program 3" className="h-16" />
        </div>
    </div>
);


const RegisterPage = () => {
    const { t } = useTranslation();
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
        } catch (error: any) {
            if (error.response?.data?.message === 'User already exists') {
                setMessage(t('register_page.error_user_exists'));
            } else {
                setMessage(t('register_page.error_generic'));
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
             {/* --- Left Side: Register Form --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
                        <p className="mt-2 text-gray-600">Join the Ejada community today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700">{t('register_page.username_label')}</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">{t('register_page.password_label')}</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 border rounded-md" required />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700">{t('register_page.role_label')}</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mt-1 p-3 border rounded-md">
                                <option value="Student">{t('register_page.role_student')}</option>
                                <option value="Teacher">{t('register_page.role_teacher')}</option>
                                <option value="Parent">Parent</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                {t('register_page.submit_button')}
                            </button>
                        </div>
                    </form>
                    
                    <p className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Log in here
                        </Link>
                    </p>

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

export default RegisterPage;
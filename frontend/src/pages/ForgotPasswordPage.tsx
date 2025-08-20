import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email }, config);
            setMessage('Password reset email sent! Please check your inbox.');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Failed to send email.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">{t('forgot_password_page.title')}</h2>
                <p className="text-center text-gray-600 mb-6">{t('forgot_password_page.instructions')}</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-bold mb-1">{t('forgot_password_page.email_label')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                        {t('forgot_password_page.submit_button')}
                    </button>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-blue-600 hover:underline">{t('forgot_password_page.back_to_login')}</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
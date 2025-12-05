import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type User } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface LoginResponse extends User {
    token: string;
    generatedCode?: string;
}

// NOTE: This component is LTR-only (hidden on mobile) and does not need full i18n/RTL treatment.
const BrandingPanel = () => (
    <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gray-100 p-12 text-center">
        <img src="/images/slider1.jpeg" alt="Ejada Logo" className="w-40 h-40 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800">Ejada Platform</h2>
        <p className="text-gray-500">For Education And Development</p> {/* NEW KEY: login_page.platform_slogan */}
        <div className="mt-8 flex space-x-6">
            <img src="/images/slider3.jpeg" alt="Program 1" className="h-16" />
            <img src="/images/slider2.jpeg" alt="Program 2" className="h-16" />
            <img src="/images/slider1.jpeg" alt="Program 3" className="h-16" />
        </div>
    </div>
);

// Eye icon SVG for the password field (No translation needed)
const EyeIcon = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LoginPage = () => {
    const { t, i18n } = useTranslation(); // ADDED i18n
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Helper to flip placeholder content when in RTL
    const placeholderUsername = t('login_page.username_label') + ' *';
    const placeholderPassword = t('login_page.password_label') + ' *';
    
    // Helper to adjust the position of the eye icon for RTL
    const eyeIconPosition = i18n.dir() === 'rtl' ? 'left-0 pl-3' : 'right-0 pr-3';
    // Helper to adjust the position of the forgot password link
    const textAlignment = i18n.dir() === 'rtl' ? 'text-left' : 'text-right';


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" dir={i18n.dir()}> {/* Applied RTL */}
            {/* --- Left Side: Login Form --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900 text-gray-200">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <h1 className="text-4xl font-bold text-white">Ejada</h1>
                        </div>
                        <p className="mt-2 text-lg text-gray-400">{t('login_page.platform_slogan')}</p> {/* New Key */}
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* Username/Email Input */}
                        <div>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                // Used translated placeholder
                                placeholder={placeholderUsername}
                                required 
                            />
                        </div>
                        
                        {/* Password Input */}
                        <div className="relative">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                // Used translated placeholder
                                placeholder={placeholderPassword}
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                // Adjusted position dynamically for RTL
                                className={`absolute inset-y-0 ${eyeIconPosition} flex items-center text-gray-500 hover:text-gray-300`}
                            >
                                <EyeIcon className="h-5 w-5"/>
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        <div className={`text-sm ${textAlignment}`}>
                            <Link to="/forgot-password" className="font-medium text-blue-500 hover:text-blue-400">
                                {t('login_page.forgot_password_link')} {/* New Key */}
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span>{isLoading ? t('login_page.signing_in') : t('login_page.submit_button')}</span> {/* New Key: signing_in */}
                            </button>
                        </div>
                    </form>

                    {/* Error Message */}
                    {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}
                </div>
            </div>
            {/* Right Side: Branding Panel (No RTL structural change needed here as it's hidden on mobile and primarily visual/English) */}
            <BrandingPanel />
        </div>
    );
};
    
export default LoginPage;
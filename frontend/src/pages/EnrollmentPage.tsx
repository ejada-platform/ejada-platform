// src/pages/EnrollmentPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// --- THIS IS THE CRITICAL MISSING IMPORT ---
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Don't forget the styles

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// We only import the icons we are actually using
import { faUser, faVenusMars, faChild, faUserTie, faCalendarAlt, faSchool, faGlobe, faCity, faFlag, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const initialFormData = {
    fullName: '', gender: '', fatherName: '', motherName: '', dateOfBirth: '',
    schoolClass: '', countryOfResidence: '', city: '', nationality: '', email: ''
};

// Reusable component for a styled input field
const InputField = ({ icon, name, placeholder, value, onChange, type = "text", required = true }: any) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FontAwesomeIcon icon={icon} />
        </span>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} required={required}
               className="w-full p-3 pl-10 border rounded-md focus:ring-secondary focus:border-secondary" />
    </div>
);

const EnrollmentPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(initialFormData);
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
    const [agreedToFees, setAgreedToFees] = useState(false);
    const [howDidYouHear, setHowDidYouHear] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setHowDidYouHear(prev => [...prev, value]);
        } else {
            setHowDidYouHear(prev => prev.filter(item => item !== value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!agreedToFees) {
            setError("You must agree to the fees to proceed.");
            return;
        }
        setLoading(true);
        try {
            // Tell Axios what to expect
            const payload = { ...formData, phoneNumber, agreedToFees, howDidYouHear, program: 'Reading 7+' };
            const { data } = await axios.post<{ success: boolean; message: string; }>('http://localhost:5000/api/applications', payload);
            setMessage(data.message);
            setFormData(initialFormData);
            setPhoneNumber(undefined);
            setAgreedToFees(false);
            setHowDidYouHear([]);
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred. Please check your information and try again.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <img src="/images/program-banner.png" alt="Ejada Program" className="mx-auto mb-4" style={{maxWidth: '300px'}}/>
                    <p className="text-red-600 font-semibold">{t('Please enter all data in Arabic')}</p>
                    <div className="mt-4 text-gray-700 text-sm">
                        <p>{t('Special discount for residents of: Türkiye, Jordan, Egypt, Iraq, Palestine, Lebanon. From $110 to $65 only.')}</p>
                        <p>{t('Semester subscription fees in other countries: $110.')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    <div className="border p-4 rounded-md bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => setAgreedToFees(!agreedToFees)}>
                        <span className="font-bold text-lg text-primary">{t('I agree to the fees')}</span>
                        <div className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${agreedToFees ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${agreedToFees ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>

                    <InputField icon={faUser} name="fullName" placeholder={t('Name and Surname')} value={formData.fullName} onChange={handleChange} />
                    
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FontAwesomeIcon icon={faVenusMars} /></span>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 pl-10 border rounded-md bg-white" required>
                            <option value="">{t('Gender')}</option>
                            <option value="Male">{t('Male')}</option>
                            <option value="Female">{t('Female')}</option>
                        </select>
                    </div>

                    <InputField icon={faUserTie} name="fatherName" placeholder={t("Name of the Father")} value={formData.fatherName} onChange={handleChange} />
                    <InputField icon={faChild} name="motherName" placeholder={t("Name of the mother")} value={formData.motherName} onChange={handleChange} />
                    <InputField icon={faCalendarAlt} name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
                    <InputField icon={faSchool} name="schoolClass" placeholder={t("school class")} value={formData.schoolClass} onChange={handleChange} required={false}/>
                    <InputField icon={faGlobe} name="countryOfResidence" placeholder={t("Country of residence?")} value={formData.countryOfResidence} onChange={handleChange} />
                    <InputField icon={faCity} name="city" placeholder={t("the city name")} value={formData.city} onChange={handleChange} />
                    <InputField icon={faFlag} name="nationality" placeholder={t("Nationality")} value={formData.nationality} onChange={handleChange} />
                    <InputField icon={faEnvelope} name="email" placeholder={t("email")} value={formData.email} onChange={handleChange} type="email" />

                    <div className="relative border rounded-md">
                        <PhoneInput
                            international
                            defaultCountry="TR"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            className="phone-input-container w-full p-3"
                            placeholder={t('Enter phone number')}
                        />
                    </div>
                    
                    <div>
                        <label className="block font-bold mb-2">{t('How did you learn about the organization?')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Social media', 'Relatives', 'From a student at the institution', 'Other'].map(option => (
                                <label key={option} className="flex items-center p-2 border rounded-md">
                                    <input type="checkbox" value={option} onChange={handleCheckboxChange} checked={howDidYouHear.includes(option)} className="h-4 w-4 mr-2 accent-secondary" />
                                    {t(option)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600">{t('The session duration is one hour and a quarter for 6 students.')}</p>

                    <button 
                        type="submit" 
                        disabled={loading || !agreedToFees} 
                        className="w-auto py-2 px-8 font-bold text-white rounded-lg transition-colors
                                   bg-gray-900 hover:bg-opacity-90 
                                   disabled:bg-blue-700 disabled:cursor-not-allowed"
                    >
                        {loading ? t('Submitting...') : t('Send')}
                    </button>

                    {message && <p className="text-center font-semibold text-green-600 mt-4">{message}</p>}
                    {error && <p className="text-center font-semibold text-red-600 mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default EnrollmentPage;
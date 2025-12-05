import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faVenusMars, faChild, faUserTie, faCalendarAlt, faGlobe, faCity, faFlag, faEnvelope, faBookOpen } from '@fortawesome/free-solid-svg-icons';

const initialFormData = {
    fullName: '', gender: '', fatherName: '', motherName: '', dateOfBirth: '',
    program: '' , countryOfResidence: '', city: '', nationality: '', email: ''
};

// Reusable component for a styled input field
const InputField = ({ icon, name, placeholder, value, onChange, type = "text", required = true }: any) => (
    // Note: RTL alignment for icons in the InputField is handled by CSS, 
    // but we flip 'left-0' to 'right-0' for a complete Tailwind RTL implementation.
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FontAwesomeIcon icon={icon} />
        </span>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} required={required}
               className="w-full p-3 pl-10 border rounded-md focus:ring-secondary focus:border-secondary" />
    </div>
);

const EnrollmentPage = () => {
    const { t, i18n } = useTranslation();
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
        // Use translation keys to manage the state array
        const translatedValue = t(`enrollment_page.${value.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`);
        
        if (checked) {
            // Note: This needs logic to handle the translation key or value consistently in state
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
            setError(t("enrollment_page.alert_agree_fees"));
            return;
        }
        setLoading(true);
        try {
            const payload = { ...formData, phoneNumber, agreedToFees, howDidYouHear };
            const { data } = await axios.post<{ success: boolean; message: string; }>('http://localhost:5000/api/applications', payload);
            setMessage(data.message);
            setFormData(initialFormData);
            setPhoneNumber(undefined);
            setAgreedToFees(false);
            setHowDidYouHear([]);
        } catch (err: any) {
            setError(err.response?.data?.message || t("enrollment_page.alert_error_generic"));
        } finally {
            setLoading(false);
        }
    };
    
    // Array of options, using English for keys, will be translated by t()
    const learnOptions = ['social_media', 'relatives', 'from_a_student', 'other'];

    return (
        <div className="bg-gray-50 py-12 px-4" dir={i18n.dir()}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <img src="/images/program-banner.png" alt={t('enrollment_page.page_title_alt')} className="mx-auto mb-4" style={{maxWidth: '300px'}}/>
                    <p className="text-red-600 font-semibold">{t('enrollment_page.enter_data_in_arabic')}</p>
                    <div className="mt-4 text-gray-700 text-sm">
                        <p>{t('enrollment_page.discount_info')}</p>
                        <p>{t('enrollment_page.semester_fees')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    {/* Fees Agreement Toggle */}
                    <div className="border p-4 rounded-md bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => setAgreedToFees(!agreedToFees)}>
                        <span className="font-bold text-lg text-primary">{t('enrollment_page.agree_to_fees')}</span>
                        <div className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${agreedToFees ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${agreedToFees ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>

                    {/* Full Name */}
                    <InputField icon={faUser} name="fullName" placeholder={t('enrollment_page.name_and_surname')} value={formData.fullName} onChange={handleChange} />
                    
                    {/* Gender Select */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FontAwesomeIcon icon={faVenusMars} /></span>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 pl-10 border rounded-md bg-white" required>
                            <option value="">{t('enrollment_page.gender')}</option>
                            <option value="Male">{t('enrollment_page.male')}</option>
                            <option value="Female">{t('enrollment_page.female')}</option>
                        </select>
                    </div>

                    {/* Father/Mother Names */}
                    <InputField icon={faUserTie} name="fatherName" placeholder={t("enrollment_page.name_of_the_father")} value={formData.fatherName} onChange={handleChange} />
                    <InputField icon={faChild} name="motherName" placeholder={t("enrollment_page.name_of_the_mother")} value={formData.motherName} onChange={handleChange} />
                    
                    {/* Date of Birth */}
                    <InputField icon={faCalendarAlt} name="dateOfBirth" placeholder={t('Date of Birth')} value={formData.dateOfBirth} onChange={handleChange} type="date" />
                    
                    {/* Program Selection Dropdown */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FontAwesomeIcon icon={faBookOpen} /></span>
                        <select 
                            name="program" 
                            value={formData.program} 
                            onChange={handleChange} 
                            className="w-full p-3 pl-10 border rounded-md bg-white" 
                            required
                        >
                            <option value="" disabled>{t('enrollment_page.choose_a_program')}</option>
                            <option value="Reading 7+">{t('enrollment_page.reading_7_plus')}</option>
                            <option value="Reading <7">{t('enrollment_page.reading_under_7')}</option>
                            <option value="Memorizing">{t('enrollment_page.memorization')}</option>
                            <option value="Reciting">{t('enrollment_page.reciting_non_arabs')}</option>
                        </select>
                    </div>
                    
                    {/* Location/Contact Fields */}
                    <InputField icon={faGlobe} name="countryOfResidence" placeholder={t("enrollment_page.country_of_residence")} value={formData.countryOfResidence} onChange={handleChange} />
                    <InputField icon={faCity} name="city" placeholder={t("enrollment_page.the_city_name")} value={formData.city} onChange={handleChange} />
                    <InputField icon={faFlag} name="nationality" placeholder={t("enrollment_page.nationality")} value={formData.nationality} onChange={handleChange} />
                    <InputField icon={faEnvelope} name="email" placeholder={t("enrollment_page.email")} value={formData.email} onChange={handleChange} type="email" />

                    {/* Phone Input */}
                    <div className="relative border rounded-md">
                        <PhoneInput
                            international
                            defaultCountry="TR"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            className="phone-input-container w-full p-3"
                            placeholder={t('enrollment_page.enter_phone_number')}
                        />
                    </div>
                    
                    {/* How Did You Hear Checkboxes */}
                    <div>
                        <label className="block font-bold mb-2">{t('enrollment_page.how_did_you_learn')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {/* NOTE: We use the English key as the value passed to the backend */}
                            {learnOptions.map(key => (
                                <label key={key} className="flex items-center p-2 border rounded-md">
                                    <input 
                                        type="checkbox" 
                                        value={t(`enrollment_page.${key}`)} // Value sent to backend is the translated string
                                        onChange={handleCheckboxChange} 
                                        checked={howDidYouHear.includes(t(`enrollment_page.${key}`))} 
                                        className="h-4 w-4 mr-2 accent-secondary" 
                                    />
                                    {t(`enrollment_page.${key}`)}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Session Note */}
                    <p className="text-center text-sm text-gray-600">{t('enrollment_page.session_duration_note')}</p>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading || !agreedToFees} 
                        className="w-auto py-2 px-8 font-bold text-white rounded-lg transition-colors
                                   bg-gray-900 hover:bg-opacity-90 
                                   disabled:bg-blue-700 disabled:cursor-not-allowed"
                    >
                        {loading ? t('enrollment_page.submitting') : t('enrollment_page.send')}
                    </button>

                    {message && <p className="text-center font-semibold text-green-600 mt-4">{message}</p>}
                    {error && <p className="text-center font-semibold text-red-600 mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default EnrollmentPage;
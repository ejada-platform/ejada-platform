import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// We will create these JSON files in the next step
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

i18n
 
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true, 
        
        // ===============================================
        // *** CRITICAL CHANGE: SET THE DEFAULT LANGUAGE ***
        // ===============================================
        lng: 'ar', 
        
        fallbackLng: 'en', 
        interpolation: {
            escapeValue: false, 
        },
        resources: {
            en: {
                translation: enTranslation,
            },
            ar: {
                translation: arTranslation,
            },
        },
       
    });

export default i18n;
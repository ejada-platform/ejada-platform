// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// We will create these JSON files in the next step
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // Initialize i18next
    .init({
        debug: true, // Set to false in production
        fallbackLng: 'en', // Use English if the detected language is not available
        interpolation: {
            escapeValue: false, // React already safes from xss
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
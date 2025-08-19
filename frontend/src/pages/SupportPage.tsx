// src/pages/SupportPage.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '../components/Accordion'; // <-- 1. IMPORT THE NEW COMPONENT

const SupportPage = () => {
    const { t } = useTranslation();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">{t('support_page.title')}</h1>
            
            <div className="bg-white p-6 rounded-lg shadow space-y-4 mb-8">
                <p className="text-lg">
                    {t('support_page.intro_message')}
                </p>
                <p>
                    {t('support_page.email_prompt')} 
                    <a href="mailto:support@ejada.com" className="text-blue-600 font-bold hover:underline">
                        support@ejada.com
                    </a>
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">{t('support_page.faq_title')}</h2>
                {/* 2. USE THE ACCORDION COMPONENT FOR EACH FAQ */}
                <div className="space-y-4">
                    <Accordion title={t('support_page.faq_q1')}>
                        <p>{t('support_page.faq_a1')}</p>
                    </Accordion>
                    
                    <Accordion title={t('support_page.faq_q2')}>
                        <p>{t('support_page.faq_a2')}</p>
                    </Accordion>

                    {/* You can easily add more FAQs just by adding more Accordion components */}
                    {/* 
                    <Accordion title={t('support_page.faq_q3')}>
                        <p>{t('support_page.faq_a3')}</p>
                    </Accordion> 
                    */}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
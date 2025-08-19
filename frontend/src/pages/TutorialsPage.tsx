// src/pages/TutorialsPage.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';

// This is a reusable component for embedding a single video
const VideoPlayer = ({ title, description, youtubeVideoId }: { title: string; description: string; youtubeVideoId: string }) => {
    // A check to ensure we don't try to render a placeholder
    if (youtubeVideoId.startsWith('REPLACE_WITH')) {
        return (
            <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-gray-200 rounded">
                    <p className="text-gray-500">Video will be available soon.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="aspect-w-16 aspect-h-9">
                <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`} 
                    title={title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

const TutorialsPage = () => {
    const { t } = useTranslation();

    // These placeholders are now safe and clearly indicate what needs to be done.
    const tutorialVideos = [
        {
            id: 1,
            titleKey: 'tutorials_page.video1_title',
            descriptionKey: 'tutorials_page.video1_desc',
            youtubeVideoId: 'REPLACE_WITH_YOUR_YOUTUBE_ID_1'
        },
        {
            id: 2,
            titleKey: 'tutorials_page.video2_title',
            descriptionKey: 'tutorials_page.video2_desc',
            youtubeVideoId: 'REPLACE_WITH_YOUR_YOUTUBE_ID_2'
        }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">{t('tutorials_page.title')}</h1>
            <p className="text-lg text-center text-gray-600 mb-8">
                {t('tutorials_page.intro')}
            </p>
            
            <div className="space-y-8">
                {tutorialVideos.map(video => (
                    <VideoPlayer 
                        key={video.id}
                        title={t(video.titleKey)}
                        description={t(video.descriptionKey)}
                        youtubeVideoId={video.youtubeVideoId}
                    />
                ))}
            </div>
        </div>
    );
};

export default TutorialsPage;
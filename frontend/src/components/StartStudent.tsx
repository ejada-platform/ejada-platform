import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface FeaturedStudent {
    _id: string;
    username: string;
}

const StarStudent = () => {
    const { t } = useTranslation();
    const [student, setStudent] = useState<FeaturedStudent | null>(null);
    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await axios.get<FeaturedStudent | null>('http://localhost:5000/api/users/featured');
            
                setStudent(data); 
            } catch (error) {
                console.error("Could not fetch featured student", error);
            }
        };
        
        fetchFeatured();
    }, []);

    if (!student) {
        return null;
    }
    return (
        <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold">{t('star_student_component.title')}</h3>
            <p className="text-2xl mt-2">{student.username}</p>
        </div>
    );
};

export default StarStudent;
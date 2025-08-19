// src/components/StarStudent.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// The shape of the data we expect from the '/api/users/featured' endpoint
interface FeaturedStudent {
    _id: string;
    username: string;
}

const StarStudent = () => {
    // State to hold the student's data. It starts as null.
    const { t } = useTranslation();
    const [student, setStudent] = useState<FeaturedStudent | null>(null);

    // This useEffect runs once when the component is first displayed on the screen
    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // It makes a public API call to our backend to get the featured student
                const { data } = await axios.get<FeaturedStudent | null>('http://localhost:5000/api/users/featured');
            
                setStudent(data); // If a student is found, we save it in the state
            } catch (error) {
                // If there's an error, it just logs it and does nothing.
                console.error("Could not fetch featured student", error);
            }
        };
        
        fetchFeatured();
    }, []); // The empty array [] means this effect only runs one time.

    // --- LOGIC ---
    // If no student is featured (the API returns null or there's an error),
    // this component will render absolutely nothing. It will be invisible.
    if (!student) {
        return null;
    }

    // --- THE VISUAL BANNER ---
    // If a student IS found, this JSX is rendered.
    // This is the code for the gold banner you see.
    return (
        <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold">{t('star_student_component.title')}</h3>
            <p className="text-2xl mt-2">{student.username}</p>
        </div>
    );
};

export default StarStudent;
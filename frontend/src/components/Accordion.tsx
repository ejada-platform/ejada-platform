import React, { useState } from 'react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
}

const Accordion = ({ title, children }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold"
            >
                <span>{title}</span>
                {/* This will rotate the arrow icon based on the open state */}
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {/* The content will only be visible if isOpen is true */}
            {isOpen && (
                <div className="p-4 border-t text-gray-600">
                    {children}
                </div>
            )}
        </div>
    );
};

export default Accordion;
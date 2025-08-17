// src/components/Modal.tsx

import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Backdrop
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
        >
            {/* Modal Content */}
            <div 
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 z-50"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                {/* Modal Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
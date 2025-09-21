import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSuccessPage = () => {
    return (
        <div className="p-8 text-center">
            <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-700">Jazakallahu Khayran for your purchase.</p>
            <p className="mt-2">You now have access to the resource. You can find it in the Digital Library.</p>
            <Link to="/library" className="mt-6 inline-block bg-primary text-light font-bold py-3 px-6 rounded-lg">
                Return to Library
            </Link>
        </div>
    );
};

export default CheckoutSuccessPage;
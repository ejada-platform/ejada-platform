// src/pages/BookViewerPage.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BookViewerPage = () => {
    const location = useLocation();
    const { token } = useAuth();
    const bookUrl = new URLSearchParams(location.search).get('url');

    const [pdfSrc, setPdfSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // This function will be called when the component mounts
        const fetchPdf = async () => {
            // We must wait to ensure the token is loaded from localStorage by the AuthContext
            if (!token || !bookUrl) {
                // If the token isn't ready yet, we wait. This effect will re-run when it is.
                // If the bookUrl is missing, we show an error.
                if (!bookUrl) setError("Cannot display PDF without a URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const proxiedUrl = `http://localhost:5000/api/resources/proxy?url=${encodeURIComponent(bookUrl)}`;
                
                const response = await axios.get(proxiedUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                });

                const localUrl = URL.createObjectURL(response.data as Blob);
                setPdfSrc(localUrl);

            } catch (err) {
                setError("Failed to load the PDF document. The link may be invalid or you may not have permission.");
            } finally {
                setLoading(false);
            }
        };

        fetchPdf();

        // Cleanup function
        return () => {
            if (pdfSrc) {
                URL.revokeObjectURL(pdfSrc);
            }
        };
    }, [bookUrl, token]); // The key is to re-run this effect when the token becomes available

    if (loading) {
        return <div className="p-8 text-center">Loading document...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="w-full h-screen">
            {pdfSrc ? (
                <embed 
                    src={pdfSrc} 
                    type="application/pdf" 
                    width="100%" 
                    height="100%" 
                />
            ) : (
                <div className="p-8 text-center">Preparing document...</div>
            )}
        </div>
    );
};

export default BookViewerPage;
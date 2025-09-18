import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// --- THIS IS THE FINAL, CORRECTED WORKER CONFIGURATION ---
// We now point to the local file that our new Vite plugin provides.
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

const BookViewerPage = () => {
    const location = useLocation();
    const bookUrl = new URLSearchParams(location.search).get('url');

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }
    
    function onDocumentLoadError(error: Error) {
        let friendlyError = `Error while loading PDF: ${error.message}.`;
        if (bookUrl && !bookUrl.endsWith('.pdf')) {
            friendlyError += " Please ensure the URL is a direct link to a .pdf file.";
        }
        setError(friendlyError);
        setLoading(false);
    }

    if (!bookUrl) {
        return <div className="p-8 text-center">Error: No book URL was provided.</div>;
    }

    // We must provide a CORS proxy for Cloudinary URLs
    const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${bookUrl}`;

    return (
        <div className="p-4 md:p-8 flex flex-col items-center bg-gray-100 min-h-screen">
            {numPages && (
                <div className="w-full max-w-4xl bg-white p-2 rounded-lg shadow-lg mb-4 flex items-center justify-center space-x-4 sticky top-24 z-10">
                    <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="px-4 py-2 bg-primary text-light rounded disabled:bg-gray-400">Previous</button>
                    <p className="font-semibold">Page {pageNumber} of {numPages}</p>
                    <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages} className="px-4 py-2 bg-primary text-light rounded disabled:bg-gray-400">Next</button>
                </div>
            )}
            
            <div className="max-w-4xl w-full">
                <Document
                    file={corsProxyUrl} // Use the CORS proxy URL
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<div className="text-center p-8">Loading document...</div>}
                >
                    <div className="flex justify-center shadow-lg">
                        <Page pageNumber={pageNumber} width={Math.min(window.innerWidth * 0.9, 800)} />
                    </div>
                </Document>
            </div>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default BookViewerPage;

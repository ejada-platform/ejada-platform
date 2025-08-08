// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// We receive 'children' which will be the component we want to protect
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation(); // This gets the current URL path

    // 1. While the AuthContext is checking for a user, show a loading message.
    // This prevents a "flash" of the login page before the user is identified.
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>Loading...</div>
            </div>
        );
    }

    // 2. If loading is finished and there's NO user, redirect to the login page.
    // We also pass the original page they tried to visit in 'state'.
    // This allows us to redirect them back to that page after they log in.
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If loading is finished AND there IS a user, render the child component.
    // This means the user is authorized to see the page.
    return <>{children}</>;
};

export default ProtectedRoute;
// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. We add a new prop: 'allowedRoles'
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
    }

    // 2. First, check if there is a user at all.
    if (!user) {
        // If no user, redirect to login, as before.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If there IS a user, now we check if their role is in the allowedRoles array.
    if (!allowedRoles.includes(user.role)) {
        // If their role is not allowed, redirect them. 
        // We can create a dedicated "Unauthorized" page later, but for now, we'll send them to the home page.
        return <Navigate to="/" replace />;
    }

    // 4. If the user exists AND their role is allowed, render the page.
    return <>{children}</>;
};

export default ProtectedRoute;
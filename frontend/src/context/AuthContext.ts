// src/context/AuthContext.ts

import { createContext, useContext } from 'react';

// Define the shape of the user data
export interface User {
    _id: string;
    username: string;
    role: string;
    isFeatured?: boolean; // Optional property for featured users
}

// Define the shape of the context's value
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

// Create and export the context object.
// This is the only thing this file exports besides types.
export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => {},
    logout: () => {},
    isLoading: true,
});

// Create and export the custom hook for easy consumption
export const useAuth = () => {
    return useContext(AuthContext);
};
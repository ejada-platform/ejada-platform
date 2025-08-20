import { createContext, useContext } from 'react';
import type { INotification } from './AuthProvider';

export interface User {
    _id: string;
    username: string;
    role: string;
    isFeatured?: boolean; 
}

// Define the shape of the context's value
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
    notifications: INotification[]; // <-- ADD
    setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>; // Optional notifications array
}

// Create and export the context object.
// This is the only thing this file exports besides types.
export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => {},
    logout: () => {},
    isLoading: true,
    notifications: [],
    setNotifications: () => {},
});

// Create and export the custom hook for easy consumption
export const useAuth = () => {
    return useContext(AuthContext);
};
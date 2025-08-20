import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client'; 
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext';


export interface INotification {
    _id: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // If there is a user but no socket connection, create one.
        if (user && !socket) {
            const newSocket = io('http://localhost:5000'); // Connect to our backend
            setSocket(newSocket);
            
            // Tell the backend which user we are, so we can join our room
            newSocket.emit('join', user._id);
            
            // Listen for the 'new_notification' event from the server
            newSocket.on('new_notification', (notification: INotification) => {
                // When we get a new notification, add it to the top of our list
                setNotifications(prev => [notification, ...prev]);
            });

        // If there's no user but a socket exists, disconnect it.
        } else if (!user && socket) {
            socket.disconnect();
            setSocket(null);
        }

        // Cleanup function to disconnect when the component unmounts
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user]);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const contextValue = {
        user,
        token,
        login,
        logout,
        isLoading,
        notifications,
        setNotifications
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
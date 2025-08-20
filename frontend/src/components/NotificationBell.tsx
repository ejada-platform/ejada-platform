import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import type { INotification } from '../context/AuthProvider'; // Import the type

const NotificationBell = () => {
    const { token, notifications, setNotifications } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // 1. Fetch historical notifications when the component loads
    useEffect(() => {
        if (token) {
            const fetchNotifications = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get<INotification[]>('http://localhost:5000/api/notifications', config);
                    setNotifications(data);
                } catch (error) {
                    console.error("Failed to fetch notifications", error);
                }
            };
            fetchNotifications();
        }
    }, [token, setNotifications]);

    // 2. Function to mark notifications as read on the backend
    const markAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
        if (unreadIds.length === 0 || !token) return;

        // Optimistically update the UI for a fast user experience
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Tell the backend to mark them as read
            await axios.patch('http://localhost:5000/api/notifications/mark-read', {}, config);
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
            // If the API call fails, we could potentially revert the UI change here
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <button onClick={() => { setIsOpen(!isOpen); if (!isOpen) { markAsRead(); } }} className="relative text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border text-black max-h-96 overflow-y-auto z-50">
                    <div className="p-2 font-bold border-b">Notifications</div>
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <Link to={n.link || '#'} key={n._id} onClick={() => setIsOpen(false)} className="block p-3 hover:bg-gray-100 border-b">
                                <p className={`text-sm ${!n.isRead ? 'font-bold' : ''}`}>{n.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                            </Link>
                        ))
                    ) : (
                        <p className="p-4 text-sm text-gray-500">You have no notifications.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
// src/controllers/notification.controller.ts

import { Request, Response } from 'express';
import Notification from '../models/Notification.model';

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req: Request, res: Response) => {
    const user = req.user!;
    try {
        const notifications = await Notification.find({ recipient: user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Mark notifications as read
// @route   PATCH /api/notifications/mark-read
// @access  Private
export const markNotificationsAsRead = async (req: Request, res: Response) => {
    const user = req.user!;
    try {
        // Find all unread notifications for this user and update them
        await Notification.updateMany(
            { recipient: user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
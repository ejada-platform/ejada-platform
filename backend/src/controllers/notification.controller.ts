import { Request, Response } from 'express';
import Notification from '../models/Notification.model';
import User from '../models/User.model';
import { createAndSendNotification } from '../services/notification.service';

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

export const broadcastNotification = async (req: Request, res: Response) => {
    const { message, link } = req.body;
    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }
    try {
        const allUsers = await User.find({}).select('_id');
        const notificationPromises = allUsers.map(user => 
            createAndSendNotification({
                recipient: user._id.toString(),
                message: message,
                link: link || undefined
            })
        );
        await Promise.all(notificationPromises);
        res.status(200).json({ message: `Broadcast notification sent to ${allUsers.length} users.` });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
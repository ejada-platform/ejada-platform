import Notification from '../models/Notification.model';
import { io } from '../index'; // Import our Socket.IO instance

interface NotificationData {
    recipient: string;
    message: string;
    link?: string;
}

export const createAndSendNotification = async (data: NotificationData) => {
    try {
        // 1. Save the notification to the database
        const notification = await Notification.create({
            recipient: data.recipient,
            message: data.message,
            link: data.link,
            isRead: false,
        });

        // 2. Emit a real-time event to the specific user's room
        // The frontend will be listening for this 'new_notification' event
        io.to(data.recipient).emit('new_notification', notification);

        console.log(`Notification sent to user ${data.recipient}`);
    } catch (error) {
        console.error("Failed to create and send notification:", error);
    }
};
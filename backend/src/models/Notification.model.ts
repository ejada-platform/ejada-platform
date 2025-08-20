import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Schema.Types.ObjectId; // The user who should receive it
    message: string; // The notification text
    link?: string; // An optional link to a relevant page (e.g., /my-progress)
    isRead: boolean;
}

const NotificationSchema: Schema = new Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
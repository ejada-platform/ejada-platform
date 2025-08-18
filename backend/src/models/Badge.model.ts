// src/models/Badge.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
    name: string;
    description: string;
    iconUrl: string; // URL to an image for the badge
    createdBy: mongoose.Schema.Types.ObjectId;
}

const BadgeSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the badge'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    iconUrl: {
        type: String,
        required: [true, 'Please provide an icon URL'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<IBadge>('Badge', BadgeSchema);
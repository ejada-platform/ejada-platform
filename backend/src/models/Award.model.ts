// src/models/Award.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IAward extends Document {
    student: mongoose.Schema.Types.ObjectId;
    badge: mongoose.Schema.Types.ObjectId;
    awardedBy: mongoose.Schema.Types.ObjectId;
    notes?: string;
}

const AwardSchema: Schema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    badge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
        required: true,
    },
    awardedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    notes: {
        type: String, // Optional note from the teacher, e.g., "For memorizing Surah Yasin"
    }
}, {
    timestamps: true,
});

// A student can only earn each type of badge once
AwardSchema.index({ student: 1, badge: 1 }, { unique: true });

export default mongoose.model<IAward>('Award', AwardSchema);
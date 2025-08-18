// src/models/WorkLog.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkLog extends Document {
    teacher: mongoose.Schema.Types.ObjectId;
    circle: mongoose.Schema.Types.ObjectId;
    date: Date;
    duration: number; // Duration in hours (e.g., 1, 1.5, 2)
    notes?: string; // Optional notes about the session
}

const WorkLogSchema: Schema = new Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    circle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: [true, 'Please provide the duration in hours'],
        min: [0.5, 'Duration must be at least 0.5 hours'],
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<IWorkLog>('WorkLog', WorkLogSchema);
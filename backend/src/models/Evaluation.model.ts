// src/models/Evaluation.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluation extends Document {
    student: mongoose.Schema.Types.ObjectId;
    teacher: mongoose.Schema.Types.ObjectId;
    circle: mongoose.Schema.Types.ObjectId;
    date: Date;
    rating: number; // e.g., a score from 1 to 5
    notes?: string; // Teacher's specific comments for that day
}

const EvaluationSchema: Schema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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
        default: Date.now,
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);
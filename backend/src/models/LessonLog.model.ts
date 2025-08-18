// src/models/LessonLog.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonLog extends Document {
    teacher: mongoose.Schema.Types.ObjectId;
    circle: mongoose.Schema.Types.ObjectId;
    date: Date;
    specialization: 'Quran' | 'Arabic Language' | 'Islamic Lessons';
    topic: string; // e.g., "Surah Al-Fatiha - Tafsir" or "The Pillars of Salah"
    notes?: string; // Optional detailed notes about the lesson
}

const LessonLogSchema: Schema = new Schema({
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
    specialization: {
        type: String,
        enum: ['Quran', 'Arabic Language', 'Islamic Lessons'],
        required: true,
    },
    topic: {
        type: String,
        required: [true, 'Please provide the lesson topic'],
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<ILessonLog>('LessonLog', LessonLogSchema);
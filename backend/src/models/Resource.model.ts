// src/models/Resource.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
    title: string;
    description: string;
    resourceUrl: string; // The URL to the PDF, audio file, etc.
    category: 'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other';
    createdBy: mongoose.Schema.Types.ObjectId;
}

const ResourceSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    resourceUrl: {
        type: String,
        required: [true, 'Please provide a URL for the resource'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Quran', 'Hadith', 'Fiqh', 'Stories', 'Other'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<IResource>('Resource', ResourceSchema);
// src/models/Application.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    // Personal Info
    fullName: string;
    gender: 'Male' | 'Female';
    fatherName: string;
    motherName: string;
    dateOfBirth: Date;
    schoolClass?: string;
    // Contact Info
    countryOfResidence: string;
    city: string;
    nationality: string;
    phoneNumber: string;
    email: string;
    // Program Info
    howDidYouHear: string[];
    agreedToFees: boolean;
    program: 'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing';
    // Admin Fields
    status: 'Pending' | 'Approved' | 'Rejected';
    notes?: string;
}

const ApplicationSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    schoolClass: { type: String },
    countryOfResidence: { type: String, required: true },
    city: { type: String, required: true },
    nationality: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    howDidYouHear: [{ type: String }],
    agreedToFees: { type: Boolean, default: false },
    program: { 
        type: String, 
        enum: ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'], 
        required: true 
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
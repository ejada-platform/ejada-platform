// src/models/StudentProfile.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
    user: mongoose.Schema.Types.ObjectId;
    fullName: string;
    fatherName: string;
    motherName: string;
    gender: 'Male' | 'Female';
    dateOfBirth: Date;
    schoolClass: string;
    countryOfResidence: string;
    city: string;
    nationality: string;
    phoneNumber: string;
    howDidYouHear: string[];
    agreedToFees: boolean;
    program: 'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing';
    priceCategory: 'Discount' | 'Standard' | 'Non-Arab';
}

const StudentProfileSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    dateOfBirth: { type: Date, required: true },
    schoolClass: { type: String },
    countryOfResidence: { type: String, required: true },
    city: { type: String, required: true },
    nationality: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    howDidYouHear: [{ type: String }],
    agreedToFees: { type: Boolean, required: true },
    program: { 
        type: String, 
        enum: ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'], 
        required: true 
    },
    priceCategory: {
        type: String,
        enum: ['Discount', 'Standard', 'Non-Arab'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
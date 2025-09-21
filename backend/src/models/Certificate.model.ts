// src/models/Certificate.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
    student: mongoose.Schema.Types.ObjectId;
    program: 'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing';
    issueDate: Date;
    awardedBy: mongoose.Schema.Types.ObjectId; // Admin or Teacher who awarded it
    certificateUrl: string; // A link to a generated PDF (future enhancement)
}

const CertificateSchema: Schema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    program: {
        type: String,
        enum: ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'],
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    awardedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    certificateUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

// A student can only get one certificate per program
CertificateSchema.index({ student: 1, program: 1 }, { unique: true });

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
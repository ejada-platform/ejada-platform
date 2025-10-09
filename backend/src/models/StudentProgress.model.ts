// src/models/StudentProgress.model.ts

import mongoose, { Schema, Document } from 'mongoose';

// This sub-document stores the result of a single assessment
interface ICompletedAssessment {
    section: mongoose.Schema.Types.ObjectId;
    assessment: mongoose.Schema.Types.ObjectId;
    assessmentDate: Date;
    teacher: mongoose.Schema.Types.ObjectId;
    grade: 'Passed' | 'Needs Improvement';
    notes?: string;
}

export interface IStudentProgress extends Document {
    student: mongoose.Schema.Types.ObjectId;
    program: 'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing';
    completedAssessments: ICompletedAssessment[];
    currentSection: mongoose.Schema.Types.ObjectId; // The section the student is currently working on
}

const StudentProgressSchema: Schema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each student has only one progress document
    },
    program: {
        type: String,
        enum: ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'],
        required: true,
    },
    completedAssessments: [{
        section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
        assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
        assessmentDate: { type: Date, default: Date.now },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        grade: { type: String, enum: ['Passed', 'Needs Improvement'] },
        notes: { type: String },
    }],
    currentSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<IStudentProgress>('StudentProgress', StudentProgressSchema);
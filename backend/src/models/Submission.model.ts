import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
    assignment: mongoose.Schema.Types.ObjectId;
    student: mongoose.Schema.Types.ObjectId;
    content: string; // The student's submission (e.g., a link to a video, text)
    grade?: string; // e.g., "Excellent", "Good", "Needs Improvement"
    feedback?: string; // Teacher's comments
    status: 'Submitted' | 'Reviewed';
}

const SubmissionSchema: Schema = new Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Please provide content for your submission'],
    },
    grade: {
        type: String,
    },
    feedback: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Submitted', 'Reviewed'],
        default: 'Submitted',
    },
}, {
    timestamps: true,
});

// To prevent a student from submitting multiple times for the same assignment
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
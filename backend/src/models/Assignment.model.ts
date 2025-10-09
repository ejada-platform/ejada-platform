import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    section: mongoose.Schema.Types.ObjectId;
    description: string;
    dueDate?: Date;
    circle: mongoose.Schema.Types.ObjectId; // Link to the Educational Circle
    assignedTo: mongoose.Schema.Types.ObjectId[];
    createdBy: mongoose.Schema.Types.ObjectId; // 
    program: 'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing';
}

const AssignmentSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the assignment'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description or instructions']
    },
    dueDate: {
        type: Date
    },
    circle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle',
        required: true
    },
    assignedTo: [{ // The new array of student User IDs
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
        unique: true, // Each section can only have one assessment
    },
    program: {
        type: String,
        enum: ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'],
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
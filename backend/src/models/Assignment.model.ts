import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    description: string;
    dueDate?: Date;
    circle: mongoose.Schema.Types.ObjectId; // Link to the Educational Circle
    createdBy: mongoose.Schema.Types.ObjectId; // Link to the Teacher who created it
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
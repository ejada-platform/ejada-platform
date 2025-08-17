import mongoose, { Schema, Document } from 'mongoose';

export interface ICurriculum extends Document {
    title: string;
    description: string;
    level: string; // e.g., Beginner, Intermediate, Advanced
    contentUrl: string; // Link to a PDF, document, etc.
    createdBy: mongoose.Schema.Types.ObjectId; // Link to the Admin who created it
}

const CurriculumSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    level: {
        type: String,
        required: [true, 'Please specify a level'],
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Hifz']
    },
    contentUrl: {
        type: String,
        required: [true, 'Please add a content URL']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<ICurriculum>('Curriculum', CurriculumSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
    title: string;
    program: 'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing';
    order: number;
    description?: string; 
    contentUrl?: string; 
}

const SectionSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the section'],
        trim: true,
    },
    program: {
        type: String,
        enum: ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'],
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    contentUrl: {
        type: String,
    },
}, {
    timestamps: true,
});


SectionSchema.index({ program: 1, order: 1 }, { unique: true });

export default mongoose.model<ISection>('Section', SectionSchema);
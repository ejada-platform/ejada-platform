import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
    title: string;
    description: string;
    resourceUrl: string; // The URL to the PDF, audio file, etc.
    category: 'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other';
    createdBy: mongoose.Schema.Types.ObjectId;
    price: number;
    isFree: boolean;
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
    price: {
        type: Number,
        required: [true, 'Please set a price (use 0 for free resources)'],
        default: 0
    },
    isFree: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

ResourceSchema.pre('save', function(next) {
    if (this.price > 0) {
        this.isFree = false;
    } else {
        this.isFree = true;
    }
    next();
});

export default mongoose.model<IResource>('Resource', ResourceSchema);
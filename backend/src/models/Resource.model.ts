// src/models/Resource.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
    title: string;
    description: string;
    resourceUrl: string;
    category: 'Quran' | 'Hadith' | 'Fiqh' | 'Stories' | 'Other';
    createdBy: mongoose.Schema.Types.ObjectId;
    price: number;
    isFree: boolean;
}

const ResourceSchema: Schema = new Schema({
    title: { 
        type: String, required: true 
    },
    description: { 
        type: String, required: true 
    },
    resourceUrl: { 
        type: String, required: true 
    },
    category: { 
        type: String, required: true, enum: ['Quran', 'Hadith', 'Fiqh', 'Stories', 'Other']
     },
    createdBy: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
        },
    price: {
         type: Number, required: true, default: 0 
        },
    isFree: { 
        type: Boolean, default: true 
    }
}, { timestamps: true });

ResourceSchema.pre('save', function(next) {
    this.isFree = this.price <= 0;
    next();
});

export default mongoose.model<IResource>('Resource', ResourceSchema);
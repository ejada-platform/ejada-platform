// src/models/User.model.ts

import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// Re-defining the IUser interface for absolute clarity
// Note the use of Types.ObjectId
export interface IUser extends Document {
    _id: Types.ObjectId; // Explicitly define _id type
    username: string;
    password?: string;
    role: 'Student' | 'Teacher' | 'Admin';
    generatedCode?: string;
}

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Student', 'Teacher', 'Admin'], required: true },
    generatedCode: { type: String, unique: true, sparse: true }
}, {
    timestamps: true
});

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model<IUser>('User', UserSchema);
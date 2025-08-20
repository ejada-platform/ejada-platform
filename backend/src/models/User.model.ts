// src/models/User.model.ts

import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password?: string;
    role: 'Student' | 'Teacher' | 'Admin' | 'Parent';
    generatedCode?: string;
    isFeatured?: boolean;
    children?: Types.ObjectId[];
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}

// THIS IS THE CORRECTED SCHEMA
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Student', 'Teacher', 'Admin', 'Parent'], required: true },
    generatedCode: { type: String, unique: true, sparse: true },
    isFeatured: {
        type: Boolean,
        default: false,
        required: false // Explicitly state it's not required
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
    strict: false 
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
// src/models/User.model.ts

import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    password?: string;
    role: 'Student' | 'Teacher' | 'Admin';
    generatedCode?: string;
    isFeatured?: boolean;
}

// THIS IS THE CORRECTED SCHEMA
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Student', 'Teacher', 'Admin'], required: true },
    generatedCode: { type: String, unique: true, sparse: true },
    isFeatured: {
        type: Boolean,
        default: false,
        required: false // Explicitly state it's not required
    }
}, {
    timestamps: true,
    // This option ensures that even if a field is not in the schema, it's not an error.
    // It's a good safety net, but the main fix is the 'required: false' above.
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
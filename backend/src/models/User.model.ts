import mongoose, { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Define the interface for the User document
export interface IUser extends Document {
    username: string;
    password?: string; // Password is optional when fetching user data
    role: 'Student' | 'Teacher' | 'Admin';
    generatedCode?: string; // Optional, mainly for students
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // 'select: false' prevents password from being sent back in queries by default
    role: { type: String, enum: ['Student', 'Teacher', 'Admin'], required: true },
    generatedCode: { type: String, unique: true, sparse: true } // 'sparse' allows multiple null values
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Middleware to hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
});

export default mongoose.model<IUser>('User', UserSchema);
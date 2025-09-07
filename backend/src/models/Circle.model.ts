// src/models/Circle.model.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IScheduleEntry {
    day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    time: string;
}

export interface ICircle extends Document {
    name: string;
    description?: string;
    teacher: mongoose.Schema.Types.ObjectId;
    students: mongoose.Schema.Types.ObjectId[];
    liveClassUrl?: string;
    schedule?: IScheduleEntry[];
    program: 'Reading <7' | 'Reading 7+' | 'Reciting' | 'Memorizing';
}

const CircleSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add a name for the circle'],
        trim: true
    },
    description: {
        type: String
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    liveClassUrl: {
        type: String,
        trim: true
    },
    schedule: [{
        day: {
            type: String,
            enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            required: true
        },
        time: {
            type: String,
            required: true
        }
    }],
     program: {
        type: String,
        enum: ['Reading <7', 'Reading 7+', 'Reciting', 'Memorizing'],
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<ICircle>('Circle', CircleSchema);
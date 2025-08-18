import mongoose, { Schema, Document } from 'mongoose';

interface IScheduleEntry {
    day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    time: string; // e.g., "17:00" in 24-hour format
}


export interface ICircle extends Document {
    name: string;
    description?: string;
    teacher: mongoose.Schema.Types.ObjectId;
    students: mongoose.Schema.Types.ObjectId[];
    liveClassUrl?: string;
    schedule?: IScheduleEntry[];
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
    schedule: [{ // <-- ADD THIS NEW SCHEMA PROPERTY
        day: {
            type: String,
            enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            required: true
        },
        time: {
            type: String, // Storing as a string like "17:00" is simple and effective
            required: true
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model<ICircle>('Circle', CircleSchema);
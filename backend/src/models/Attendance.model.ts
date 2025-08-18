// src/models/Attendance.model.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IStudentStatus {
    student: mongoose.Schema.Types.ObjectId;
    status: 'Present' | 'Absent' | 'Excused';
}

export interface IAttendance extends Document {
    circle: mongoose.Schema.Types.ObjectId;
    date: Date;
    records: IStudentStatus[];
    takenBy: mongoose.Schema.Types.ObjectId; // The teacher who took the attendance
}

const AttendanceSchema: Schema = new Schema({
    circle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Excused'],
            required: true,
        },
    }],
    takenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

// A circle can only have one attendance record per day
AttendanceSchema.index({ circle: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
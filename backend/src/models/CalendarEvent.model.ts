import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendarEvent extends Document {
    title: string;
    start: Date;
    end: Date;
    type: 'Holiday' | 'Exam' | 'Reminder' | 'Other';
    description?: string;
}

const CalendarEventSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the event'],
        trim: true,
    },
    start: {
        type: Date,
        required: [true, 'Please provide a start date'],
    },
    end: {
        type: Date,
        required: [true, 'Please provide an end date'],
    },
    type: {
        type: String,
        enum: ['Holiday', 'Exam', 'Reminder', 'Other'],
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
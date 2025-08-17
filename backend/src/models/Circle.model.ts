import mongoose, { Schema, Document } from 'mongoose';

export interface ICircle extends Document {
    name: string;
    description?: string;
    teacher: mongoose.Schema.Types.ObjectId;
    students: mongoose.Schema.Types.ObjectId[];
    liveClassUrl?: string;
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
    }
}, {
    timestamps: true
});

export default mongoose.model<ICircle>('Circle', CircleSchema);
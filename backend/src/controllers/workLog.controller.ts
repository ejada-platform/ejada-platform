// src/controllers/workLog.controller.ts

import { Request, Response } from 'express';
import WorkLog from '../models/WorkLog.model';

export const createWorkLog = async (req: Request, res: Response) => {
    const teacher = req.user!;
    const { circleId, date, duration, notes, attendees } = req.body;

    try {
        // Use findOneAndUpdate with 'upsert' to prevent duplicate logs for the same day
        const workLog = await WorkLog.findOneAndUpdate(
            { teacher: teacher._id, circle: circleId, date: new Date(date) },
            { 
                duration,
                notes,
                attendees // Save the list of students who were present
            },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json(workLog);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create work log', error: error.message });
    }
};

export const getMyWorkLogs = async (req: Request, res: Response) => {
    const teacher = req.user!;
    try {
        const workLogs = await WorkLog.find({ teacher: teacher._id }).populate('circle', 'name').sort({ date: -1 });
        const totalHours = workLogs.reduce((acc, log) => acc + log.duration, 0);
        res.status(200).json({ workLogs, totalHours });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
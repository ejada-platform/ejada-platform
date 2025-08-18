// src/controllers/workLog.controller.ts

import { Request, Response } from 'express';
import WorkLog from '../models/WorkLog.model';

// @desc    Create a new work log
// @route   POST /api/worklogs
// @access  Private (Teacher)
export const createWorkLog = async (req: Request, res: Response) => {
    const teacher = req.user!;
    const { circleId, date, duration, notes } = req.body;

    // We can add a security check here to ensure the teacher is actually the teacher of the circle
    try {
        const workLog = await WorkLog.create({
            teacher: teacher._id,
            circle: circleId,
            date,
            duration,
            notes,
        });
        res.status(201).json(workLog);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create work log', error: error.message });
    }
};

// @desc    Get all work logs for the logged-in teacher
// @route   GET /api/worklogs
// @access  Private (Teacher)
export const getMyWorkLogs = async (req: Request, res: Response) => {
    const teacher = req.user!;

    try {
        const workLogs = await WorkLog.find({ teacher: teacher._id })
            .populate('circle', 'name') // Show the name of the circle
            .sort({ date: -1 }); // Show the most recent logs first

        // We can also calculate the total hours on the fly
        const totalHours = workLogs.reduce((acc, log) => acc + log.duration, 0);

        res.status(200).json({
            workLogs,
            totalHours,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
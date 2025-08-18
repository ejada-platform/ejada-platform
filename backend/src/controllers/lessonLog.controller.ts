// src/controllers/lessonLog.controller.ts

import { Request, Response } from 'express';
import LessonLog from '../models/LessonLog.model';
import Circle from '../models/Circle.model';

// @desc    Create a new lesson log for a circle
// @route   POST /api/lessonlogs
// @access  Private (Teacher, Admin)
export const createLessonLog = async (req: Request, res: Response) => {
    const teacher = req.user!;
    const { circleId, date, specialization, topic, notes } = req.body;

    try {
        // Security Check: Ensure the user is the teacher of this circle
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }
        if (circle.teacher.toString() !== teacher._id.toString()) {
            return res.status(403).json({ message: 'User is not the teacher of this circle' });
        }

        const lessonLog = await LessonLog.create({
            teacher: teacher._id,
            circle: circleId,
            date,
            specialization,
            topic,
            notes,
        });
        res.status(201).json(lessonLog);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create lesson log', error: error.message });
    }
};

// @desc    Get all lesson logs for a specific circle
// @route   GET /api/lessonlogs/circle/:circleId
// @access  Private (Members of the circle)
export const getLessonLogsForCircle = async (req: Request, res: Response) => {
    const user = req.user!;
    const { circleId } = req.params;

    try {
        // Security Check: Ensure the user is a member of the circle
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }
        const isMember = circle.students.some(studentId => studentId.toString() === user._id.toString()) || circle.teacher.toString() === user._id.toString();
        if (!isMember && user.role !== 'Admin') {
            return res.status(403).json({ message: 'User is not a member of this circle' });
        }

        const lessonLogs = await LessonLog.find({ circle: circleId })
            .populate('teacher', 'username')
            .sort({ date: -1 });

        res.status(200).json(lessonLogs);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
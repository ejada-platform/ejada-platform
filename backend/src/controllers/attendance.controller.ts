// src/controllers/attendance.controller.ts

import { Request, Response } from 'express';
import Attendance from '../models/Attendance.model';
import Circle from '../models/Circle.model';

// @desc    Submit attendance for a circle on a specific date
// @route   POST /api/attendance
// @access  Private (Teacher, Admin)
export const submitAttendance = async (req: Request, res: Response) => {
    const teacher = req.user!;
    const { circleId, date, records } = req.body; // records is an array: [{ student: 'studentId', status: 'Present' }]

    try {
        // Security Check: Ensure the user is the teacher of this circle
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }
        if (circle.teacher.toString() !== teacher._id.toString()) {
            return res.status(403).json({ message: 'User is not the teacher of this circle' });
        }

        // Use findOneAndUpdate with 'upsert' to either create a new record or update an existing one for that day
        const attendance = await Attendance.findOneAndUpdate(
            { circle: circleId, date: new Date(date) },
            { 
                records,
                takenBy: teacher._id,
                circle: circleId
            },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json(attendance);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: `Attendance for this date already exists and couldn't be updated.` });
        }
        res.status(400).json({ message: 'Failed to submit attendance', error: error.message });
    }
};

// @desc    Get attendance for a circle on a specific date
// @route   GET /api/attendance/circle/:circleId/:date
// @access  Private (Members of the circle)
export const getAttendanceForDate = async (req: Request, res: Response) => {
    try {
        const { circleId, date } = req.params;

        const attendance = await Attendance.findOne({ circle: circleId, date: new Date(date) })
            .populate('records.student', 'username'); // Populate student names in the records

        if (!attendance) {
            return res.status(404).json({ message: 'No attendance record found for this date.' });
        }

        res.status(200).json(attendance);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
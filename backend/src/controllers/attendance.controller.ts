import { Request, Response } from 'express';
import Attendance from '../models/Attendance.model';
import Circle from '../models/Circle.model';

// @desc    Submit attendance for a circle on a specific date
// @route   POST /api/attendance
// @access  Private (Teacher, Admin)
export const submitAttendance = async (req: Request, res: Response) => {
    const teacher = req.user!;
    const { circleId, date, records } = req.body; 

    try {
        // Security Check: Ensure the user is the teacher of this circle
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }
        if (circle.teacher.toString() !== teacher._id.toString()) {
            return res.status(403).json({ message: 'User is not the teacher of this circle' });
        }

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

// @access  Private (Admin, Teacher of the circle)
export const getAttendanceForCircle = async (req: Request, res: Response) => {
   
    try {
        const { circleId } = req.params;
        const attendanceRecords = await Attendance.find({ circle: circleId })
            .populate('takenBy', 'username')
            .sort({ date: -1 }); 
        
        res.status(200).json(attendanceRecords);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all attendance records on the platform
// @route   GET /api/attendance
// @access  Private (Admin)
export const getAllAttendance = async (req: Request, res: Response) => {
    try {
        const attendanceRecords = await Attendance.find({})
            .populate('circle', 'name')
            .populate('takenBy', 'username')
            .sort({ date: -1 });
        res.status(200).json(attendanceRecords);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
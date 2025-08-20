import { Request, Response } from 'express'; 
import Circle, { ICircle } from '../models/Circle.model';

export const createCircle = async (req: Request, res: Response) => {
    // Admins will provide the name, teacher ID, and an array of student IDs
    const { name, description, teacher, students, liveClassUrl, schedule } = req.body;

    try {
        const circle = await Circle.create({
            name,
            description,
            teacher,
            students,
            liveClassUrl,
            schedule // <-- Include the schedule in the circle creation
        });
        res.status(201).json(circle);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(400).json({ message: 'Failed to create circle', error });
    }
};

export const getMyCircles = async (req: Request, res: Response) => {
    const user = req.user!; 
    
    const userId = user._id;
    const userRole = user.role;
    let circles: ICircle[] = [];

    try {
        if (userRole === 'Teacher' || userRole === 'Admin') {
            // If the user is a Teacher or Admin, find circles where they are the teacher
            circles = await Circle.find({ teacher: userId }).populate('students', 'username');
        } else if (userRole === 'Student') {
            // If the user is a Student, find circles where they are in the students array
            circles = await Circle.find({ students: userId }).populate('teacher', 'username');
        }
        res.status(200).json(circles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateCircle = async (req: Request, res: Response) => {
    const user = req.user!;
    const { circleId } = req.params;
    const { name, description, liveClassUrl, schedule } = req.body;

    try {
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }

        // Security Check: Only the teacher of the circle or an Admin can update it.
        if (circle.teacher.toString() !== user._id.toString() && user.role !== 'Admin') {
            return res.status(403).json({ message: 'User not authorized to update this circle' });
        }

        // Update the fields
        circle.name = name || circle.name;
        circle.description = description || circle.description;
        circle.liveClassUrl = liveClassUrl || circle.liveClassUrl;
        if (schedule) {
            circle.schedule = schedule; // Update the schedule if provided
        }
        const updatedCircle = await circle.save();
        res.status(200).json(updatedCircle);

    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getAllCircles = async (req: Request, res: Response) => {
    try {
        const circles = await Circle.find({})
            .populate('teacher', 'username')
            .populate('students', 'username');
        res.status(200).json(circles);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
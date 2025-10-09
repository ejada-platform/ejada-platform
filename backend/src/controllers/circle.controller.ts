import { Request, Response } from 'express'; 
import Circle, { ICircle } from '../models/Circle.model';

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

export const createCircle = async (req: Request, res: Response) => {
    // Admins will provide the name, teacher ID, and an array of student IDs
    const { name, description, teacher, students, liveClassUrl, schedule, program } = req.body;

    try {
        const circle = await Circle.create({
            name,
            description,
            teacher,
            students,
            liveClassUrl,
            schedule,// <-- Include the schedule in the circle creation
            program
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
            // --- THIS IS THE FIX ---
            // We now populate both the username AND the _id
            circles = await Circle.find({ teacher: userId }).populate('students', 'username _id');
        } else if (userRole === 'Student') {
            // Students don't need the student list, so this is fine
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
    
    try {
        const circle = await Circle.findById(circleId);
        if (!circle) { return res.status(404).json({ message: 'Circle not found' }); }
        if (circle.teacher.toString() !== user._id.toString() && user.role !== 'Admin') {
            return res.status(403).json({ message: 'User not authorized to update this circle' });
        }

        // --- THIS IS THE FIX ---
        // We create an 'updates' object and only add the fields that were actually sent from the frontend.
        const updates: any = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.description) updates.description = req.body.description;
        if (req.body.liveClassUrl) updates.liveClassUrl = req.body.liveClassUrl;
        if (req.body.schedule) updates.schedule = req.body.schedule;
        if (req.body.starStudent) updates.starStudent = req.body.starStudent;

        // Use findByIdAndUpdate to apply only the specific changes.
        // This will not erase the other required fields like 'program'.
        const updatedCircle = await Circle.findByIdAndUpdate(circleId, { $set: updates }, { new: true });
        // --- END OF FIX ---

        res.status(200).json(updatedCircle);

    } catch (error: any) {
        console.error("UPDATE CIRCLE FAILED:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const getCircleById = async (req: Request, res: Response) => {
    try {
        const circle = await Circle.findById(req.params.circleId)
            .populate('students', 'username _id'); // We need the student IDs and usernames
            
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }
        // We can add a security check here to ensure the user is the teacher or an admin
        res.status(200).json(circle);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
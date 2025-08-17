import { Request, Response } from 'express'; 
import Circle, { ICircle } from '../models/Circle.model';




export const createCircle = async (req: Request, res: Response) => {
    // Admins will provide the name, teacher ID, and an array of student IDs
    const { name, description, teacher, students, liveClassUrl } = req.body;

    try {
        const circle = await Circle.create({
            name,
            description,
            teacher,
            students,
            liveClassUrl 
        });
        res.status(201).json(circle);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(400).json({ message: 'Failed to create circle', error });
    }
};

// @desc    Get the circles for the currently logged-in user
// @route   GET /api/circles/my-circles
// @access  Private (Students and Teachers)
export const getMyCircles = async (req: Request, res: Response) => {
    // The 'protect' middleware guarantees 'req.user' exists.
    // We use the non-null assertion "!" to tell TypeScript we are certain.
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

// @desc    Update a circle (e.g., to add a meeting link)
// @route   PUT /api/circles/:circleId
// @access  Private (Teacher or Admin)
export const updateCircle = async (req: Request, res: Response) => {
    const user = req.user!;
    const { circleId } = req.params;
    const { name, description, liveClassUrl } = req.body;

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

        const updatedCircle = await circle.save();
        res.status(200).json(updatedCircle);

    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
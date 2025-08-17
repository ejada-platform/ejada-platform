// src/controllers/assignment.controller.ts

import { Request, Response } from 'express'; // Use the standard Request and Response
import Assignment from '../models/Assignment.model';
import Circle from '../models/Circle.model';

// @desc    Create a new assignment for a specific circle
// @route   POST /api/assignments
// @access  Private (Teacher, Admin)
export const createAssignment = async (req: Request, res: Response) => {
    // The 'protect' middleware now guarantees that 'req.user' exists.
    // The red underlines will be gone for good.
    const user = req.user!; // The "!" asserts that user is not null here.

    const { title, description, dueDate, circleId } = req.body;

    try {
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }
        
        if (circle.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'User is not the teacher of this circle' });
        }

        const assignment = await Assignment.create({
            title,
            description,
            dueDate,
            circle: circleId,
            createdBy: user._id,
        });

        res.status(201).json(assignment);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create assignment', error: error.message });
    }
};

// @desc    Get all assignments for a specific circle
// @route   GET /api/assignments/circle/:circleId
// @access  Private (Members of the circle)
export const getAssignmentsForCircle = async (req: Request, res: Response) => {
    const user = req.user!; // Assert user is not null.

    try {
        const circleId = req.params.circleId;
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }

        const loggedInUserId = user._id.toString();
        const isTeacher = circle.teacher.toString() === loggedInUserId;
        const isStudent = circle.students.some(studentId => studentId.toString() === loggedInUserId);

        if (!isTeacher && !isStudent) {
            return res.status(403).json({ message: 'User is not a member of this circle' });
        }

        const assignments = await Assignment.find({ circle: circleId }).populate('createdBy', 'username').sort({ createdAt: -1 });
        res.status(200).json(assignments);

    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
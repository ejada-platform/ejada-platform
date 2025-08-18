// src/controllers/award.controller.ts

import { Request, Response } from 'express';
import Award from '../models/Award.model';

// @desc    Award a badge to a student
// @route   POST /api/awards
// @access  Private (Teacher, Admin)
export const createAward = async (req: Request, res: Response) => {
    const teacher = req.user!;
    const { studentId, badgeId, notes } = req.body;

    // We can add security checks here later to ensure the student is in the teacher's circle
    const award = await Award.create({
        student: studentId,
        badge: badgeId,
        awardedBy: teacher._id,
        notes
    });
    res.status(201).json(award);
};

// @desc    Get all awards for a specific student
// @route   GET /api/awards/student/:studentId
// @access  Private (Authenticated Users)
export const getAwardsForStudent = async (req: Request, res: Response) => {
    const awards = await Award.find({ student: req.params.studentId })
        .populate('badge', 'name description iconUrl') // Populate the badge details
        .populate('awardedBy', 'username'); // Show who awarded it
    res.json(awards);
};
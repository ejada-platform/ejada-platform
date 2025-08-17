import { Response } from 'express';
import Curriculum from '../models/Curriculum.model';
// 1. Import the AuthRequest interface we just exported
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all curricula
// @route   GET /api/curriculum
// @access  Private (Teacher, Admin)
// 2. Use AuthRequest instead of the generic Request type
export const getCurricula = async (req: AuthRequest, res: Response) => {
    const curricula = await Curriculum.find().populate('createdBy', 'username');
    res.status(200).json(curricula);
};

// @desc    Create a curriculum
// @route   POST /api/curriculum
// @access  Private (Admin)
// 3. Use AuthRequest here as well
export const createCurriculum = async (req: AuthRequest, res: Response) => {
    // 4. Now, TypeScript knows that req.user exists and has an _id property.
    // The red underline will disappear.
    if (!req.user) {
        // This is a safety check in case something goes wrong with the protect middleware
        return res.status(401).json({ message: 'User not found on request' });
    }

    // Add the creator's ID to the request body
    req.body.createdBy = req.user._id;

    const curriculum = await Curriculum.create(req.body);
    res.status(201).json(curriculum);
};
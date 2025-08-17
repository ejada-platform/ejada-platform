// src/controllers/evaluation.controller.ts

import { Request, Response } from 'express';
import Evaluation from '../models/Evaluation.model';

// @desc    Create a daily evaluation for a student
// @route   POST /api/evaluations
// @access  Private (Teacher, Admin)
export const createEvaluation = async (req: Request, res: Response) => {
    const teacher = req.user!;
    // Teacher provides the studentId, circleId, rating, and notes
    const { studentId, circleId, rating, notes } = req.body;

    try {
        // We can add a security check here later to ensure the teacher is part of the circle
        const evaluation = await Evaluation.create({
            student: studentId,
            teacher: teacher._id,
            circle: circleId,
            rating,
            notes,
        });
        res.status(201).json(evaluation);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create evaluation', error: error.message });
    }
};

// @desc    Get all evaluations for a specific student
// @route   GET /api/evaluations/student/:studentId
// @access  Private (Teacher of the circle, or the Student themselves)
export const getEvaluationsForStudent = async (req: Request, res: Response) => {
    // We can add authorization logic here later
    try {
        const evaluations = await Evaluation.find({ student: req.params.studentId })
            .populate('teacher', 'username')
            .sort({ date: -1 });

        res.status(200).json(evaluations);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
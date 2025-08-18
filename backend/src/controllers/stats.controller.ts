// src/controllers/stats.controller.ts

import { Request, Response } from 'express';
import Evaluation from '../models/Evaluation.model';
import Submission from '../models/Submission.model';
import User from '../models/User.model'; // <-- 1. IMPORT USER MODEL
import Circle from '../models/Circle.model'; // <-- 2. IMPORT CIRCLE MODEL
import WorkLog from '../models/WorkLog.model'; // <-- 3. IMPORT WORKLOG MODEL
import mongoose from 'mongoose';

// @desc    Get progress statistics for a single student
// @route   GET /api/stats/student/:studentId
// @access  Private (Admin, Teacher of the circle, or the Student themselves)
export const getStudentStats = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        // --- We will perform two parallel calculations ---

        // 1. Calculate Evaluation Statistics using Aggregation
        const evaluationStats = await Evaluation.aggregate([
            // Stage 1: Match all documents for the specified student
            {
                $match: { student: new mongoose.Types.ObjectId(studentId) }
            },
            // Stage 2: Group them together and calculate stats
            {
                $group: {
                    _id: "$student", // Group by the student ID
                    averageRating: { $avg: "$rating" }, // Calculate the average of the 'rating' field
                    totalEvaluations: { $sum: 1 } // Count the number of documents
                }
            }
        ]);

        // 2. Calculate Total Submissions
        const totalSubmissions = await Submission.countDocuments({ student: studentId });

        // 3. Combine the results
        const stats = {
            averageRating: evaluationStats.length > 0 ? parseFloat(evaluationStats[0].averageRating.toFixed(2)) : 0,
            totalEvaluations: evaluationStats.length > 0 ? evaluationStats[0].totalEvaluations : 0,
            totalSubmissions: totalSubmissions
        };

        res.status(200).json(stats);

    } catch (error: any) {
        // Handle cases where the studentId is not a valid ObjectId
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get overview statistics for the entire platform
// @route   GET /api/stats/overview
// @access  Private (Admin)
export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        // We will run multiple queries in parallel for maximum efficiency
        const [
            totalStudents,
            totalTeachers,
            totalCircles,
            totalHoursLogged,
        ] = await Promise.all([
            User.countDocuments({ role: 'Student' }),
            User.countDocuments({ role: 'Teacher' }),
            Circle.countDocuments({}),
            WorkLog.aggregate([
                // We could add date filters here later, e.g., for "this month"
                {
                    $group: {
                        _id: null,
                        totalDuration: { $sum: '$duration' }
                    }
                }
            ])
        ]);

        const stats = {
            totalStudents,
            totalTeachers,
            totalCircles,
            // The result of the aggregate is an array, so we check if it has content
            totalHoursLogged: totalHoursLogged.length > 0 ? totalHoursLogged[0].totalDuration : 0
        };

        res.status(200).json(stats);

    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
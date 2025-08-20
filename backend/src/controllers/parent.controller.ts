// src/controllers/parent.controller.ts

import { Request, Response } from 'express';
import User from '../models/User.model';
import Submission from '../models/Submission.model';
import Evaluation from '../models/Evaluation.model';

// @desc    Get a parent's children and their complete progress data
// @route   GET /api/parent/my-children
// @access  Private (Parent)
export const getMyChildrenData = async (req: Request, res: Response) => {
    const parent = req.user!;

    try {
        // 1. Find the parent document and populate the 'children' array with the full student objects
        const parentData = await User.findById(parent._id).populate({
            path: 'children',
            select: 'username role' // Select the fields we want from the child's user document
        });

        if (!parentData || !parentData.children || parentData.children.length === 0) {
            return res.status(200).json([]); // Return an empty array if no children are linked
        }

        // 2. For each child, fetch all their submissions and evaluations
        const childrenWithProgress = await Promise.all(
            parentData.children.map(async (child: any) => {
                const submissions = await Submission.find({ student: child._id })
                    .populate('assignment', 'title description'); // Add assignment details
                
                const evaluations = await Evaluation.find({ student: child._id })
                    .populate('teacher', 'username'); // Add teacher's name
                
                return {
                    _id: child._id,
                    username: child.username,
                    submissions,
                    evaluations,
                };
            })
        );

        res.status(200).json(childrenWithProgress);

    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
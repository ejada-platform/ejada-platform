import { Request, Response } from 'express';
import Submission from '../models/Submission.model';
import Assignment from '../models/Assignment.model';
import Circle from '../models/Circle.model';


export const createSubmission = async (req: Request, res: Response) => {
    const user = req.user!; // We know the user exists from the 'protect' middleware
    const { assignmentId, content } = req.body;

    try {
        // A student is submitting their work for a specific assignment
        const submission = await Submission.create({
            assignment: assignmentId,
            student: user._id,
            content: content,
        });
        res.status(201).json(submission);
    } catch (error: any) {
        // This will catch errors, including the "duplicate key" error if they submit twice
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already submitted for this assignment.' });
        }
        res.status(400).json({ message: 'Failed to create submission', error: error.message });
    }
};

// @desc    Get all submissions for a specific assignment
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private (Teacher of the circle)
export const getSubmissionsForAssignment = async (req: Request, res: Response) => {
    // We would add more logic here to ensure the user is the teacher of the circle this assignment belongs to
    // For now, we'll keep it simple for testing.
    try {
        const submissions = await Submission.find({ assignment: req.params.assignmentId })
            .populate('student', 'username'); // Show the student's name
        
        res.status(200).json(submissions);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Review a student's submission (grade and feedback)
// @route   PATCH /api/submissions/:submissionId/review
// @access  Private (Teacher of the circle)
export const reviewSubmission = async (req: Request, res: Response) => {
    const user = req.user!; // We know the user is a logged-in teacher
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    try {
        // 1. Find the submission that needs to be reviewed
        const submission = await Submission.findById(submissionId).populate({
            path: 'assignment',
            populate: {
                path: 'circle',
                model: 'Circle'
            }
        });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // 2. Security Check: Ensure the logged-in user is the teacher of the circle this submission belongs to.
        // We need to cast the populated path to access its properties.
        const assignment = submission.assignment as any; 
        if (!assignment || !assignment.circle) {
             return res.status(404).json({ message: 'Associated assignment or circle not found' });
        }
        if (assignment.circle.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to review this submission' });
        }
        
        // 3. Update the submission with the teacher's review
        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'Reviewed';

        await submission.save();

        res.status(200).json(submission);

    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
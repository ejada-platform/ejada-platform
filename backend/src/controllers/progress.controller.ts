import { Request, Response } from 'express';
import StudentProgress from '../models/StudentProgress.model';
import Section from '../models/Section.model';

// @desc    Get a student's progress details
// @route   GET /api/progress/student/:studentId
export const getStudentProgress = async (req: Request, res: Response) => {
    const progress = await StudentProgress.findOne({ student: req.params.studentId }).populate('currentSection');
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    res.json(progress);
};

// @desc    Complete an assessment for a student and advance them
// @route   POST /api/progress/complete-assessment
export const completeAssessment = async (req: Request, res: Response) => {
    const teacher = req.user!;
    const { studentId, sectionId, assessmentId, grade, notes } = req.body;

    const progress = await StudentProgress.findOne({ student: studentId });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    // Add to completed list
    progress.completedAssessments.push({ section: sectionId, assessment: assessmentId, teacher: teacher._id, grade, notes });

    if (grade === 'Passed') {
        const currentSection = await Section.findById(sectionId);
        const nextSection = await Section.findOne({ program: progress.program, order: currentSection!.order + 1 });
        if (nextSection) {
            progress.currentSection = nextSection._id;
        } else {
            // Student has finished the program!
            // We can add logic here later to mark the program as complete.
        }
    }
    await progress.save();
    res.json(progress);
};
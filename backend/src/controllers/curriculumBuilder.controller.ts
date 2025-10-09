import { Request, Response } from 'express';
import Section from '../models/Section.model';
import Assessment from '../models/Assignment.model';

// --- SECTION MANAGEMENT ---

// @desc    Create a new curriculum section
// @route   POST /api/curriculum-builder/sections
// @access  Private (Admin)
export const createSection = async (req: Request, res: Response) => {
    try {
        const section = await Section.create(req.body);
        res.status(201).json(section);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create section', error: error.message });
    }
};

// @desc    Get all sections for a specific program
// @route   GET /api/curriculum-builder/sections/:program
// @access  Private (Admin)
export const getSectionsByProgram = async (req: Request, res: Response) => {
    try {
        const sections = await Section.find({ program: req.params.program }).sort({ order: 1 });
        res.status(200).json(sections);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- ASSESSMENT MANAGEMENT ---

// @desc    Create a new assessment and link it to a section
// @route   POST /api/curriculum-builder/assessments
// @access  Private (Admin)
export const createAssessment = async (req: Request, res: Response) => {
    try {
        const assessment = await Assessment.create(req.body);
        res.status(201).json(assessment);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'An assessment for this section already exists.' });
        }
        res.status(400).json({ message: 'Failed to create assessment', error: error.message });
    }
};

// @desc    Get all assessments for a specific program
// @route   GET /api/curriculum-builder/assessments/:program
// @access  Private (Admin)
export const getAssessmentsByProgram = async (req: Request, res: Response) => {
    try {
        const assessments = await Assessment.find({ program: req.params.program })
            .populate({
                path: 'section',
                select: 'title order'
            });
        res.status(200).json(assessments);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
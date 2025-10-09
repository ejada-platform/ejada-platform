import express from 'express';
import {
    createSection,
    getSectionsByProgram,
    createAssessment,
    getAssessmentsByProgram
} from '../controllers/curriculumBuilder.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes in this file are for Admins only
router.use(protect, authorize('Admin'));

// Routes for managing curriculum sections
router.route('/sections')
    .post(createSection);

router.route('/sections/:program')
    .get(getSectionsByProgram);

// Routes for managing assessments
router.route('/assessments')
    .post(createAssessment);

router.route('/assessments/:program')
    .get(getAssessmentsByProgram);

export default router;
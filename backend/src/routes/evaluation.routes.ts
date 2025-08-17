// src/routes/evaluation.routes.ts

import express from 'express';
import { createEvaluation, getEvaluationsForStudent } from '../controllers/evaluation.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// A Teacher creates an evaluation
router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), createEvaluation);

// A Teacher or Student views the student's evaluations
router.route('/student/:studentId')
    .get(protect, getEvaluationsForStudent);

export default router;
// src/routes/progress.routes.ts
import express from 'express';
import { getStudentProgress, completeAssessment } from '../controllers/progress.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();
router.use(protect);

router.get('/student/:studentId', getStudentProgress);
router.post('/complete-assessment', authorize('Teacher', 'Admin'), completeAssessment);

export default router;
// src/routes/lessonLog.routes.ts

import express from 'express';
import { createLessonLog, getLessonLogsForCircle } from '../controllers/lessonLog.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// A Teacher creates a lesson log
router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), createLessonLog);

// Members of a circle can view the lesson history
router.route('/circle/:circleId')
    .get(protect, getLessonLogsForCircle);

export default router;
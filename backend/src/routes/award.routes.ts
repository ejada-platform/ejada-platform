// src/routes/award.routes.ts
import express from 'express';
import { createAward, getAwardsForStudent } from '../controllers/award.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Teachers award badges
router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), createAward);

// Anyone logged in can see a student's awards
router.route('/student/:studentId')
    .get(protect, getAwardsForStudent);

export default router;
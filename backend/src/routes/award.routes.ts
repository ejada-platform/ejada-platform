import express from 'express';
import { createAward, getAwardsForStudent } from '../controllers/award.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), createAward);

router.route('/student/:studentId')
    .get(protect, getAwardsForStudent);

export default router;
// src/routes/stats.routes.ts

import express from 'express';
import { getStudentStats, getPlatformStats } from '../controllers/stats.controller'; 
import { protect, authorize } from '../middleware/auth.middleware';
const router = express.Router();

// This route should be protected, but authorization (who can see whose stats)
// will be handled on the frontend for now for simplicity.
// In a future step, we could add backend logic to check if a teacher belongs to the student's circle.
router.route('/student/:studentId')
    .get(protect, getStudentStats);

    router.route('/overview')
    .get(protect, authorize('Admin'), getPlatformStats);
export default router;
// src/routes/stats.routes.ts

import express from 'express';
import { getStudentStats, getPlatformStats } from '../controllers/stats.controller'; 
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// =================================================================
// === THIS IS THE CRITICAL FIX ===
// We define the public route FIRST.
// =================================================================
// @desc    Get overview statistics for the entire platform
// @route   GET /api/stats/overview
// @access  Public
router.get('/overview', getPlatformStats);
// =================================================================


// =================================================================
// NOW, we define the protected routes.
// =================================================================
// @desc    Get progress statistics for a single student
// @route   GET /api/stats/student/:studentId
// @access  Private (Authenticated Users)
router.route('/student/:studentId')
    .get(protect, getStudentStats); // This route remains protected

export default router;
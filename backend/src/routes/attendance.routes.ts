// src/routes/attendance.routes.ts

import express from 'express';
import { submitAttendance, getAttendanceForDate, getAttendanceForCircle } from '../controllers/attendance.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// A Teacher submits the attendance for their circle
router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), submitAttendance);

    router.route('/circle/:circleId')
    .get(protect, authorize('Teacher', 'Admin'), getAttendanceForCircle);

// A Teacher or Student views attendance for a specific date
router.route('/circle/:circleId/:date')
    .get(protect, getAttendanceForDate); // Authorization for members can be added later

export default router;
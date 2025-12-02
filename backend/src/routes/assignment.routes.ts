import express from 'express';
import { createAssignment, getAssignmentsForCircle } from '../controllers/assignment.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), createAssignment);


router.route('/circle/:circleId')
    .get(protect, getAssignmentsForCircle);

export default router;
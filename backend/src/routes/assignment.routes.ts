// src/routes/assignment.routes.ts

import express from 'express';
import { createAssignment, getAssignmentsForCircle } from '../controllers/assignment.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Route for Teachers to create an assignment
router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), createAssignment);

// Route for members of a circle to get all its assignments
router.route('/circle/:circleId')
    .get(protect, getAssignmentsForCircle); // Authorization is handled inside the controller

export default router;
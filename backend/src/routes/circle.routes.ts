import express from 'express';
import { createCircle, getMyCircles, updateCircle, getAllCircles } from '../controllers/circle.controller';
import { protect, authorize } from '../middleware/auth.middleware';


const router = express.Router();

router.route('/all')
    .get(protect, authorize('Admin'), getAllCircles);
// Route for Admins to create a circle
router.route('/')
    .post(protect, authorize('Admin'), createCircle);

// Route for logged-in users to get their specific circles
router.route('/my-circles')
    .get(protect, getMyCircles); // We don't need authorize() here because the controller has the logic

router.route('/:circleId')
    .put(protect, authorize('Teacher', 'Admin'), updateCircle);

export default router;
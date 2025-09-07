import express from 'express';
import { submitApplication, getPendingApplications, approveApplication } from '../controllers/application.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();


// This is a public route that anyone can access to submit the form
router.route('/').post(submitApplication);

// Admin routes, protected
router.route('/')
    .get(protect, authorize('Admin'), getPendingApplications);
    
router.route('/:id/approve')
    .post(protect, authorize('Admin'), approveApplication);

export default router;
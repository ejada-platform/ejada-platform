import express from 'express';
import { createSubmission, getSubmissionsForAssignment, reviewSubmission } from '../controllers/submission.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .post(protect, authorize('Student'), createSubmission);

router.route('/assignment/:assignmentId')
    .get(protect, authorize('Teacher', 'Admin'), getSubmissionsForAssignment);
router.route('/:submissionId/review')
    .patch(protect, authorize('Teacher', 'Admin'), reviewSubmission);

export default router;
import express from 'express';
import { getCurricula, createCurriculum } from '../controllers/curriculum.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Here we apply our new middleware!
// The request will first go through 'protect', then 'authorize', then the controller.
router.route('/')
    .get(protect, authorize('Admin', 'Teacher'), getCurricula)
    .post(protect, authorize('Admin'), createCurriculum);

export default router;
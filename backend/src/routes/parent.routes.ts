import express from 'express';
import { getMyChildrenData } from '../controllers/parent.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// This entire route is protected and only accessible by users with the 'Parent' role
router.route('/my-children')
    .get(protect, authorize('Parent'), getMyChildrenData);

export default router;
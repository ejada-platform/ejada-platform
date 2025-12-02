import express from 'express';
import { getBadges, createBadge } from '../controllers/badge.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getBadges) 
    .post(protect, authorize('Admin'), createBadge); 

export default router;
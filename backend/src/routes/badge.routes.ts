// src/routes/badge.routes.ts
import express from 'express';
import { getBadges, createBadge } from '../controllers/badge.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getBadges) // Any logged-in user can see the available badges
    .post(protect, authorize('Admin'), createBadge); // Only Admins can create new badge types

export default router;
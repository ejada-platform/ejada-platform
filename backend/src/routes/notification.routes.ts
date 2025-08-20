// src/routes/notification.routes.ts

import express from 'express';
import { getMyNotifications, markNotificationsAsRead } from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes here are for the logged-in user
router.use(protect);

router.route('/')
    .get(getMyNotifications);

router.route('/mark-read')
    .patch(markNotificationsAsRead);

export default router;
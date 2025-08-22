import express from 'express';
import { getMyNotifications, markNotificationsAsRead, broadcastNotification } from '../controllers/notification.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getMyNotifications);

router.route('/mark-read')
    .patch(markNotificationsAsRead);

// This is the Admin-only route
router.route('/broadcast')
    .post(authorize('Admin'), broadcastNotification);

export default router;
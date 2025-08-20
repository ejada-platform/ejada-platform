import express from 'express';
import { getEvents, createEvent, deleteEvent } from '../controllers/calendar.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getEvents) // Everyone can see the calendar
    .post(protect, authorize('Admin'), createEvent); // Only Admins can create events

router.route('/:id')
    .delete(protect, authorize('Admin'), deleteEvent); // Only Admins can delete events

export default router;
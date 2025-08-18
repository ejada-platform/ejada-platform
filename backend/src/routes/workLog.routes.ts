// src/routes/workLog.routes.ts

import express from 'express';
import { createWorkLog, getMyWorkLogs } from '../controllers/workLog.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Both routes are protected and for Teachers/Admins only
router.use(protect, authorize('Teacher', 'Admin'));

router.route('/')
    .get(getMyWorkLogs)
    .post(createWorkLog);

export default router;
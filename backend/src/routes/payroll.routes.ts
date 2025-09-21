// src/routes/payroll.routes.ts
import express from 'express';
import { calculatePayroll } from '../controllers/payroll.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// This is a protected, Admin-only route
router.post('/calculate', protect, authorize('Admin'), calculatePayroll);

export default router;
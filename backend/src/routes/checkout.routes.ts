// src/routes/checkout.routes.ts
import express from 'express';
import { createCheckoutSession } from '../controllers/checkout.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create-session', protect, createCheckoutSession);

export default router;
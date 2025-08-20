// src/routes/auth.routes.ts

import express from 'express';
// 1. Import BOTH registerUser and loginUser from the controller file
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = express.Router();

// 2. This route handles new user registration
router.post('/register', registerUser);

// 3. This new route will handle user login
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
export default router;
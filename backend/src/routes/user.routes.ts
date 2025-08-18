// src/routes/user.routes.ts

import express from 'express';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/user.controller';
import User from '../models/User.model';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// =================================================================
// === THIS IS THE CRITICAL FIX ===
// We define the public route FIRST.
// =================================================================
// @desc    Get the featured student
// @route   GET /api/users/featured
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const featuredStudent = await User.findOne({ role: 'Student', isFeatured: true }).select('username _id');
        res.json(featuredStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// =================================================================


// =================================================================
// NOW, we apply the security middleware.
// Any route defined AFTER this point will be protected.
// =================================================================
router.use(protect);
router.use(authorize('Admin'));

// --- These Admin Routes are now correctly protected ---
router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

export default router;
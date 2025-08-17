// src/routes/user.routes.ts

import express from 'express';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes in this file are protected and for Admins only.
// We can apply the middleware to the whole router like this.
router.use(protect);
router.use(authorize('Admin'));

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

export default router;
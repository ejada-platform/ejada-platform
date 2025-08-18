// src/routes/resource.routes.ts

import express from 'express';
import { getResources, createResource, deleteResource } from '../controllers/resource.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public route to get all resources
router.route('/')
    .get(getResources)
    .post(protect, authorize('Admin'), createResource); // Admin-only to create

// Admin-only route to delete a specific resource
router.route('/:id')
    .delete(protect, authorize('Admin'), deleteResource);

export default router;
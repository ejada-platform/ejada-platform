// src/routes/resource.routes.ts

import express from 'express';
import { getResources, createResource, deleteResource } from '../controllers/resource.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getResources)
    // This is now a simple POST route again, without the upload middleware
    .post(protect, authorize('Admin'), createResource);

router.route('/:id')
    .delete(protect, authorize('Admin'), deleteResource);

export default router;
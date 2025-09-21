import express from 'express';
import { getResources, createResource, deleteResource } from '../controllers/resource.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware'; // Import upload
import { proxyResource } from '../controllers/resource.controller';

const router = express.Router();

router.route('/')
    .get(protect, getResources)
    // This is now a simple POST route again, without the upload middleware
    .post(protect, authorize('Admin'), upload.single('resourceFile'), createResource);

router.route('/:id')
    .delete(protect, authorize('Admin'), deleteResource);

router.get('/proxy', protect, proxyResource);

export default router;
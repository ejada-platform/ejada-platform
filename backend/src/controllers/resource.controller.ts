// src/controllers/resource.controller.ts

import { Request, Response } from 'express';
import Resource from '../models/Resource.model';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getResources = async (req: Request, res: Response) => {
    try {
        const resources = await Resource.find({}).sort({ createdAt: -1 });
        res.status(200).json(resources);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private (Admin)
export const createResource = async (req: Request, res: Response) => {
    const admin = req.user!;
    const { title, description, resourceUrl, category } = req.body;

    try {
        const resource = await Resource.create({
            title,
            description,
            resourceUrl,
            category,
            createdBy: admin._id,
        });
        res.status(201).json(resource);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create resource', error: error.message });
    }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
export const deleteResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await resource.deleteOne();
        res.status(200).json({ message: 'Resource removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
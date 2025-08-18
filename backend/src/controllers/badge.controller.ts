// src/controllers/badge.controller.ts

import { Request, Response } from 'express';
import Badge from '../models/Badge.model';

// @desc    Get all available badge types
// @route   GET /api/badges
// @access  Private (Authenticated Users)
export const getBadges = async (req: Request, res: Response) => {
    const badges = await Badge.find({});
    res.json(badges);
};

// @desc    Create a new badge type
// @route   POST /api/badges
// @access  Private (Admin)
export const createBadge = async (req: Request, res: Response) => {
    const { name, description, iconUrl } = req.body;
    const admin = req.user!;
    
    const badge = await Badge.create({ name, description, iconUrl, createdBy: admin._id });
    res.status(201).json(badge);
};
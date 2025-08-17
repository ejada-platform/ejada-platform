// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import User from '../models/User.model';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response) => {
    try {
        // Find all users but exclude their passwords from the response
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a user's details (e.g., their role)
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if they are provided in the request body
        user.username = req.body.username || user.username;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // We should also consider deleting related data (circles, submissions) in a real-world scenario,
        // but for now, we will just delete the user document.
        await user.deleteOne();

        res.status(200).json({ message: 'User removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
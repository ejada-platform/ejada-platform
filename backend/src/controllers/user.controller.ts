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

// @desc    Update a user's details (e.g., their role or featured status)
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Standard field updates
        user.username = req.body.username || user.username;
        user.role = req.body.role || user.role;

        // --- THIS IS THE NEW, SAFER LOGIC FOR THE FEATURED STATUS ---
        if (req.body.isFeatured === true) {
            // If we are setting this user to be featured...
            // First, un-feature ALL other students in the database.
            await User.updateMany({ role: 'Student' }, { $set: { isFeatured: false } });
            // Then, set this user to be featured.
            user.isFeatured = true;
        } else if (req.body.isFeatured === false) {
            // If we are explicitly un-featuring this user
            user.isFeatured = false;
        }
        // If isFeatured is not mentioned in the request body, we don't change it.
        // --- END OF NEW LOGIC ---

        const updatedUser = await user.save();
        
        // Respond with the full user object, including the new status
        const responseUser = {
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role,
            isFeatured: updatedUser.isFeatured
        };

        res.status(200).json(responseUser);

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

        // In a real-world scenario, consider what happens to the user's submissions, etc.
        await user.deleteOne();

        res.status(200).json({ message: 'User removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
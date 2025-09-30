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

        // --- THIS IS THE FIX ---
        // Only update fields if they are provided in the request.
        // This prevents Mongoose from trying to validate fields that aren't being changed.
        const updates: any = {};
        if (req.body.username) updates.username = req.body.username;
        if (req.body.role) updates.role = req.body.role;
        if (req.body.password) updates.password = req.body.password; // The pre-save hook will still hash this
        
        //if (req.body.isFeatured === true) {
        //    // Un-feature all other students first
        //    await User.updateMany({ _id: { $ne: user._id }, role: 'Student' }, { $set: { isFeatured: false } });
        //    updates.isFeatured = true;
        //} else if (req.body.isFeatured === false) {
        //    updates.isFeatured = false;
        //}

        // Instead of user.save(), we use findByIdAndUpdate.
        // This is safer as it only modifies the fields we specify.
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updates }, {
            new: true, // Return the updated document
            runValidators: true, // Run validation on the fields we are changing
            context: 'query' // Important for certain validators
        }).select('-password');
        
        res.status(200).json(updatedUser);

    } catch (error: any) {
        console.error("Error in updateUser:", error);
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
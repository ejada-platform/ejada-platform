// src/controllers/application.controller.ts

import { Request, Response } from 'express';
import crypto from 'crypto';
import { Types } from 'mongoose';

import Application from '../models/Application.model';
import User from '../models/User.model';
import StudentProfile from '../models/StudentProfile.model';

// @desc    Submit a new student application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req: Request, res: Response) => {
    try {
        const application = await Application.create(req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Your application has been submitted successfully! We will review it and contact you soon.' 
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Failed to submit application', error: error.message });
    }
};

// @desc    Get all pending applications
// @route   GET /api/applications
// @access  Private (Admin)
export const getPendingApplications = async (req: Request, res: Response) => {
    try {
        const applications = await Application.find({ status: 'Pending' }).sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error: any) {
        console.error("Error fetching pending applications:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve an application and create a user
// @route   POST /api/applications/:id/approve
// @access  Private (Admin)
export const approveApplication = async (req: Request, res: Response) => {
    // 1. The Admin will now send the username and password in the request body
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        if (application.status === 'Approved') {
            return res.status(400).json({ message: 'This application has already been approved.' });
        }

        // 2. Check if the chosen username is already taken
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'This username is already taken. Please choose another.' });
        }

        // 3. Create the User account with the credentials provided by the Admin
        const user = new User({
            username,
            email: application.email,
            password, // The pre-save hook will hash this
            role: 'Student',
        });
        
        // 4. Create and link the StudentProfile
        const studentProfile = new StudentProfile({
            user: user._id,
            // ... (copy all the fields from the application document)
        });
        user.studentProfile = studentProfile._id as Types.ObjectId;
        
        // 5. Save everything to the database
        await studentProfile.save();
        await user.save();
        application.status = 'Approved';
        await application.save();

        // 6. Respond with a success message
        res.status(200).json({ success: true, message: 'Application approved and user created successfully.' });

    } catch (error: any) {
        console.error("!!! APPROVAL FAILED, REASON:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed. Please ensure all application fields are correct.', details: error.message });
        }
        res.status(500).json({ message: 'An unexpected server error occurred.' });
    }
};
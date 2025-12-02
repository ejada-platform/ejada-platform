import { Request, Response } from 'express';
//import crypto from 'crypto';
import { Types } from 'mongoose';

import Application from '../models/Application.model';
import User from '../models/User.model';
import StudentProfile from '../models/StudentProfile.model';
import StudentProgress from '../models/StudentProgress.model'; // Import StudentProgress
import Section from '../models/Section.model'; // Import Section

// @desc    Submit a new student application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req: Request, res: Response) => {

    console.log("--- Received Application Data ---");
    console.log(req.body);
    console.log("-------------------------------");

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
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const application = await Application.findById(req.params.id);
        if (!application) { return res.status(404).json({ message: 'Application not found' }); }
        if (application.status === 'Approved') { return res.status(400).json({ message: 'This application has already been approved.' });}

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'This username is already taken. Please choose another.' });
        }

        const user = new User({
            username,
            email: application.email,
            password: password,
            role: 'Student',
        });
        
        // --- THIS IS THE FIX ---
        // Instead of a shortcut, we explicitly map every field. This is 100% reliable.
        const studentProfile = new StudentProfile({
            user: user._id,
            fullName: application.fullName,
            gender: application.gender,
            fatherName: application.fatherName,
            motherName: application.motherName,
            dateOfBirth: application.dateOfBirth,
            schoolClass: application.schoolClass,
            countryOfResidence: application.countryOfResidence,
            city: application.city,
            nationality: application.nationality,
            phoneNumber: application.phoneNumber,
            howDidYouHear: application.howDidYouHear,
            agreedToFees: application.agreedToFees,
            program: application.program,
            // You can determine this based on country or other logic in the future
            priceCategory: 'Standard', 
        });
        // --- END OF FIX ---

        user.studentProfile = studentProfile._id as Types.ObjectId;
        
         // 1. Find the very first section of the student's chosen program
         const firstSection = await Section.findOne({ program: application.program, order: 1 });
         if (!firstSection) {
             return res.status(400).json({ message: `Cannot approve: The '${application.program}' program has no sections. Please build the curriculum first.` });
         }

        await StudentProgress.create({
            student: user._id,
            program: application.program,
            currentSection: firstSection._id,
            completedAssessments: []
        });

        await studentProfile.save();
        await user.save();
        
        application.status = 'Approved';
        await application.save();

        // The welcome message is now commented out, as per your request
        // const message = `...`;
        // await sendEmail({ ... });

        res.status(200).json({ success: true, message: 'Application approved and user created successfully.' });

    } catch (error: any) {
        console.error("!!! APPROVAL FAILED, REASON:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed.', details: error.message });
        }
        res.status(500).json({ message: 'An unexpected server error occurred.' });
    }
};
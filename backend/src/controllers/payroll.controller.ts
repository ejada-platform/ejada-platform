// src/controllers/payroll.controller.ts

import { Request, Response } from 'express';
import WorkLog from '../models/WorkLog.model';
import StudentProfile from '../models/StudentProfile.model';
import { IUser } from '../models/User.model'; // Import the User interface

// This object holds the business rules you defined
const WAGE_RULES = {
    'Standard': { percentage: 0.50, hourlyRate: 4.46875 },
    'Discount': { percentage: 0.45, hourlyRate: 4.125 },
    'Non-Arab': { percentage: 0.50, hourlyRate: 4.8125 }
};

// @desc    Calculate payroll for a specific teacher for a given date range
// @route   POST /api/payroll/calculate
// @access  Private (Admin)
export const calculatePayroll = async (req: Request, res: Response) => {
    const { teacherId, startDate, endDate } = req.body;

    try {
        const workLogs = await WorkLog.find({
            teacher: teacherId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate('attendees', 'username'); // Populate the attendees with their usernames

        let totalEarnings = 0;
        const detailedBreakdown = [];

        for (const log of workLogs) {
            let sessionEarnings = 0;
            const attendees = log.attendees as unknown as IUser[]; // Cast attendees to the User type

            if (attendees && attendees.length > 0) {
                // --- THIS IS THE FIX ---
                // 1. Extract just the IDs from the populated attendees array
                const attendeeIds = attendees.map(att => att._id);

                // 2. Use the array of IDs to find all the corresponding student profiles
                const studentProfiles = await StudentProfile.find({ user: { $in: attendeeIds } });
                // --- END OF FIX ---
                
                for (const profile of studentProfiles) {
                    const rule = WAGE_RULES[profile.priceCategory as keyof typeof WAGE_RULES];
                    if (rule) {
                        sessionEarnings += rule.hourlyRate * log.duration;
                    }
                }
            }
            totalEarnings += sessionEarnings;
            detailedBreakdown.push({
                date: log.date,
                circleId: log.circle,
                duration: log.duration,
                attendees: attendees.length,
                sessionEarnings: parseFloat(sessionEarnings.toFixed(2))
            });
        }

        res.status(200).json({
            teacherId,
            period: { start: startDate, end: endDate },
            totalHours: workLogs.reduce((acc, log) => acc + log.duration, 0),
            totalEarnings: parseFloat(totalEarnings.toFixed(2)),
            breakdown: detailedBreakdown
        });

    } catch (error: any) {
        console.error("Payroll Calculation Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
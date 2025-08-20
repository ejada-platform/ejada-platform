import { Request, Response } from 'express';
import User from '../models/User.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import crypto from 'crypto'; // <-- 1. IMPORT CRYPTO
import sendEmail from '../utils/sendEmail';

// Helper function to generate a unique code for students
const generateStudentCode = () => `EJ${Math.floor(1000 + Math.random() * 9000)}`;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Generate a unique code if the user is a student
        let generatedCode;
        if (role === 'Student') {
            generatedCode = generateStudentCode();
        }

        // 3. Create new user in the database
        const user = await User.create({
            username,
            email,
            password,
            role,
            generatedCode
        });

        // 4. If user created successfully, generate a token
        if (user) {
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '30d' }
            );

            // 5. Respond with user info and token
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                generatedCode: user.generatedCode,
                token: token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// We will add the loginUser function here in the next step

export const loginUser = async (req: Request, res: Response) => {
    try {
        // 1. Get the username and password from the request body
        const { username, password } = req.body;

        // 2. Find the user in the database by their username.
        // We MUST use .select('+password') here because, by default, we hid the password field in our User model for security.
        // This explicitly tells the database: "For this login check only, please give me the user's hashed password."
        const user = await User.findOne({ username }).select('+password');

        // 3. Check if the user exists AND if the passwords match.
        // bcrypt.compare safely checks the plain text password from the user against the hashed password from the database.
        if (user && (await bcrypt.compare(password, user.password!))) {
            // 4. If they match, generate a new token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '30d' }
            );

            // 5. Respond with the user's details and the new token.
            res.status(200).json({
                _id: user._id,
                username: user.username,
                role: user.role,
                generatedCode: user.generatedCode,
                token: token
            });
        } else {
            // 6. If the user doesn't exist or the password is wrong, send a '401 Unauthorized' error.
            // For security, we give a generic message. We don't want to tell an attacker whether the username or password was wrong.
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
    // Note: We need to update our User schema to allow searching by email
    const { email } = req.body; // Assuming users register with an email
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found with that email" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to user document
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

        await user.save();

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        // Clear token fields on error
        // const user = await User.findOne({ email });
        // user.resetPasswordToken = undefined;
        // user.resetPasswordExpire = undefined;
        // await user.save();
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
    // 1. Get the hashed token from the URL
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    try {
        // 2. Find the user by this hashed token and check if it has not expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }, // $gt means "greater than"
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // 3. If the token is valid, set the new password
        user.password = req.body.password;
        // Clear the reset token fields so it cannot be used again
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // The pre-save hook in User.model.ts will automatically hash the new password
        await user.save();

        // 4. (Optional but recommended) Automatically log the user in by sending back a new JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

        res.status(200).json({
            message: 'Password reset successful',
            token: token,
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
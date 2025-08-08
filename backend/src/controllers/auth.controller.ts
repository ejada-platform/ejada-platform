import { Request, Response } from 'express';
import User from '../models/User.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

// Helper function to generate a unique code for students
const generateStudentCode = () => `EJ${Math.floor(1000 + Math.random() * 9000)}`;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ username });
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
// src/index.ts

import express, { Request, Response, NextFunction } from 'express'; // <-- Add Request, Response, NextFunction
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';

dotenv.config();
connectDB();
const app = express();

// =========================================================
// OUR NEW LOGGER MIDDLEWARE - The Ultimate Test
// This will run on EVERY request and show us what's happening.
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('--- NEW REQUEST ---');
    console.log('METHOD:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('HEADERS:', req.headers);
    console.log('BODY (before parsing):', req.body); // At this point, body should be empty
    next(); // Move on to the next middleware
});
// =========================================================

// Now, the JSON parser runs
app.use(express.json());

// Then our routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// src/index.ts (in your backend project)

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import cors from 'cors'; // <-- 1. IMPORT CORS

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();


// MIDDLEWARE
// =========================================================
// 2. USE CORS HERE. This will allow requests from your frontend.
// This MUST come before your routes.
app.use(cors());

// Tell Express how to parse incoming JSON bodies
app.use(express.json());
// =========================================================


// ROUTES
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
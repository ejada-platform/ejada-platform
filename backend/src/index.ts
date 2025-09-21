import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db';

// --- IMPORT ALL ROUTE FILES ---
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import circleRoutes from './routes/circle.routes';
import curriculumRoutes from './routes/curriculum.routes';
import assignmentRoutes from './routes/assignment.routes';
import submissionRoutes from './routes/submission.routes';
import evaluationRoutes from './routes/evaluation.routes';
import notificationRoutes from './routes/notification.routes'; // The missing one
import statsRoutes from './routes/stats.routes';
import lessonLogRoutes from './routes/lessonLog.routes';
import calendarRoutes from './routes/calendar.routes';
import parentRoutes from './routes/parent.routes';
import resourceRoutes from './routes/resource.routes';
import attendanceRoutes from './routes/attendance.routes';
import badgeRoutes from './routes/badge.routes';    
import workLogRoutes from './routes/workLog.routes';
import payrollRoutes from './routes/payroll.routes'; 
//import certificatteRoutes from './routes/certificate.routes';
 // The missing import

// --- SETUP ---
dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }});

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- API ROUTES (DEFINITIVE FINAL ORDER) ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/lessonlogs', lessonLogRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/attendance', attendanceRoutes);
import applicationRoutes from './routes/application.routes'; 
import certificateRoutes from './routes/certificate.routes';
import checkoutRoutes from './routes/checkout.routes';

// --- THIS IS THE MISSING LINE ---
app.use('/api/applications', applicationRoutes)
app.use('/api/notifications', notificationRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/worklogs', workLogRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/checkout', checkoutRoutes);

// --- SOCKET.IO CONNECTION LOGIC ---
io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);
    socket.on('join', (userId) => {
        console.log(`User ${userId} joined their notification room.`);
        socket.join(userId);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io };
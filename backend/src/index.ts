import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import curriculumRoutes from './routes/curriculum.routes';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import circleRoutes from './routes/circle.routes';
import assignmentRoutes from './routes/assignment.routes';
import submissionRoutes from './routes/submission.routes'; 
import evaluationRoutes from './routes/evaluation.routes';
import userRoutes from './routes/user.routes';
import statsRoutes from './routes/stats.routes';
import resourceRoutes from './routes/resource.routes';
import badgeRoutes from './routes/badge.routes';
import awardRoutes from './routes/award.routes';
import workLogRoutes from './routes/workLog.routes';
import attendanceRoutes from './routes/attendance.routes';
import lessonLogRoutes from './routes/lessonLog.routes';
import parentRoutes from './routes/parent.routes';
import notificationRoutes from './routes/notification.routes';
import calendarRoutes from './routes/calendar.routes'; 

dotenv.config();
// Connect to Database
connectDB();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow connections from your frontend
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.use(express.json());
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/parent', parentRoutes); 
app.use('/api/lessonlogs', lessonLogRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/worklogs', workLogRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
// ... (server listen code remains the same)
io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);

    // When a user logs in, the frontend will send their user ID
    // We will have them join a "room" named after their own ID.
    // This allows us to send notifications to a specific user.
    socket.on('join', (userId) => {
        console.log(`User ${userId} joined their notification room.`);
        socket.join(userId);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io };
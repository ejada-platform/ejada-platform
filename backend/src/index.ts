import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import curriculumRoutes from './routes/curriculum.routes';
import cors from 'cors';
import circleRoutes from './routes/circle.routes';
import assignmentRoutes from './routes/assignment.routes';
import submissionRoutes from './routes/submission.routes'; 
import evaluationRoutes from './routes/evaluation.routes';
import userRoutes from './routes/user.routes';



// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();


app.use(cors());

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
// ... (server listen code remains the same)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
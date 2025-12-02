import express from 'express';
import { getSectionsByProgramName } from '../controllers/section.controller'; 
import { protect } from '../middleware/auth.middleware'; 

const router = express.Router();

router.get('/program/:programName', protect, getSectionsByProgramName); 


export default router;

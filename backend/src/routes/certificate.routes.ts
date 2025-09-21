import express from 'express';

// --- THIS IS THE CORRECTED IMPORT ---
// We import all the functions we need by name, inside curly braces {}
import { 
    awardCertificate, 
    getCertificatesForStudent,
    uploadTemplate,
    getTemplates,
    deleteTemplate
} from '../controllers/certificate.controller';
// ------------------------------------

import { protect, authorize } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

// Route for awarding a certificate to a student
router.route('/')
    .post(protect, authorize('Teacher', 'Admin'), awardCertificate);

// Route for getting a specific student's certificates
router.route('/student/:studentId')
    .get(protect, getCertificatesForStudent);

// --- THIS IS THE CLEANER ROUTE DEFINITION ---
// All routes related to '/templates' are now chained together.
router.route('/templates')
    .get(protect, authorize('Admin'), getTemplates)
    .post(protect, authorize('Admin'), upload.single('templateFile'), uploadTemplate)
    .delete(protect, authorize('Admin'), deleteTemplate);
// -----------------------------------------

export default router;
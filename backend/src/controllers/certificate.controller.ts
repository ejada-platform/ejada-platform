// src/controllers/certificate.controller.ts

import { Request, Response } from 'express';
import Certificate from '../models/Certificate.model';
import CertificateTemplate from '../models/CertificateTemplate.model';
import User from '../models/User.model';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import cloudinary from '../config/cloudinary';
import axios from 'axios'; // Import axios

// ... (getCertificatesForStudent and getTemplates are correct)

// ==================================================================
// === THIS IS THE CORRECTED awardCertificate FUNCTION ===


// @desc    Get all certificates for a specific student
// @route   GET /api/certificates/student/:studentId
// @access  Private (Authenticated Users)
export const getCertificatesForStudent = async (req: Request, res: Response) => {
    try {
        const certificates = await Certificate.find({ student: req.params.studentId })
            .populate('awardedBy', 'username');
        res.status(200).json(certificates);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// ==================================================================
// === THIS IS THE CORRECTED uploadTemplate FUNCTION ===
// ==================================================================
export const uploadTemplate = async (req: Request, res: Response) => {
    const { program } = req.body;
    if (!req.file) { return res.status(400).json({ message: 'Please upload a file' }); }
    
    try {
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { upload_preset: "ejada_public", folder: "certificate_templates" },
                (error, result) => { if (result) resolve(result); else reject(error); }
            );
            uploadStream.end(req.file!.buffer);
        });

        const template = await CertificateTemplate.findOneAndUpdate(
            { program },
            { templateUrl: result.secure_url },
            { new: true, upsert: true }
        );
        res.status(201).json(template);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to upload template', error: error.message });
    }
};



export const getTemplates = async (req: Request, res: Response) => {
    try {
        const templates = await CertificateTemplate.find({});
        res.status(200).json(templates);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- We need a new function to DELETE templates ---
export const deleteTemplate = async (req: Request, res: Response) => {
    try {
        const { program } = req.body;
        const template = await CertificateTemplate.findOneAndDelete({ program });
        if (!template) {
            return res.status(404).json({ message: 'Template for this program not found.' });
        }
        // We should also delete the file from Cloudinary here in a real app
        res.status(200).json({ message: 'Template deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ==================================================================
export const awardCertificate = async (req: Request, res: Response) => {
    const user = req.user!;
    const { studentId, program } = req.body;

    try {
        const student = await User.findById(studentId);
        const template = await CertificateTemplate.findOne({ program });
        if (!student || !template) {
            return res.status(404).json({ message: 'Student or certificate template not found for this program.' });
        }

        // Fetch the PDF template from Cloudinary as a binary data buffer
        const response = await axios.get(template.templateUrl, { 
            responseType: 'arraybuffer' 
        });
        const existingPdfBytes = response.data;

        // Load the PDF from the buffer
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const firstPage = pdfDoc.getPages()[0];

        // Write the student's name and date on the PDF
        firstPage.drawText(student.username, { 
            x: 200, // Adjust these coordinates based on your template design
            y: 300, 
            font, 
            size: 30, 
            color: rgb(0.18, 0.33, 0.4) 
        });
        firstPage.drawText(new Date().toLocaleDateString(), { 
            x: 250, 
            y: 200, 
            font, 
            size: 18 
        });

        // Save the modified PDF into a new buffer
        const pdfBytes = await pdfDoc.save();

        // Upload the new, personalized PDF to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    upload_preset: "ejada_public", 
                    resource_type: "auto", 
                    folder: "generated_certificates" 
                },
                (error, result) => { 
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            uploadStream.end(Buffer.from(pdfBytes));
        });

        if (!result || !result.secure_url) {
            throw new Error('Failed to upload generated certificate to Cloudinary.');
        }

        // Create the final certificate record in our database
        const certificate = await Certificate.create({
            student: studentId,
            program,
            awardedBy: user._id,
            certificateUrl: result.secure_url,
        });
        res.status(201).json(certificate);

    } catch (error: any) {
        console.error("AWARD CERTIFICATE FAILED:", error);
        res.status(400).json({ message: 'Failed to award certificate. Please ensure the template is a valid PDF.', error: error.message });
    }
};
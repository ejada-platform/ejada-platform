import { Request, Response } from 'express';
import Resource from '../models/Resource.model';
import cloudinary from '../config/cloudinary';
// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getResources = async (req: Request, res: Response) => {
    try {
        const resources = await Resource.find({}).sort({ createdAt: -1 });
        res.status(200).json(resources);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private (Admin)
export const createResource = async (req: Request, res: Response) => {
    const admin = req.user!;
    const { title, description, category, price } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }
    const fileToUpload = req.file;

    try {
        // --- THIS IS THE NEW, SAFER UPLOAD LOGIC ---
        const result = await new Promise<{ secure_url?: string; error?: any }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    upload_preset: "ejada_public",
                    resource_type: "auto",
                },
                // This is the standard callback format for this library
                (error, result) => {
                    if (error) {
                        // If Cloudinary itself sends an error (like file size), reject the promise
                        return reject(error);
                    }
                    // If successful, resolve with the result
                    resolve(result as any);
                }
            );
            uploadStream.end(fileToUpload.buffer);
        });
        
        // After the promise, we check again to be absolutely sure we have a URL
        if (!result || !result.secure_url) {
            throw new Error('Cloudinary upload did not return a secure URL.');
        }
        // --- END OF NEW LOGIC ---

        const resource = await Resource.create({
            title,
            description,
            category,
            resourceUrl: result.secure_url,
            price: parseFloat(price) || 0,
            createdBy: admin._id,
        });

        res.status(201).json(resource);

    } catch (error: any) {
        console.error("!!! UPLOAD FAILED, REASON:", error);
        // Now, we can catch the specific error from Cloudinary
        if (error && error.message && error.message.includes('File size too large')) {
            return res.status(400).json({ message: 'File size is too large for the free plan.' });
        }
        res.status(400).json({ message: 'Failed to create resource. Please try again.' });
    }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
export const deleteResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        await resource.deleteOne();
        res.status(200).json({ message: 'Resource removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
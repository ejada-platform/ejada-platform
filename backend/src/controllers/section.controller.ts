import { Request, Response } from 'express';
import Section from '../models/Section.model'; 


export const getSectionsByProgramName = async (req: Request, res: Response) => {
    try {
        
        const { programName } = req.params; 
        
        
        const sections = await Section.find({ program: programName })
            .sort({ order: 1 }); // Sort by order for the dropdown

        if (!sections || sections.length === 0) {
            // It's not a server error, but a "No content" success
            return res.status(200).json([]); 
        }

        res.status(200).json(sections);
    } catch (error: any) {
        console.error("Error fetching sections by program name:", error);
        res.status(500).json({ message: 'Failed to retrieve sections', error: error.message });
    }
};
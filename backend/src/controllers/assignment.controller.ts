import { Request, Response } from 'express';
import Assignment from '../models/Assignment.model';
import Circle from '../models/Circle.model';

// @desc    Create a new assignment for a circle or specific students
// @route   POST /api/assignments
// @access  Private (Teacher, Admin)
export const createAssignment = async (req: Request, res: Response) => {
    const teacher = req.user!;
    // The frontend will now send 'studentIds', an array of student IDs
    const { title, description, dueDate, circleId, studentIds, sectionId } = req.body;

    if (!studentIds || studentIds.length === 0) {
        return res.status(400).json({ message: 'Please select at least one student.' });
    }
    
    try {
        const circle = await Circle.findById(circleId);
        if (!circle) { return res.status(404).json({ message: 'Circle not found' }); }
        if (circle.teacher.toString() !== teacher._id.toString()) {
            return res.status(403).json({ message: 'User is not the teacher of this circle' });
        }

        const programId = circle.program; 
    if (!programId || !sectionId) {
        return res.status(400).json({ message: 'Missing required Program or Section ID.' });
   }

        const assignment = await Assignment.create({
            title,
            description,
            dueDate,
            circle: circleId,
            program: programId, 
            section: sectionId,
            assignedTo: studentIds, // Save the array of selected students
            createdBy: teacher._id,
        });
        res.status(201).json(assignment);
    } //catch (error: any) {
        //res.status(400).json({ message: 'Failed to create assignment', error: error.message });
    //}
//};
catch (error: any) {
    //console.error("ASSIGNMENT CREATION ERROR LOG:", error); // <-- The CRITICAL LOG
    //console.error("!!! UNHANDLED 500 ERROR IN ASSIGNMENT:", error);

    // Check if it's a Mongoose Validation Error
    //if (error.name === 'ValidationError') {
    //    // Return a 400 with the specific validation message
    //    return res.status(400).json({ 
    //        message: 'Assignment validation failed.', 
    //        details: error.message 
    //    });
    //}
    // Generic catch-all for other 500 errors
   // res.status(500).json({ message: 'An unexpected server error occurred.' });

   console.error("!!! UNHANDLED 500 ERROR IN ASSIGNMENT:", error); // <-- The TRUE ERROR LOG
        if (error.name === 'ValidationError') {
            // ...
        }
        res.status(500).json({ message: 'An unexpected server error occurred.', debug: error.message });

    
}
};

// @desc    Get all assignments relevant to the logged-in user in a circle
// @route   GET /api/assignments/circle/:circleId
// @access  Private (Members of the circle)
export const getAssignmentsForCircle = async (req: Request, res: Response) => {
    const user = req.user!;
    const { circleId } = req.params;
    
    try {
        const circle = await Circle.findById(circleId);
        if (!circle) { return res.status(404).json({ message: 'Circle not found' }); }

        let assignments;
        if (user.role === 'Student') {
            // A student sees only assignments that are specifically assigned to them
            assignments = await Assignment.find({ 
                circle: circleId,
                assignedTo: user._id // The key condition
            }).populate('createdBy', 'username').sort({ createdAt: -1 });
        } else {
            // A teacher or admin sees ALL assignments for the circle
            assignments = await Assignment.find({ circle: circleId })
                .populate('createdBy', 'username')
                .populate('assignedTo', 'username') // Also show who it was assigned to
                .sort({ createdAt: -1 });
        }
        res.status(200).json(assignments);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
import { Request, Response } from 'express';
import CalendarEvent from '../models/CalendarEvent.model';


export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await CalendarEvent.find({});
        res.status(200).json(events);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const createEvent = async (req: Request, res: Response) => {
    const { title, start, end, type, description } = req.body;

    try {
        const event = await CalendarEvent.create({
            title,
            start,
            end,
            type,
            description,
        });
        res.status(201).json(event);
    } catch (error: any) {
        res.status(400).json({ message: 'Failed to create event', error: error.message });
    }
};


export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const event = await CalendarEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.deleteOne();
        res.status(200).json({ message: 'Event removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
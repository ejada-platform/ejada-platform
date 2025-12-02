import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../context/AuthContext';

// --- Type Definition ---
interface CalendarEvent {
    _id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'Holiday' | 'Exam' | 'Reminder' | 'Other';
    description?: string;
}

// Setup for the calendar localizer
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});


const CreateEventForm = ({ onEventCreated }: { onEventCreated: () => void }) => {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [type, setType] = useState<'Holiday' | 'Exam' | 'Reminder' | 'Other'>('Reminder');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Ensure end date is not before start date
            if (new Date(end) < new Date(start)) {
                setMessage('End date cannot be before the start date.');
                setIsLoading(false);
                return;
            }
            const payload = { title, start, end, type };
            await axios.post('http://localhost:5000/api/calendar', payload, config);
            
            alert('Event created successfully!');
            setTitle(''); 
            setStart(''); 
            setEnd('');
            setType('Reminder');
            onEventCreated(); // Refresh the calendar
        } catch (error) {
            setMessage('Failed to create event.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Add New Calendar Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Mid-term Exams" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                        <input type="date" value={start} onChange={e => setStart(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                        <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option>Reminder</option>
                        <option>Holiday</option>
                        <option>Exam</option>
                        <option>Other</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                    {isLoading ? 'Adding Event...' : 'Add Event'}
                </button>
                {message && <p className="mt-2 text-center text-red-500">{message}</p>}
            </form>
        </div>
    );
};

// --- Main Calendar Page Component ---
const AcademicCalendarPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    
    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await axios.get<any[]>('http://localhost:5000/api/calendar');
            const formattedEvents = data.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Failed to fetch calendar events", error);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);
    
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Academic Calendar</h1>

            {user?.role === 'Admin' && <CreateEventForm onEventCreated={fetchEvents} />}

            {/* --- FIX #2: Improved container with flexbox for better height management --- */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col" style={{ height: '70vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }} 
                    className="dark-calendar" 
                />
            </div>
        </div>
    );
};

export default AcademicCalendarPage;
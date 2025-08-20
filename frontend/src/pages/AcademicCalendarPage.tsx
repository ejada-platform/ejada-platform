
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the calendar styles
import { useAuth } from '../context/AuthContext'; // We'll need this for the Admin form

// --- Type Definition ---
interface CalendarEvent {
    _id: string;
    title: string;
    start: Date; // react-big-calendar needs Date objects
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

// --- Admin Form for creating events ---
const CreateEventForm = ({ onEventCreated }: { onEventCreated: () => void }) => {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [type, setType] = useState<'Holiday' | 'Exam' | 'Reminder' | 'Other'>('Reminder');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { title, start, end, type };
            await axios.post('http://localhost:5000/api/calendar', payload, config);
            
            alert('Event created successfully!');
            setTitle(''); setStart(''); setEnd('');
            onEventCreated(); // Refresh the calendar
        } catch (error) {
            setMessage('Failed to create event.');
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-4">Add New Calendar Event</h2>
            <form onSubmit={handleSubmit}>
                {/* Simplified form for brevity */}
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="w-full p-2 border rounded mb-2" required />
                <div className="flex gap-4 mb-2">
                    <input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-1/2 p-2 border rounded" required title="Start Date" />
                    <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="w-1/2 p-2 border rounded" required title="End Date" />
                </div>
                <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-2 border rounded mb-2">
                    <option>Reminder</option>
                    <option>Holiday</option>
                    <option>Exam</option>
                    <option>Other</option>
                </select>
                <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Add Event</button>
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
            // Convert date strings from the database into Date objects
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
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Academic Calendar</h1>

            {/* Only show the creation form to Admins */}
            {user?.role === 'Admin' && <CreateEventForm onEventCreated={fetchEvents} />}

            <div className="bg-white p-4 rounded-lg shadow" style={{ height: '70vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }}
                />
            </div>
        </div>
    );
};

export default AcademicCalendarPage;
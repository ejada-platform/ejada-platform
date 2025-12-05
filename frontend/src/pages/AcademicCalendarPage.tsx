import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // ADDED useTranslation
// NOTE: You must install and import the Arabic locale for full RTL calendar support
import { ar } from 'date-fns/locale/ar'; 



const locales = { 'en-US': enUS , 'ar': ar }; 
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});


// --- Localized Event Types ---
const eventTypes: ('Reminder' | 'Holiday' | 'Exam' | 'Other')[] = ['Reminder', 'Holiday', 'Exam', 'Other'];

// --- Type Definition for Calendar Event ---
interface CalendarEvent {
 _id: string;
 title: string;
 start: Date;
 end: Date;
 type: 'Reminder' | 'Holiday' | 'Exam' | 'Other';
}

// --- Sub-Component: The Event Form ---
const CreateEventForm = ({ onEventCreated }: { onEventCreated: () => void }) => {
    const { t, i18n } = useTranslation(); // ADDED useTranslation
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [type, setType] = useState<'Reminder' | 'Holiday' | 'Exam' | 'Other'>('Reminder');
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
                setMessage(t('academic_calendar_page.error_end_before_start'));
                setIsLoading(false);
                return;
            }
            const payload = { title, start, end, type };
            await axios.post('http://localhost:5000/api/calendar', payload, config);
            
            alert(t('academic_calendar_page.alert_success')); // Use a dedicated alert key
            setTitle(''); 
            setStart(''); 
            setEnd('');
            setType('Reminder');
            onEventCreated(); // Refresh the calendar
        } catch (error) {
            setMessage(t('academic_calendar_page.error_create_failed'));
        } finally {
            setIsLoading(false);
        }
    };
    
    // Helper to translate event types
    const translateEventType = (type: string) => {
        return t(`academic_calendar_page.type_${type.toLowerCase()}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8" dir={i18n.dir()}>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('academic_calendar_page.form_title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('academic_calendar_page.title_label')}</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('academic_calendar_page.title_placeholder')} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('academic_calendar_page.start_date_label')}</label>
                        <input type="date" value={start} onChange={e => setStart(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('academic_calendar_page.end_date_label')}</label>
                        <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('academic_calendar_page.type_label')}</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {eventTypes.map(et => (
                            <option key={et} value={et}>
                                {translateEventType(et)}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                    {isLoading ? t('academic_calendar_page.status_adding') : t('academic_calendar_page.button_add_event')}
                </button>
                {message && <p className="mt-2 text-center text-red-500">{message}</p>}
            </form>
        </div>
    );
};

// --- Main Calendar Page Component ---
const AcademicCalendarPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    
    // NOTE: This ensures the calendar updates if the language changes
    const locale = i18n.language === 'ar' ? 'ar' : 'en-US'; 
    const culture = i18n.language === 'ar' ? 'ar' : 'en-US'; 
    
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
        <div className="p-4 md:p-8 max-w-7xl mx-auto" dir={i18n.dir()}>
            <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">{t('academic_calendar_page.page_title')}</h1>

            {user?.role === 'Admin' && <CreateEventForm onEventCreated={fetchEvents} />}

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col" style={{ height: '70vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }} 
                    className="dark-calendar" 
                    culture={locale}                     
                />
            </div>
        </div>
    );
};

export default AcademicCalendarPage;
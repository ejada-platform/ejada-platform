import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth, type User } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { showSuccessAlert, showErrorAlert } from '../../services/alert.service';

// --- Type Definitions ---
interface SelectOption { value: string; label: string; }
interface BreakdownEntry {
    date: string;
    duration: number;
    attendees: number;
    sessionEarnings: number;
}
interface PayrollReport {
    totalHours: number;
    totalEarnings: number;
    breakdown: BreakdownEntry[];
}

const PayrollPage = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [teachers, setTeachers] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedTeacher, setSelectedTeacher] = useState<SelectOption | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Report State
    const [report, setReport] = useState<PayrollReport | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Fetch all teachers to populate the dropdown
    useEffect(() => {
        const fetchTeachers = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get<User[]>('http://localhost:5000/api/users', config);
                const teacherOptions = data
                    .filter(u => u.role === 'Teacher')
                    .map(t => ({ value: t._id, label: t.username }));
                setTeachers(teacherOptions);
            } catch (error) {
                console.error("Failed to fetch teachers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, [token]);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacher || !startDate || !endDate) {
            showErrorAlert('Missing Information', 'Please select a teacher and a full date range.');
            return;
        }
        setIsCalculating(true);
        setReport(null); // Clear previous report
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                teacherId: selectedTeacher.value,
                startDate,
                endDate,
            };
            const { data } = await axios.post<PayrollReport>('http://localhost:5000/api/payroll/calculate', payload, config);
            setReport(data);
        } catch (err: any) {
            showErrorAlert('Error!', err.response?.data?.message || 'Failed to calculate payroll.');
        } finally {
            setIsCalculating(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading teacher data...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Teacher Payroll Calculator</h1>
            
            {/* --- Controls Section --- */}
            <form onSubmit={handleCalculate} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="block font-bold mb-1">Select Teacher</label>
                    <Select options={teachers} value={selectedTeacher} onChange={setSelectedTeacher} required />
                </div>
                <div>
                    <label className="block font-bold mb-1">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block font-bold mb-1">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <button type="submit" disabled={isCalculating} className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:opacity-90 disabled:bg-gray-300">
                        {isCalculating ? 'Calculating...' : 'Generate Report'}
                    </button>
                </div>
            </form>

            {/* --- Report Display Section --- */}
            {report && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Payroll Report for {selectedTeacher?.label}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-bold text-gray-500">Total Hours Worked</h3>
                            <p className="text-3xl font-bold text-blue-600">{report.totalHours}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-bold text-gray-500">Total Earnings</h3>
                            <p className="text-3xl font-bold text-green-600">${report.totalEarnings}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2">Detailed Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b">
                                <tr>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Duration (Hrs)</th>
                                    <th className="py-2">Attendees</th>
                                    <th className="py-2">Session Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.breakdown.map((entry, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                                        <td className="py-2">{entry.duration}</td>
                                        <td className="py-2">{entry.attendees}</td>
                                        <td className="py-2">${entry.sessionEarnings}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollPage;
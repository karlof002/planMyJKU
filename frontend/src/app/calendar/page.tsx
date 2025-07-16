"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "../components/Navigation";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isVerified: boolean;
}

interface Activity {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    type: 'exam' | 'assignment' | 'lecture' | 'meeting' | 'personal';
    courseId?: string;
    courseName?: string;
}

export default function CalendarPage() {
    const [user, setUser] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'personal' as Activity['type'],
        courseId: ''
    });
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchActivities();
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    const fetchActivities = async () => {
        try {
            // For now, we'll use localStorage to store activities
            const storedActivities = localStorage.getItem('activities');
            if (storedActivities) {
                setActivities(JSON.parse(storedActivities));
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveActivity = () => {
        if (!formData.title || !formData.date || !formData.time) {
            alert('Please fill in all required fields');
            return;
        }

        const newActivity: Activity = {
            id: Date.now().toString(),
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            type: formData.type,
            courseId: formData.courseId || undefined,
        };

        const updatedActivities = [...activities, newActivity];
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));

        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            type: 'personal',
            courseId: ''
        });
        setIsModalOpen(false);
    };

    const deleteActivity = (id: string) => {
        const updatedActivities = activities.filter(activity => activity.id !== id);
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const getActivitiesForDate = (date: string) => {
        return activities.filter(activity => activity.date === date);
    };

    const getActivityColor = (type: Activity['type']) => {
        switch (type) {
            case 'exam':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'assignment':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'lecture':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'meeting':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'personal':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
    };

    const today = new Date();
    const monthDays = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-foreground">Loading calendar...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Calendar</h1>
                    <p className="text-foreground/60">Manage your academic schedule and activities</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Calendar */}
                    <div className="lg:col-span-3">
                        <div className="bg-card border border-border rounded-lg p-6">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => navigateMonth('prev')}
                                        className="p-2 rounded-md hover:bg-secondary transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setCurrentDate(new Date())}
                                        className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => navigateMonth('next')}
                                        className="p-2 rounded-md hover:bg-secondary transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-4">
                                {weekDays.map(day => (
                                    <div key={day} className="p-2 text-center text-sm font-medium text-foreground/60">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {monthDays.map((day, index) => {
                                    if (day === null) {
                                        return <div key={index} className="aspect-square p-2"></div>;
                                    }

                                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const dayActivities = getActivitiesForDate(dateStr);
                                    const isToday = today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

                                    return (
                                        <div
                                            key={day}
                                            className={`aspect-square p-2 border border-border rounded-md cursor-pointer hover:bg-secondary transition-colors ${isToday ? 'bg-primary text-primary-foreground' : ''
                                                }`}
                                            onClick={() => {
                                                setSelectedDate(dateStr);
                                                setFormData(prev => ({ ...prev, date: dateStr }));
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <div className="text-sm font-medium mb-1">{day}</div>
                                            <div className="space-y-1">
                                                {dayActivities.slice(0, 2).map(activity => (
                                                    <div
                                                        key={activity.id}
                                                        className={`text-xs px-1 py-0.5 rounded truncate ${getActivityColor(activity.type)}`}
                                                    >
                                                        {activity.title}
                                                    </div>
                                                ))}
                                                {dayActivities.length > 2 && (
                                                    <div className="text-xs text-foreground/60">
                                                        +{dayActivities.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Add Activity Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-md font-medium transition-colors"
                        >
                            Add Activity
                        </button>

                        {/* Upcoming Activities */}
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Upcoming Activities</h3>
                            <div className="space-y-3">
                                {activities
                                    .filter(activity => new Date(activity.date) >= today)
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    .slice(0, 5)
                                    .map(activity => (
                                        <div key={activity.id} className="border-l-4 border-primary pl-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{activity.title}</h4>
                                                    <p className="text-xs text-foreground/60">
                                                        {new Date(activity.date).toLocaleDateString()} at {activity.time}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => deleteActivity(activity.id)}
                                                    className="text-destructive hover:text-destructive/80 ml-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                {activities.length === 0 && (
                                    <p className="text-foreground/60 text-sm">No upcoming activities</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-card rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">Add Activity</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                                        placeholder="Activity title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                                        rows={3}
                                        placeholder="Activity description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Date *</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Time *</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Activity['type'] }))}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                                    >
                                        <option value="personal">Personal</option>
                                        <option value="exam">Exam</option>
                                        <option value="assignment">Assignment</option>
                                        <option value="lecture">Lecture</option>
                                        <option value="meeting">Meeting</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveActivity}
                                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                                >
                                    Save Activity
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

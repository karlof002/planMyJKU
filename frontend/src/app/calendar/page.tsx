'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../components/Navigation';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { ActivityModal } from './components/ActivityModal';
import TemplateModal from './components/TemplateModal';
import { ActivityTypeLegend } from './components/ActivityTypeLegend';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isVerified: boolean;
}

interface Template {
    id: string;
    name: string;
    title: string;
    description: string;
    type: 'exam' | 'assignment' | 'lecture' | 'meeting' | 'personal';
    color: string;
}

interface Activity {
    id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    type: 'exam' | 'assignment' | 'lecture' | 'meeting' | 'personal';
    courseId?: string;
    courseName?: string;
    color: string;
}

interface ActivityType {
    id: string;
    name: string;
    color: string;
}

export default function CalendarPage() {
    const [user, setUser] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [view, setView] = useState<'month' | 'week'>('month');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    useEffect(() => {
        if (user) {
            fetchActivities();
            fetchTemplates();
            fetchActivityTypes();
        }
    }, [user]);

    const fetchActivities = async () => {
        try {
            if (!user) return;

            const response = await fetch(`/api/activities?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                const formattedActivities = data.map((activity: any) => ({
                    id: activity.id,
                    title: activity.title,
                    description: activity.description || '',
                    date: activity.startTime.split('T')[0],
                    startTime: activity.startTime.split('T')[1]?.substring(0, 5) || '09:00',
                    endTime: activity.endTime.split('T')[1]?.substring(0, 5) || '10:00',
                    type: activity.type,
                    color: activity.color || '#3b82f6'
                }));
                setActivities(formattedActivities);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            if (!user) return;

            const response = await fetch(`/api/templates?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setTemplates(data);
            } else {
                // Create default templates if none exist
                const defaultTemplates = [
                    {
                        name: 'Morning Lecture',
                        title: 'Lecture',
                        description: 'Regular morning lecture',
                        type: 'lecture',
                        color: '#3b82f6'
                    },
                    {
                        name: 'Study Session',
                        title: 'Study Time',
                        description: 'Focused study session',
                        type: 'personal',
                        color: '#8b5cf6'
                    },
                    {
                        name: 'Assignment Due',
                        title: 'Assignment',
                        description: 'Assignment deadline',
                        type: 'assignment',
                        color: '#f59e0b'
                    }
                ];

                // Save default templates to database
                for (const template of defaultTemplates) {
                    await fetch('/api/templates', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ...template, userId: user.id }),
                    });
                }

                // Fetch again to get the created templates
                const newResponse = await fetch(`/api/templates?userId=${user.id}`);
                if (newResponse.ok) {
                    const newData = await newResponse.json();
                    setTemplates(newData);
                }
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const fetchActivityTypes = async () => {
        try {
            if (!user) return;

            const response = await fetch(`/api/activity-types?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setActivityTypes(data);
            } else {
                // Create default activity types if none exist
                const defaultTypes = [
                    { name: 'Exam', color: '#ef4444' },
                    { name: 'Assignment', color: '#f59e0b' },
                    { name: 'Lecture', color: '#3b82f6' },
                    { name: 'Meeting', color: '#10b981' },
                    { name: 'Personal', color: '#8b5cf6' }
                ];

                for (const type of defaultTypes) {
                    await fetch('/api/activity-types', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ...type, userId: user.id }),
                    });
                }

                // Fetch again to get the created types
                const newResponse = await fetch(`/api/activity-types?userId=${user.id}`);
                if (newResponse.ok) {
                    const newData = await newResponse.json();
                    setActivityTypes(newData);
                }
            }
        } catch (error) {
            console.error('Error fetching activity types:', error);
        }
    };

    const saveActivity = async (activityData: Omit<Activity, 'id'>) => {
        try {
            if (!user) return;

            const startDateTime = new Date(`${activityData.date}T${activityData.startTime}`);
            const endDateTime = new Date(`${activityData.date}T${activityData.endTime}`);

            const payload = {
                userId: user.id,
                title: activityData.title,
                description: activityData.description || '',
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                type: activityData.type,
                color: activityData.color || '#3b82f6'
            };

            let response;
            if (editingActivity) {
                response = await fetch(`/api/activities?id=${editingActivity.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                response = await fetch('/api/activities', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            }

            if (response.ok) {
                await fetchActivities();
                setEditingActivity(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };

    const saveTemplate = async (templateData: Omit<Template, 'id'>) => {
        try {
            if (!user) return;

            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...templateData, userId: user.id }),
            });

            if (response.ok) {
                await fetchTemplates();
                setIsTemplateModalOpen(false);
            }
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    const useTemplate = async (template: Template) => {
        if (!selectedDate) {
            alert('Please select a date first');
            return;
        }

        try {
            if (!user) return;

            // Use default time range (9:00 AM - 10:00 AM) for templates
            const startDateTime = new Date(`${selectedDate}T09:00`);
            const endDateTime = new Date(`${selectedDate}T10:00`);

            const payload = {
                userId: user.id,
                title: template.title,
                description: template.description || '',
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                type: template.type,
                color: template.color || '#3b82f6'
            };

            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchActivities();
                setIsTemplateModalOpen(false);
            }
        } catch (error) {
            console.error('Error using template:', error);
        }
    };

    const deleteActivity = async (id: string) => {
        try {
            const response = await fetch(`/api/activities?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchActivities();
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    const deleteTemplate = async (id: string) => {
        try {
            const response = await fetch(`/api/templates?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchTemplates();
            }
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const handleDayClick = (dateString: string) => {
        setSelectedDate(dateString);
    };

    const handleActivityClick = (activity: Activity) => {
        setEditingActivity(activity);
        setIsModalOpen(true);
    };

    const handleAddActivity = () => {
        setEditingActivity(null);
        setIsModalOpen(true);
    };

    const handleAddActivityByType = (type: any) => {
        setEditingActivity(null);
        setSelectedDate(selectedDate || new Date().toISOString().split('T')[0]);
        setIsModalOpen(true);
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setShowDateModal(true);
    };

    const handleShowActivityModal = () => {
        setIsModalOpen(true);
        setShowDateModal(false);
    };

    const handleShowTemplateModal = () => {
        setIsTemplateModalOpen(true);
        setShowDateModal(false);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() + 7);
        }
        setCurrentDate(newDate);
    };

    const getActivityTypes = () => {
        const typeMap = new Map();

        activities.forEach(activity => {
            const type = activity.type;
            if (typeMap.has(type)) {
                typeMap.set(type, typeMap.get(type) + 1);
            } else {
                typeMap.set(type, 1);
            }
        });

        return activityTypes.map(type => ({
            id: type.id,
            label: type.name,
            color: type.color,
            count: typeMap.get(type.name.toLowerCase()) || 0
        }));
    };

    const handleActivityDrop = async (activityId: string, newDate: string) => {
        try {
            const activity = activities.find(a => a.id === activityId);
            if (!activity) return;

            const startDateTime = new Date(`${newDate}T${activity.startTime}`);
            const endDateTime = new Date(`${newDate}T${activity.endTime}`);

            const payload = {
                userId: user?.id,
                title: activity.title,
                description: activity.description || '',
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                type: activity.type,
                color: activity.color || '#3b82f6'
            };

            const response = await fetch(`/api/activities?id=${activityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchActivities();
            }
        } catch (error) {
            console.error('Error moving activity:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading calendar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <CalendarHeader
                    currentDate={currentDate}
                    onNavigate={view === 'month' ? navigateMonth : navigateWeek}
                    onAddActivity={handleAddActivity}
                    onOpenTemplates={() => setIsTemplateModalOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <CalendarGrid
                            currentDate={currentDate}
                            view={view}
                            activities={activities}
                            onDateClick={handleDateClick}
                            onActivityClick={handleActivityClick}
                            selectedDate={selectedDate}
                            onActivityDrop={handleActivityDrop}
                        />
                    </div>

                    <div className="space-y-6">
                        <ActivityTypeLegend
                            activityTypes={getActivityTypes()}
                            selectedDate={selectedDate}
                            onAddActivity={handleAddActivityByType}
                        />
                    </div>
                </div>

                {/* Date Modal */}
                {showDateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowDateModal(false)}>
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div
                                className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Select Date'}
                                        </h2>
                                        <button
                                            onClick={() => setShowDateModal(false)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Show activities for this date */}
                                    {activities.filter(activity => activity.date === selectedDate).length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Activities</h3>
                                            <div className="space-y-2">
                                                {activities.filter(activity => activity.date === selectedDate).map((activity) => (
                                                    <div
                                                        key={activity.id}
                                                        className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:bg-gray-100 dark:hover:bg-muted/50 cursor-pointer transition-colors"
                                                        onClick={() => {
                                                            setEditingActivity(activity);
                                                            setIsModalOpen(true);
                                                            setShowDateModal(false);
                                                        }}
                                                    >
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: activity.color }}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                                {activity.startTime} - {activity.endTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleShowActivityModal}
                                            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Activity
                                        </button>
                                        <button
                                            onClick={handleShowTemplateModal}
                                            className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-card-foreground flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Activity Modal */}
                <ActivityModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingActivity(null);
                    }}
                    activity={editingActivity}
                    onSave={saveActivity}
                    onDelete={deleteActivity}
                    selectedDate={selectedDate}
                />

                {/* Template Modal */}
                <TemplateModal
                    isOpen={isTemplateModalOpen}
                    onClose={() => setIsTemplateModalOpen(false)}
                    templates={templates}
                    onUseTemplate={useTemplate}
                    onSaveTemplate={saveTemplate}
                    onDeleteTemplate={deleteTemplate}
                />
            </div>
        </div>
    );
}

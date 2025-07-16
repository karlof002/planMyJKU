'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../components/Navigation';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { ActivityModal } from './components/ActivityModal';
import { TemplateModal } from './components/TemplateModal';
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
    startTime: string;
    endTime: string;
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
                        startTime: '08:00',
                        endTime: '09:30',
                        color: '#3b82f6'
                    },
                    {
                        name: 'Study Session',
                        title: 'Study Time',
                        description: 'Focused study session',
                        type: 'personal',
                        startTime: '14:00',
                        endTime: '16:00',
                        color: '#8b5cf6'
                    },
                    {
                        name: 'Assignment Due',
                        title: 'Assignment',
                        description: 'Assignment deadline',
                        type: 'assignment',
                        startTime: '23:59',
                        endTime: '23:59',
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

            const startDateTime = new Date(`${selectedDate}T${template.startTime}`);
            const endDateTime = new Date(`${selectedDate}T${template.endTime}`);

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navigation />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
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
                            onDayClick={handleDayClick}
                            onActivityClick={handleActivityClick}
                            selectedDate={selectedDate}
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

                <ActivityModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveActivity}
                    activity={editingActivity}
                    selectedDate={selectedDate}
                    onDelete={deleteActivity}
                />

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

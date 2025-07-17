'use client';

import { useState, useEffect } from 'react';

interface Activity {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: string;
    type: 'exam' | 'assignment' | 'lecture' | 'meeting' | 'personal';
    courseId?: string;
    courseName?: string;
    color: string;
}

interface CalendarGridProps {
    currentDate: Date;
    view: 'month' | 'week';
    activities: Activity[];
    onDateClick: (date: string) => void;
    onActivityClick: (activity: Activity) => void;
    onActivityDrop?: (activityId: string, newDate: string) => void;
    selectedDate?: string;
}

export function CalendarGrid({
    currentDate,
    view,
    activities,
    onDateClick,
    onActivityClick,
    onActivityDrop,
    selectedDate
}: CalendarGridProps) {
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);
    const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);

    useEffect(() => {
        if (view === 'month') {
            generateMonthView();
        } else {
            generateWeekView();
        }
    }, [currentDate, view]);

    const generateMonthView = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(startOfMonth);
        const endDate = new Date(endOfMonth);

        // Go back to the first day of the week
        startDate.setDate(startDate.getDate() - startDate.getDay());

        // Go forward to the last day of the week
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

        const days = [];
        const currentDay = new Date(startDate);

        while (currentDay <= endDate) {
            days.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        setCalendarDays(days);
    };

    const generateWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }

        setCalendarDays(days);
    };

    const getActivitiesForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return activities.filter(activity => activity.date === dateString);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    const isSelectedDate = (date: Date) => {
        if (!selectedDate) return false;
        return date.toISOString().split('T')[0] === selectedDate;
    };

    // Weekend checker (Saturday = 6, Sunday = 0)
    const isWeekend = (date: Date) => {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        // Return 24-hour format (Austrian standard)
        return timeString;
    };

    const handleDragStart = (e: React.DragEvent, activity: Activity) => {
        setDraggedActivity(activity);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', activity.id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, date: Date) => {
        e.preventDefault();
        if (draggedActivity && onActivityDrop) {
            const newDateString = date.toISOString().split('T')[0];
            if (newDateString !== draggedActivity.date) {
                onActivityDrop(draggedActivity.id, newDateString);
            }
        }
        setDraggedActivity(null);
    };

    const handleDragEnd = () => {
        setDraggedActivity(null);
    };

    const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    if (view === 'week') {
        return (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Week Header */}
                <div className="grid grid-cols-7 border-b border-border">
                    {calendarDays.map((day, index) => (
                        <div key={index} className="p-4 text-center border-r border-border last:border-r-0">
                            <div className="text-sm font-medium text-muted-foreground">
                                {weekDays[day.getDay()]}
                            </div>
                            <div className={`text-2xl font-bold mt-1 ${isToday(day)
                                ? 'text-blue-500 font-bold'
                                : isSelectedDate(day)
                                    ? 'text-blue-500 font-bold'
                                    : isWeekend(day)
                                        ? 'text-muted-foreground font-medium'
                                        : 'text-card-foreground'
                                }`}>
                                {day.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 min-h-[600px]">
                    {calendarDays.map((day, index) => {
                        const dayActivities = getActivitiesForDate(day);
                        const dateString = day.toISOString().split('T')[0];

                        return (
                            <div
                                key={index}
                                className={`p-2 border-r border-border last:border-r-0 cursor-pointer hover:bg-muted/50 transition-colors ${isSelectedDate(day) ? 'bg-blue-500/20 ring-2 ring-blue-500/40' : ''
                                    }`}
                                onClick={() => onDateClick(dateString)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day)}
                            >
                                <div className="space-y-1">
                                    {dayActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className={`p-2 rounded-lg text-xs cursor-pointer hover:opacity-80 transition-opacity ${draggedActivity?.id === activity.id ? 'opacity-50' : ''
                                                }`}
                                            style={{ backgroundColor: activity.color + '20', borderLeft: `3px solid ${activity.color}` }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onActivityClick(activity);
                                            }}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, activity)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <div className="font-medium text-card-foreground truncate">
                                                {activity.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Month View
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Month Header */}
            <div className="grid grid-cols-7 border-b border-border">
                {weekDays.map((day) => (
                    <div key={day} className="p-4 text-center border-r border-border last:border-r-0">
                        <div className="text-sm font-medium text-muted-foreground">
                            {day}
                        </div>
                    </div>
                ))}
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                    const dayActivities = getActivitiesForDate(day);
                    const dateString = day.toISOString().split('T')[0];

                    return (
                        <div
                            key={index}
                            className={`min-h-[120px] p-2 border-r border-b border-border last:border-r-0 cursor-pointer hover:bg-muted/50 transition-colors ${isSelectedDate(day) ? 'bg-blue-500/20 ring-2 ring-blue-500/40' : ''
                                }`}
                            onClick={() => onDateClick(dateString)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, day)}
                        >
                            <div className={`text-sm font-medium mb-1 ${isToday(day)
                                ? 'text-blue-500 font-bold'
                                : isSelectedDate(day)
                                    ? 'text-blue-500 font-bold'
                                    : isWeekend(day)
                                        ? 'text-muted-foreground font-medium'
                                        : 'text-card-foreground'
                                }`}>
                                {day.getDate()}
                            </div>

                            <div className="space-y-1">
                                {dayActivities.slice(0, 3).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${draggedActivity?.id === activity.id ? 'opacity-50' : ''
                                            }`}
                                        style={{ backgroundColor: activity.color + '20', borderLeft: `2px solid ${activity.color}` }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onActivityClick(activity);
                                        }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, activity)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="font-medium text-card-foreground truncate">
                                            {activity.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatTime(activity.startTime)}
                                        </div>
                                    </div>
                                ))}
                                {dayActivities.length > 3 && (
                                    <div className="text-xs text-muted-foreground p-1">
                                        +{dayActivities.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

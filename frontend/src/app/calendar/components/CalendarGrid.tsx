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
    onDayClick: (date: string) => void;
    onActivityClick: (activity: Activity) => void;
    selectedDate?: string;
}

export function CalendarGrid({
    currentDate,
    view,
    activities,
    onDayClick,
    onActivityClick,
    selectedDate
}: CalendarGridProps) {
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);

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

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-900 dark:text-white'
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
                                className={`p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isSelectedDate(day) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                onClick={() => onDayClick(dateString)}
                            >
                                <div className="space-y-1">
                                    {dayActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="p-2 rounded-lg text-xs cursor-pointer hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: activity.color + '20', borderLeft: `3px solid ${activity.color}` }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onActivityClick(activity);
                                            }}
                                        >
                                            <div className="font-medium text-gray-900 dark:text-white truncate">
                                                {activity.title}
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
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
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {weekDays.map((day) => (
                    <div key={day} className="p-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                            className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!isCurrentMonth(day) ? 'bg-gray-50 dark:bg-gray-900/50' : ''
                                } ${isSelectedDate(day) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                            onClick={() => onDayClick(dateString)}
                        >
                            <div className={`text-sm font-medium mb-1 ${isToday(day)
                                ? 'text-blue-600 dark:text-blue-400'
                                : !isCurrentMonth(day)
                                    ? 'text-gray-400 dark:text-gray-600'
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                {day.getDate()}
                            </div>

                            <div className="space-y-1">
                                {dayActivities.slice(0, 3).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ backgroundColor: activity.color + '20', borderLeft: `2px solid ${activity.color}` }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onActivityClick(activity);
                                        }}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white truncate">
                                            {activity.title}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {formatTime(activity.startTime)}
                                        </div>
                                    </div>
                                ))}
                                {dayActivities.length > 3 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 p-1">
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

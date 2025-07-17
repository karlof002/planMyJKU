'use client';

import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface CalendarHeaderProps {
    currentDate: Date;
    onNavigate: (direction: 'prev' | 'next') => void;
    onAddActivity: () => void;
    onOpenTemplates: () => void;
    view: 'month' | 'week';
    onViewChange: (view: 'month' | 'week') => void;
}

export function CalendarHeader({
    currentDate,
    onNavigate,
    onAddActivity,
    onOpenTemplates,
    view,
    onViewChange
}: CalendarHeaderProps) {
    return (
        <div className="bg-card border border-border rounded-2xl shadow-lg mb-6">
            <div className="p-6">
                {/* Top Row: Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-card-foreground">Calendar</h1>
                        <p className="text-muted-foreground text-sm">Manage your activities and schedule</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onAddActivity}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Activity
                        </button>
                        <button
                            onClick={onOpenTemplates}
                            className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-xl hover:bg-secondary/80 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Templates
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation and View Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
                    {/* Month/Year Navigation */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onNavigate('prev')}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Previous"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <h2 className="text-lg font-semibold text-card-foreground min-w-[180px] text-center">
                            {format(currentDate, 'MMMM yyyy', { locale: de })}
                        </h2>

                        <button
                            onClick={() => onNavigate('next')}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Next"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => onViewChange('month')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === 'month'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Month
                            </div>
                        </button>
                        <button
                            onClick={() => onViewChange('week')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === 'week'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Week
                            </div>
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}

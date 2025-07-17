'use client';

import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface CalendarHeaderProps {
    currentDate: Date;
    onNavigate: (direction: 'prev' | 'next') => void;
    onAddActivity: () => void;
    onOpenTemplates: () => void;
}

export function CalendarHeader({
    currentDate,
    onNavigate,
    onAddActivity,
    onOpenTemplates
}: CalendarHeaderProps) {
    return (
        <div className="bg-card border border-border rounded-2xl shadow-lg mb-6">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Title and Date */}
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-card-foreground">
                                Calendar
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {format(currentDate, 'MMMM yyyy', { locale: de })}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
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

                {/* Navigation and View Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-border">
                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onNavigate('prev')}
                            className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-card-foreground min-w-[200px] text-center">
                            {format(currentDate, 'MMMM yyyy', { locale: de })}
                        </h2>
                        <button
                            onClick={() => onNavigate('next')}
                            className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

interface ActivityType {
    id: string;
    label: string;
    color: string;
    count: number;
}

interface ActivityTypeLegendProps {
    activityTypes: ActivityType[];
    selectedDate: string;
    onAddActivity: (type: ActivityType) => void;
}

export function ActivityTypeLegend({ activityTypes, selectedDate, onAddActivity }: ActivityTypeLegendProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-AT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a2 2 0 012-2z" />
                </svg>
                Activity Types
            </h3>

            <div className="space-y-3">
                {activityTypes.map((type) => (
                    <div
                        key={type.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-border"
                                style={{ backgroundColor: type.color }}
                            />
                            <div className="flex-1">
                                <div className="text-sm font-medium text-card-foreground">
                                    {type.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {type.count} activities
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onAddActivity(type)}
                            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                            title={`Add ${type.label.toLowerCase()} activity`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                        </button>
                    </div>
                ))}
            </div>

            {selectedDate && (
                <div className="mt-6 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2">
                        Selected Date
                    </div>
                    <div className="text-sm font-medium text-card-foreground">
                        {formatDate(selectedDate)}
                    </div>
                </div>
            )}
        </div>
    );
}

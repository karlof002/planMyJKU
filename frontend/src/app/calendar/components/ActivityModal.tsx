'use client';

import { useState, useEffect } from 'react';

interface Activity {
    id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    type: 'exam' | 'assignment' | 'lecture' | 'meeting' | 'personal';
    color: string;
}

interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (activity: Omit<Activity, 'id'>) => void;
    activity?: Activity | null;
    selectedDate: string;
    onDelete?: (id: string) => void;
}

export function ActivityModal({ isOpen, onClose, onSave, activity, selectedDate, onDelete }: ActivityModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: selectedDate || new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        type: 'personal' as 'exam' | 'assignment' | 'lecture' | 'meeting' | 'personal',
        color: '#3b82f6'
    });

    const [showColorPicker, setShowColorPicker] = useState(false);

    const predefinedColors = [
        '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6',
        '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1'
    ];

    useEffect(() => {
        if (activity) {
            setFormData({
                title: activity.title,
                description: activity.description,
                date: activity.date,
                startTime: activity.startTime,
                endTime: activity.endTime,
                type: activity.type,
                color: activity.color
            });
        } else {
            setFormData({
                title: '',
                description: '',
                date: selectedDate || new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
                type: 'personal',
                color: '#3b82f6'
            });
        }
    }, [activity, selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleDelete = () => {
        if (activity && onDelete) {
            onDelete(activity.id);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-card-foreground">
                        {activity ? 'Edit Activity' : 'Add Activity'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-card-foreground mb-2">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-card-foreground mb-2">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                            Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Activity['type'] }))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                        >
                            <option value="personal">Personal</option>
                            <option value="lecture">Lecture</option>
                            <option value="exam">Exam</option>
                            <option value="assignment">Assignment</option>
                            <option value="meeting">Meeting</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                            Color
                        </label>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer"
                                style={{ backgroundColor: formData.color }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            />
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-16 h-8 rounded-lg border border-border cursor-pointer"
                            />
                        </div>

                        {showColorPicker && (
                            <div className="mt-2 p-2 bg-background border border-border rounded-lg">
                                <div className="grid grid-cols-5 gap-2">
                                    {predefinedColors.map(color => (
                                        <div
                                            key={color}
                                            className="w-8 h-8 rounded-lg cursor-pointer border-2 border-border hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, color }));
                                                setShowColorPicker(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-4">
                        <div>
                            {activity && onDelete && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-card-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {activity ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

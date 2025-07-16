'use client';

import { useState } from 'react';

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

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: Template[];
    onUseTemplate: (template: Template) => void;
    onSaveTemplate: (template: Omit<Template, 'id'>) => void;
    onDeleteTemplate: (id: string) => void;
}

export function TemplateModal({
    isOpen,
    onClose,
    templates,
    onUseTemplate,
    onSaveTemplate,
    onDeleteTemplate
}: TemplateModalProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: 'personal' as Template['type'],
        color: '#3b82f6'
    });

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditingTemplate(null);
        setFormData({
            name: '',
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            type: 'personal',
            color: '#3b82f6'
        });
    };

    const handleEdit = (template: Template) => {
        setIsCreating(true);
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            title: template.title,
            description: template.description,
            startTime: template.startTime,
            endTime: template.endTime,
            type: template.type,
            color: template.color
        });
    };

    const handleSave = () => {
        if (!formData.name || !formData.title) {
            alert('Please fill in template name and title');
            return;
        }

        if (editingTemplate) {
            // Update existing template
            onSaveTemplate({
                ...formData,
                id: editingTemplate.id
            } as Template);
        } else {
            // Create new template
            onSaveTemplate(formData);
        }

        setIsCreating(false);
        setEditingTemplate(null);
        setFormData({
            name: '',
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            type: 'personal',
            color: '#3b82f6'
        });
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingTemplate(null);
        setFormData({
            name: '',
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            type: 'personal',
            color: '#3b82f6'
        });
    };

    const handleDelete = (template: Template) => {
        if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
            onDeleteTemplate(template.id);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {isCreating ? (editingTemplate ? 'Edit Template' : 'Create Template') : 'Activity Templates'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {isCreating ? (
                        /* Create/Edit Template Form */
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Template Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., Study Session, Morning Lecture"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Activity Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Default activity title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows={3}
                                    placeholder="Default description (optional)"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Activity Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Template['type'] })}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="personal">Personal</option>
                                    <option value="lecture">Lecture</option>
                                    <option value="exam">Exam</option>
                                    <option value="assignment">Assignment</option>
                                    <option value="meeting">Meeting</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6',
                                        '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
                                    ].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${formData.color === color
                                                ? 'border-gray-900 dark:border-white scale-110'
                                                : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Custom color</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editingTemplate ? 'Update Template' : 'Create Template'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Template List */
                        <div className="space-y-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div
                                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: template.color }}
                                                />
                                                <div className="font-semibold text-gray-900 dark:text-white">{template.name}</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{template.title}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                                {template.startTime} - {template.endTime} • {template.type}
                                            </div>
                                            {template.description && (
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {template.description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onUseTemplate(template)}
                                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                            >
                                                Use
                                            </button>
                                            <button
                                                onClick={() => handleEdit(template)}
                                                className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(template)}
                                                className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {templates.length === 0 && (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <p className="text-lg font-medium">No templates yet</p>
                                    <p className="text-sm mt-1">Create your first template to get started!</p>
                                </div>
                            )}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                                <button
                                    onClick={handleCreateNew}
                                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create New Template
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

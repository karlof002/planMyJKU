'use client';

import { useState } from 'react';

interface Template {
    id: string;
    name: string;
    title: string;
    description: string;
    type: 'exam' | 'assignment' | 'lecture' | 'meeting' | 'personal';
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

export default function TemplateModal({
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
        type: 'personal' as Template['type'],
        color: '#3b82f6'
    });

    const predefinedColors = [
        '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6',
        '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1',
        '#14b8a6', '#f43f5e', '#a855f7', '#3b82f6', '#64748b',
        '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb'
    ];

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditingTemplate(null);
        setFormData({
            name: '',
            title: '',
            description: '',
            type: 'personal',
            color: '#3b82f6'
        });
    };

    const handleEditTemplate = (template: Template) => {
        setEditingTemplate(template);
        setIsCreating(true);
        setFormData({
            name: template.name,
            title: template.title,
            description: template.description,
            type: template.type,
            color: template.color
        });
    };

    const handleSaveTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            // Update existing template
            onSaveTemplate({ ...formData });
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
            type: 'personal',
            color: '#3b82f6'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {isCreating ? (editingTemplate ? 'Edit Template' : 'Create New Template') : 'Templates'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {isCreating ? (
                        // Create/Edit Form
                        <form onSubmit={handleSaveTemplate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Template Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Study Session, Morning Lecture"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Default Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Default activity title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="Template description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">
                                    Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Template['type'] })}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                <div className="flex items-center gap-4 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
                                        style={{ backgroundColor: formData.color }}
                                        onClick={() => document.getElementById('color-picker')?.click()}
                                    />
                                    <input
                                        id="color-picker"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="sr-only"
                                    />
                                </div>
                                <div className="grid grid-cols-10 gap-2">
                                    {predefinedColors.map((color) => (
                                        <div
                                            key={color}
                                            className={`w-8 h-8 rounded-lg cursor-pointer border-2 hover:scale-110 transition-transform ${formData.color === color ? 'border-foreground scale-110' : 'border-border'
                                                }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setFormData({ ...formData, color })}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editingTemplate ? 'Update Template' : 'Create Template'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Templates List
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 dark:text-gray-300">
                                    Create reusable templates for common activities
                                </p>
                                <button
                                    onClick={handleCreateNew}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    New Template
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {templates.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p className="text-gray-600 dark:text-gray-300">No templates yet</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your first template to get started</p>
                                    </div>
                                ) : (
                                    templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="bg-background border border-border rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: template.color }}
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">{template.name}</div>                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                                            {template.title} • {template.type}
                                                        </div>
                                                        {template.description && (<div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                            {template.description}
                                                        </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditTemplate(template)}
                                                        className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => onUseTemplate(template)}
                                                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                                    >
                                                        Use
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteTemplate(template.id)}
                                                        className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

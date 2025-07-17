"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navigation } from "../../components/Navigation";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isVerified: boolean;
}

interface Course {
    id: string;
    courseCode: string;
    title: string;
    ects: number;
    semester: string;
    faculty: string;
    courseType: string;
    prerequisites: string[];
    description?: string;
}

interface SemesterCourse {
    id: string;
    course: Course;
}

interface Semester {
    id: string;
    userId: string;
    name: string;
    year: number;
    type: string;
    isActive: boolean;
    courses: SemesterCourse[];
}

export default function SemesterDetailPage() {
    const [user, setUser] = useState<User | null>(null);
    const [semester, setSemester] = useState<Semester | null>(null);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        year: new Date().getFullYear(),
        type: "WS",
        isActive: false
    });

    const router = useRouter();
    const params = useParams();
    const semesterId = params.id as string;

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
        if (user && semesterId) {
            fetchSemesterDetails();
            fetchAvailableCourses();
        }
    }, [user, semesterId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchSemesterDetails = async () => {
        try {
            const response = await fetch(`/api/semesters/${semesterId}?userId=${user?.id}`);
            if (response.ok) {
                const data = await response.json();
                setSemester(data);
                setEditForm({
                    name: data.name,
                    year: data.year,
                    type: data.type,
                    isActive: data.isActive
                });
            } else {
                console.error('Semester not found');
                router.push('/semesters');
            }
        } catch (error) {
            console.error('Error fetching semester:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            if (response.ok) {
                const data = await response.json();
                setAvailableCourses(data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleAddCourse = async (courseId: string) => {
        try {
            const response = await fetch(`/api/semesters/${semesterId}/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId, userId: user?.id })
            });

            if (response.ok) {
                await fetchSemesterDetails();
                setShowAddCourse(false);
            }
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const handleRemoveCourse = async (semesterCourseId: string) => {
        try {
            const response = await fetch(`/api/semesters/${semesterId}/courses`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ semesterCourseId, userId: user?.id })
            });

            if (response.ok) {
                await fetchSemesterDetails();
            }
        } catch (error) {
            console.error('Error removing course:', error);
        }
    };

    const handleUpdateSemester = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/semesters/${semesterId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editForm, userId: user?.id })
            });

            if (response.ok) {
                await fetchSemesterDetails();
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Error updating semester:', error);
        }
    };

    const handleDeleteSemester = async () => {
        try {
            const response = await fetch(`/api/semesters/${semesterId}?userId=${user?.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                router.push('/semesters');
            }
        } catch (error) {
            console.error('Error deleting semester:', error);
        }
    };

    const getTotalECTS = () => {
        return semester?.courses.reduce((total, sc) => total + sc.course.ects, 0) || 0;
    };

    const getSemesterTypeColor = (type: string) => {
        return type === 'WS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    };

    const getAvailableCoursesToAdd = () => {
        const enrolledCourseIds = semester?.courses.map(sc => sc.course.id) || [];
        return availableCourses.filter(course => !enrolledCourseIds.includes(course.id));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading semester details...</p>
                </div>
            </div>
        );
    }

    if (!semester) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-lg font-semibold mb-2">Semester not found</h3>
                    <p className="text-foreground/60 mb-6">The semester you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
                    <button
                        onClick={() => router.push('/semesters')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
                    >
                        Back to Semesters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.push('/semesters')}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground">{semester.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <p className="text-foreground/60">{semester.year}</p>
                                <span className={`px-2 py-1 rounded text-xs ${getSemesterTypeColor(semester.type)}`}>
                                    {semester.type}
                                </span>
                                {semester.isActive && (
                                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Active
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Edit Semester
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">Total Courses</p>
                                <p className="text-2xl font-bold text-primary">{semester.courses.length}</p>
                            </div>
                            <div className="text-primary text-3xl">📚</div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">Total ECTS</p>
                                <p className="text-2xl font-bold text-green-600">{getTotalECTS()}</p>
                            </div>
                            <div className="text-green-600 text-3xl">⭐</div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">ECTS Warning</p>
                                <p className={`text-sm font-medium ${getTotalECTS() > 30 ? 'text-red-600' : 'text-green-600'}`}>
                                    {getTotalECTS() > 30 ? 'Overloaded' : 'Normal'}
                                </p>
                            </div>
                            <div className={`text-3xl ${getTotalECTS() > 30 ? 'text-red-600' : 'text-green-600'}`}>
                                {getTotalECTS() > 30 ? '⚠️' : '✅'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Management */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Enrolled Courses</h2>
                        <button
                            onClick={() => setShowAddCourse(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Add Course
                        </button>
                    </div>

                    {semester.courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-lg font-semibold mb-2">No courses enrolled</h3>
                            <p className="text-foreground/60 mb-6">Start by adding courses to this semester</p>
                            <button
                                onClick={() => setShowAddCourse(true)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
                            >
                                Add First Course
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {semester.courses.map(sc => (
                                <div key={sc.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-card-foreground">{sc.course.courseCode}</h3>
                                                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                                    {sc.course.ects} ECTS
                                                </span>
                                                <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                                                    {sc.course.courseType}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-medium mb-2">{sc.course.title}</h4>
                                            {sc.course.description && (
                                                <p className="text-sm text-muted-foreground mb-2">{sc.course.description}</p>
                                            )}
                                            <p className="text-sm text-muted-foreground">{sc.course.faculty}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveCourse(sc.id)}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Semester Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0" onClick={() => setShowEditModal(false)}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-1" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-card-foreground">Edit Semester</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSemester} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Semester Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-card-foreground"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Year</label>
                                    <input
                                        type="number"
                                        value={editForm.year}
                                        onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-card-foreground"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Type</label>
                                    <select
                                        value={editForm.type}
                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-card-foreground"
                                    >
                                        <option value="WS">Winter Semester (WS)</option>
                                        <option value="SS">Summer Semester (SS)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={editForm.isActive}
                                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                        className="rounded border-border"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-card-foreground">Set as active semester</label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-card-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Course Modal */}
            {showAddCourse && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0" onClick={() => setShowAddCourse(false)}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-1" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-card-foreground">Add Course to Semester</h2>
                                <button
                                    onClick={() => setShowAddCourse(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {getAvailableCoursesToAdd().length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📚</div>
                                    <p className="text-muted-foreground">All available courses are already enrolled in this semester.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {getAvailableCoursesToAdd().map(course => (
                                        <div key={course.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-card-foreground">{course.courseCode}</h3>
                                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                                            {course.ects} ECTS
                                                        </span>
                                                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                                                            {course.courseType}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg font-medium mb-2">{course.title}</h4>
                                                    {course.description && (
                                                        <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                                                    )}
                                                    <p className="text-sm text-muted-foreground">{course.faculty}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddCourse(course.id)}
                                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Semester Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0" onClick={() => setShowEditModal(false)}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-1" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-card-foreground">Edit Semester</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSemester} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Semester Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-card-foreground"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Year</label>
                                    <input
                                        type="number"
                                        value={editForm.year}
                                        onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-card-foreground"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-2">Type</label>
                                    <select
                                        value={editForm.type}
                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-card-foreground"
                                    >
                                        <option value="WS">Winter Semester (WS)</option>
                                        <option value="SS">Summer Semester (SS)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={editForm.isActive}
                                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                        className="rounded border-border"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-card-foreground">Set as active semester</label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-card-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Semester Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-1" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-card-foreground">Delete Semester</h2>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-card-foreground">Are you sure?</h3>
                                        <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                                    </div>
                                </div>

                                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                    <h4 className="font-semibold text-card-foreground mb-2">You are about to delete:</h4>
                                    <p className="text-sm text-card-foreground mb-1">{semester?.name} ({semester?.year})</p>
                                    <p className="text-sm text-muted-foreground">
                                        {semester?.courses.length} courses will be removed from this semester
                                    </p>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    This will permanently delete the semester and remove all course enrollments. The courses themselves will not be deleted.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-card-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteSemester}
                                    className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                                >
                                    Delete Semester
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

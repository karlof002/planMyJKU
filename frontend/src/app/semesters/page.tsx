"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../components/ThemeToggle";

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
}

interface Semester {
    id: string;
    userId: string;
    name: string;
    year: number;
    type: string;
    isActive: boolean;
    courses: {
        id: string;
        course: Course;
    }[];
}

export default function SemestersPage() {
    const [user, setUser] = useState<User | null>(null);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSemester, setNewSemester] = useState({
        name: "",
        year: new Date().getFullYear(),
        type: "WS",
        isActive: false
    });
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchSemesters(JSON.parse(storedUser).id);
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    const fetchSemesters = async (userId: string) => {
        try {
            const response = await fetch(`/api/semesters?userId=${userId}`);
            const data = await response.json();
            setSemesters(data);
        } catch (error) {
            console.error('Error fetching semesters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createSemester = async () => {
        if (!user) return;

        try {
            const response = await fetch('/api/semesters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    name: newSemester.name,
                    year: newSemester.year,
                    type: newSemester.type,
                    isActive: newSemester.isActive
                }),
            });

            if (response.ok) {
                fetchSemesters(user.id);
                setShowCreateForm(false);
                setNewSemester({
                    name: "",
                    year: new Date().getFullYear(),
                    type: "WS",
                    isActive: false
                });
            }
        } catch (error) {
            console.error('Error creating semester:', error);
        }
    };

    const getTotalECTS = (semester: Semester) => {
        return semester.courses.reduce((total, sc) => total + sc.course.ects, 0);
    };

    const getSemesterTypeColor = (type: string) => {
        return type === 'WS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading semesters...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">Semester Planning</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Your Semesters</h2>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Create New Semester
                    </button>
                </div>

                {showCreateForm && (
                    <div className="mb-8 bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Create New Semester</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Semester Name</label>
                                <input
                                    type="text"
                                    value={newSemester.name}
                                    onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                                    placeholder="e.g., WS 2024/25"
                                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <input
                                    type="number"
                                    value={newSemester.year}
                                    onChange={(e) => setNewSemester({ ...newSemester, year: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Type</label>
                                <select
                                    value={newSemester.type}
                                    onChange={(e) => setNewSemester({ ...newSemester, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="WS">Winter Semester</option>
                                    <option value="SS">Summer Semester</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={newSemester.isActive}
                                    onChange={(e) => setNewSemester({ ...newSemester, isActive: e.target.checked })}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm">Set as active semester</label>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={createSemester}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Create Semester
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {semesters.map(semester => (
                        <div key={semester.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{semester.name}</h3>
                                    <p className="text-sm text-foreground/60">{semester.year}</p>
                                </div>
                                <div className="flex items-center space-x-2">
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

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Courses:</span>
                                    <span className="font-medium">{semester.courses.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Total ECTS:</span>
                                    <span className="font-medium">{getTotalECTS(semester)}</span>
                                </div>

                                {semester.courses.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium mb-2">Courses:</h4>
                                        <div className="space-y-1">
                                            {semester.courses.slice(0, 3).map(sc => (
                                                <div key={sc.id} className="text-xs text-foreground/70 flex justify-between">
                                                    <span>{sc.course.courseCode}</span>
                                                    <span>{sc.course.ects} ECTS</span>
                                                </div>
                                            ))}
                                            {semester.courses.length > 3 && (
                                                <div className="text-xs text-foreground/50">
                                                    +{semester.courses.length - 3} more courses
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex space-x-2">
                                <button
                                    onClick={() => router.push(`/semesters/${semester.id}`)}
                                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => router.push(`/semesters/${semester.id}/edit`)}
                                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {semesters.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-lg font-semibold mb-2">No semesters yet</h3>
                        <p className="text-foreground/60 mb-6">Create your first semester to start planning your studies</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            Create Your First Semester
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

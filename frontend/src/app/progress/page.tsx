"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "../components/Navigation";

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
}

interface UserCourse {
    id: string;
    userId: string;
    courseId: string;
    status: string;
    grade?: number;
    ects?: number;
    createdAt: string;
    course: Course;
}

interface Stats {
    totalCourses: number;
    completedCourses: number;
    enrolledCourses: number;
    plannedCourses: number;
    totalECTS: number;
    currentGPA: number;
    coursesByStatus: {
        completed: number;
        enrolled: number;
        planned: number;
    };
}

export default function ProgressPage() {
    const [user, setUser] = useState<User | null>(null);
    const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalCourses: 0,
        completedCourses: 0,
        enrolledCourses: 0,
        plannedCourses: 0,
        totalECTS: 0,
        currentGPA: 0,
        coursesByStatus: {
            completed: 0,
            enrolled: 0,
            planned: 0
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchUserData(JSON.parse(storedUser).id);
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    const fetchUserData = async (userId: string) => {
        try {
            const [coursesResponse, statsResponse] = await Promise.all([
                fetch(`/api/user/courses?userId=${userId}`),
                fetch(`/api/user/stats?userId=${userId}`)
            ]);

            const coursesData = await coursesResponse.json();
            const statsData = await statsResponse.json();

            setUserCourses(coursesData);
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCourseStatus = async (courseId: string, status: string, grade?: number) => {
        try {
            const response = await fetch(`/api/user/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, grade }),
            });

            if (response.ok && user) {
                fetchUserData(user.id);
            }
        } catch (error) {
            console.error('Error updating course status:', error);
        }
    };

    const removeCourse = async (courseId: string) => {
        try {
            const response = await fetch(`/api/user/courses/${courseId}`, {
                method: 'DELETE',
            });

            if (response.ok && user) {
                fetchUserData(user.id);
            }
        } catch (error) {
            console.error('Error removing course:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'enrolled':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'planned':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getGradeColor = (grade: number) => {
        if (grade <= 2) return 'text-green-600 dark:text-green-400';
        if (grade <= 3) return 'text-yellow-600 dark:text-yellow-400';
        if (grade <= 4) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const filteredCourses = userCourses.filter(course => {
        if (filter === 'all') return true;
        return course.status === filter;
    });

    const getProgressPercentage = () => {
        // Assuming 180 ECTS for a bachelor's degree
        const totalRequiredECTS = 180;
        return Math.min((stats.totalECTS / totalRequiredECTS) * 100, 100);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading progress...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Progress Tracking</h1>
                    <p className="text-foreground/60">Monitor your academic progress and achievements</p>
                </div>

                {/* Overall Progress */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground/70">Total ECTS</span>
                                <span className="text-2xl font-bold text-primary">{stats.totalECTS}</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${getProgressPercentage()}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-foreground/60 mt-2">{getProgressPercentage().toFixed(1)}% of 180 ECTS</p>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground/70">Current GPA</span>
                                <span className="text-2xl font-bold text-primary">{stats.currentGPA}</span>
                            </div>
                            <p className="text-xs text-foreground/60">Based on {stats.completedCourses} completed courses</p>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground/70">Completed</span>
                                <span className="text-2xl font-bold text-green-600">{stats.completedCourses}</span>
                            </div>
                            <p className="text-xs text-foreground/60">of {stats.totalCourses} total courses</p>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground/70">In Progress</span>
                                <span className="text-2xl font-bold text-blue-600">{stats.enrolledCourses}</span>
                            </div>
                            <p className="text-xs text-foreground/60">Currently enrolled</p>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Course Details</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                All ({stats.totalCourses})
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'completed'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                Completed ({stats.completedCourses})
                            </button>
                            <button
                                onClick={() => setFilter('enrolled')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'enrolled'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                Enrolled ({stats.enrolledCourses})
                            </button>
                            <button
                                onClick={() => setFilter('planned')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'planned'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                Planned ({stats.plannedCourses})
                            </button>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="text-left p-4 font-medium">Course</th>
                                        <th className="text-left p-4 font-medium">Title</th>
                                        <th className="text-left p-4 font-medium">ECTS</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Grade</th>
                                        <th className="text-left p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map((userCourse) => (
                                        <tr key={userCourse.id} className="border-t border-border">
                                            <td className="p-4 font-medium">{userCourse.course.courseCode}</td>
                                            <td className="p-4">{userCourse.course.title}</td>
                                            <td className="p-4">{userCourse.course.ects}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(userCourse.status)}`}>
                                                    {userCourse.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {userCourse.grade ? (
                                                    <span className={`font-medium ${getGradeColor(userCourse.grade)}`}>
                                                        {userCourse.grade}
                                                    </span>
                                                ) : (
                                                    <span className="text-foreground/50">-</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex space-x-2">
                                                    <select
                                                        value={userCourse.status}
                                                        onChange={(e) => updateCourseStatus(userCourse.id, e.target.value)}
                                                        className="text-xs px-2 py-1 border border-border rounded bg-input"
                                                    >
                                                        <option value="planned">Planned</option>
                                                        <option value="enrolled">Enrolled</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="failed">Failed</option>
                                                    </select>
                                                    {userCourse.status === 'completed' && (
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="5"
                                                            step="0.1"
                                                            value={userCourse.grade || ''}
                                                            onChange={(e) => updateCourseStatus(userCourse.id, 'completed', parseFloat(e.target.value))}
                                                            placeholder="Grade"
                                                            className="text-xs px-2 py-1 border border-border rounded bg-input w-20"
                                                        />
                                                    )}
                                                    <button
                                                        onClick={() => removeCourse(userCourse.id)}
                                                        className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                        <p className="text-foreground/60 mb-6">
                            {filter === 'all'
                                ? 'Start by adding some courses to your plan'
                                : `No ${filter} courses found`}
                        </p>
                        <button
                            onClick={() => router.push('/courses')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            Browse Courses
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

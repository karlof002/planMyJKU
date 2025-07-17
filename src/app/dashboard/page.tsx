"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isVerified: boolean;
}

interface UserCourse {
    id: string;
    status: string;
    grade?: number;
    ects?: number;
    course: {
        id: string;
        courseCode: string;
        title: string;
        ects: number;
    };
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

export default function DashboardPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            fetchUserData(userData.id);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'enrolled':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'planned':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };



    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                    <p className="text-foreground/60">Welcome back! Here&apos;s your study progress overview</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">Total Courses</p>
                                <p className="text-2xl font-bold text-primary">{stats.totalCourses}</p>
                            </div>
                            <div className="text-primary text-3xl">📚</div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completedCourses}</p>
                            </div>
                            <div className="text-green-600 text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">Total ECTS</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.totalECTS}</p>
                            </div>
                            <div className="text-blue-600 text-3xl">🎓</div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">Current GPA</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.currentGPA}</p>
                            </div>
                            <div className="text-purple-600 text-3xl">📊</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => router.push('/semesters')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
                        >
                            Plan Semester
                        </button>
                        <button
                            onClick={() => router.push('/progress')}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md font-medium"
                        >
                            Track Progress
                        </button>
                        <button
                            onClick={() => router.push('/courses')}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md font-medium"
                        >
                            Browse Courses
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {userCourses.slice(0, 5).map((userCourse) => (
                            <div key={userCourse.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <div>
                                        <p className="font-medium">{userCourse.course.courseCode}</p>
                                        <p className="text-sm text-foreground/70">{userCourse.course.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(userCourse.status)}`}>
                                        {userCourse.status}
                                    </span>
                                    <span className="text-sm text-foreground/70">{userCourse.course.ects} ECTS</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {userCourses.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                            <p className="text-foreground/60 mb-4">Start by browsing available courses and adding them to your plan</p>
                            <button
                                onClick={() => router.push('/courses')}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
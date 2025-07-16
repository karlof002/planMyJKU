"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isVerified: boolean;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in (you'll need to implement session management)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/auth/login');
        }
        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">planMyJKU</h1>
                            <span className="text-sm text-foreground/60">Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-foreground/80">
                                Welcome, {user.firstName}!
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Profile Card */}
                    <div className="bg-secondary/50 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Profile</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-foreground/70">Name</label>
                                <p className="text-foreground">{user.firstName} {user.lastName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground/70">Email</label>
                                <p className="text-foreground">{user.email}</p>
                            </div>
                            {user.studentId && (
                                <div>
                                    <label className="text-sm font-medium text-foreground/70">Student ID</label>
                                    <p className="text-foreground">{user.studentId}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-foreground/70">Status</label>
                                <p className="text-foreground flex items-center">
                                    {user.isVerified ? (
                                        <>
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            Verified
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            Unverified
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-secondary/50 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Plan Semester
                            </button>
                            <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                View Courses
                            </button>
                            <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Track Progress
                            </button>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-secondary/50 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-foreground/70">Completed Courses</span>
                                <span className="font-medium">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/70">ECTS Earned</span>
                                <span className="font-medium">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/70">Current GPA</span>
                                <span className="font-medium">-</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/70">Semester</span>
                                <span className="font-medium">1</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Features */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-6">Coming Soon</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <div className="text-2xl mb-2">📅</div>
                            <h3 className="font-medium">Semester Planning</h3>
                            <p className="text-sm text-foreground/60 mt-2">Plan your courses by semester</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <div className="text-2xl mb-2">📚</div>
                            <h3 className="font-medium">Course Catalog</h3>
                            <p className="text-sm text-foreground/60 mt-2">Browse available courses</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <div className="text-2xl mb-2">📊</div>
                            <h3 className="font-medium">Progress Tracking</h3>
                            <p className="text-sm text-foreground/60 mt-2">Monitor your progress</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <div className="text-2xl mb-2">⏰</div>
                            <h3 className="font-medium">Scheduling</h3>
                            <p className="text-sm text-foreground/60 mt-2">Manage your schedule</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
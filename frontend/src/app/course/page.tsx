"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Course {
    id: string;
    courseCode: string;
    title: string;
    description?: string;
    ects: number;
    semester: string;
    faculty: string;
    department?: string;
    prerequisites: string[];
    language: string;
    courseType: string;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isVerified: boolean;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedCourseType, setSelectedCourseType] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/auth/login');
            return;
        }

        fetchCourses();
    }, [router]);

    const fetchCourses = async () => {
        try {
            const params = new URLSearchParams({
                ...(searchTerm && { search: searchTerm }),
                ...(selectedFaculty && { faculty: selectedFaculty }),
                ...(selectedSemester && { semester: selectedSemester }),
                ...(selectedCourseType && { courseType: selectedCourseType }),
            });

            const response = await fetch(`/api/courses?${params}`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addCourseToUser = async (courseId: string) => {
        if (!user) return;

        try {
            const response = await fetch('/api/user/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    courseId,
                    status: 'planned'
                }),
            });

            if (response.ok) {
                alert('Course added to your plan!');
            } else {
                alert('Error adding course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Error adding course');
        }
    };

    const faculties = [
        "Technisch-Naturwissenschaftliche Fakultät",
        "Rechtswissenschaftliche Fakultät",
        "Sozial- und Wirtschaftswissenschaftliche Fakultät",
        "Medizinische Fakultät"
    ];

    const courseTypes = ["VO", "UE", "VU", "SE", "PR", "PS"];

    useEffect(() => {
        fetchCourses();
    }, [searchTerm, selectedFaculty, selectedSemester, selectedCourseType]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">Course Catalog</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={selectedFaculty}
                                onChange={(e) => setSelectedFaculty(e.target.value)}
                                className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">All Faculties</option>
                                {faculties.map(faculty => (
                                    <option key={faculty} value={faculty}>{faculty}</option>
                                ))}
                            </select>
                            <select
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">All Semesters</option>
                                <option value="WS">Winter Semester</option>
                                <option value="SS">Summer Semester</option>
                            </select>
                            <select
                                value={selectedCourseType}
                                onChange={(e) => setSelectedCourseType(e.target.value)}
                                className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                {courseTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-secondary/50 rounded-lg p-6 border border-border">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{course.courseCode}</h3>
                                    <p className="text-sm text-foreground/60">{course.courseType} • {course.ects} ECTS</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${course.semester === 'WS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {course.semester}
                                </span>
                            </div>

                            <h4 className="font-medium mb-2">{course.title}</h4>

                            {course.description && (
                                <p className="text-sm text-foreground/70 mb-3 line-clamp-3">
                                    {course.description}
                                </p>
                            )}

                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Faculty: </span>
                                    <span className="text-foreground/70">{course.faculty}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Language: </span>
                                    <span className="text-foreground/70">{course.language}</span>
                                </div>
                                {course.prerequisites.length > 0 && (
                                    <div>
                                        <span className="font-medium">Prerequisites: </span>
                                        <span className="text-foreground/70">{course.prerequisites.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => addCourseToUser(course.id)}
                                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Add to Plan
                            </button>
                        </div>
                    ))}
                </div>

                {courses.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                        <p className="text-foreground/60">No courses found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "../components/Navigation";

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
    isSteopRequired: boolean;
    isSteopAllowed: boolean;
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
    const [selectedSteopFilter, setSelectedSteopFilter] = useState("");
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
    }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Filter courses based on StEOP status
    const filteredCourses = courses.filter(course => {
        if (selectedSteopFilter === 'required') {
            return course.isSteopRequired;
        }
        if (selectedSteopFilter === 'allowed') {
            return course.isSteopAllowed && !course.isSteopRequired;
        }
        if (selectedSteopFilter === 'after') {
            return !course.isSteopRequired && !course.isSteopAllowed;
        }
        return true; // Show all if no StEOP filter selected
    });

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
    }, [searchTerm, selectedFaculty, selectedSemester, selectedCourseType]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Course Catalog</h1>
                    <p className="text-foreground/60">Browse and add courses to your study plan</p>

                    {/* StEOP Legend */}
                    <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">📚 StEOP Legende</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium text-sm shadow-sm">
                                    <span className="text-xs">⚠️</span>
                                    StEOP Pflicht
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Muss für StEOP absolviert werden</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm shadow-sm">
                                    <span className="text-xs">✅</span>
                                    StEOP erlaubt
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Kann vor StEOP absolviert werden</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-500 to-slate-500 text-white font-medium text-sm shadow-sm">
                                    <span className="text-xs">🔒</span>
                                    Nach StEOP
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Erst nach StEOP möglich</span>
                            </div>
                        </div>
                    </div>
                </div>

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
                            <select
                                value={selectedSteopFilter}
                                onChange={(e) => setSelectedSteopFilter(e.target.value)}
                                className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">All StEOP Status</option>
                                <option value="required">StEOP Pflicht</option>
                                <option value="allowed">StEOP erlaubt</option>
                                <option value="after">Nach StEOP</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.courseCode}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.semester === 'WS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                            }`}>
                                            {course.semester === 'WS' ? '❄️ Winter' : '☀️ Sommer'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{course.courseType} • {course.ects} ECTS</p>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    {course.isSteopRequired && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium text-xs shadow-sm">
                                            <span className="text-[10px]">⚠️</span>
                                            StEOP Pflicht
                                        </div>
                                    )}
                                    {course.isSteopAllowed && !course.isSteopRequired && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-xs shadow-sm">
                                            <span className="text-[10px]">✅</span>
                                            StEOP erlaubt
                                        </div>
                                    )}
                                    {!course.isSteopRequired && !course.isSteopAllowed && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-500 to-slate-500 text-white font-medium text-xs shadow-sm">
                                            <span className="text-[10px]">🔒</span>
                                            Nach StEOP
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white text-base">{course.title}</h4>

                            {course.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                                    {course.description}
                                </p>
                            )}

                            <div className="space-y-3 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">🏛️ Faculty:</span>
                                    <span className="text-gray-600 dark:text-gray-400">{course.faculty}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">🌐 Language:</span>
                                    <span className="text-gray-600 dark:text-gray-400">{course.language}</span>
                                </div>
                                {course.prerequisites.length > 0 && (
                                    <div className="flex items-start gap-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">📋 Prerequisites:</span>
                                        <span className="text-gray-600 dark:text-gray-400 flex-1">{course.prerequisites.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => addCourseToUser(course.id)}
                                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                                ➕ Add to Plan
                            </button>
                        </div>
                    ))}
                </div>

                {filteredCourses.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                        <p className="text-foreground/60">No courses found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

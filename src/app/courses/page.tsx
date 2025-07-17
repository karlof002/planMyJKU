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
                    <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border">
                        <h3 className="text-sm font-semibold mb-3">StEOP (Studieneingangs- und Orientierungsphase) Legende:</h3>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-900 dark:bg-destructive/20 dark:text-destructive font-medium border border-red-300 dark:border-destructive/30">
                                    StEOP Pflicht
                                </span>
                                <span className="text-foreground/70">Muss für StEOP-Abschluss absolviert werden</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-900 dark:bg-green-500/20 dark:text-green-400 font-medium border border-green-300 dark:border-green-500/30">
                                    StEOP erlaubt
                                </span>
                                <span className="text-foreground/70">Kann vor StEOP-Abschluss absolviert werden</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-900 dark:bg-muted dark:text-muted-foreground border border-gray-300 dark:border-border">
                                    Nach StEOP
                                </span>
                                <span className="text-foreground/70">Erst nach StEOP-Abschluss möglich</span>
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
                        <div key={course.id} className="bg-secondary/50 rounded-lg p-6 border border-border">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground">{course.courseCode}</h3>
                                    <p className="text-sm text-foreground/60 font-medium">{course.courseType} • {course.ects} ECTS</p>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.semester === 'WS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                        }`}>
                                        {course.semester}
                                    </span>
                                    {course.isSteopRequired && (
                                        <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-900 dark:bg-destructive/20 dark:text-destructive font-medium border border-red-300 dark:border-destructive/30">
                                            StEOP Pflicht
                                        </span>
                                    )}
                                    {course.isSteopAllowed && !course.isSteopRequired && (
                                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-900 dark:bg-green-500/20 dark:text-green-400 font-medium border border-green-300 dark:border-green-500/30">
                                            StEOP erlaubt
                                        </span>
                                    )}
                                    {!course.isSteopRequired && !course.isSteopAllowed && (
                                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-900 dark:bg-muted dark:text-muted-foreground border border-gray-300 dark:border-border">
                                            Nach StEOP
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h4 className="text-lg font-semibold mb-3 text-foreground">{course.title}</h4>

                            {course.description && (
                                <p className="text-sm text-foreground/70 mb-4 line-clamp-3 leading-relaxed">
                                    {course.description}
                                </p>
                            )}

                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-semibold text-foreground">Faculty: </span>
                                    <span className="text-foreground/70">{course.faculty}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-foreground">Language: </span>
                                    <span className="text-foreground/70">{course.language}</span>
                                </div>
                                {course.prerequisites.length > 0 && (
                                    <div>
                                        <span className="font-semibold text-foreground">Prerequisites: </span>
                                        <span className="text-foreground/70">{course.prerequisites.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => addCourseToUser(course.id)}
                                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                            >
                                Add to Plan
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

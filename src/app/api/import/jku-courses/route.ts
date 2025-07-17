import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { getJKUInformatikCourses } from '../../../lib/jku-courses'

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const adminKey = searchParams.get('adminKey')

        // Einfacher Admin-Schutz (sollte in Produktion durch echte Auth ersetzt werden)
        if (adminKey !== 'import-jku-courses-2025') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Hole alle JKU Informatik-Kurse
        const jkuCourses = getJKUInformatikCourses()

        let importedCount = 0
        let skippedCount = 0
        let updatedCount = 0

        for (const courseData of jkuCourses) {
            try {
                // Prüfe ob Kurs bereits existiert
                const existingCourse = await db.course.findUnique({
                    where: { courseCode: courseData.courseCode }
                })

                if (existingCourse) {
                    // Überspringe bestehende Kurse für jetzt
                    skippedCount++
                    continue
                }

                // Erstelle neuen Kurs
                await db.course.create({
                    data: {
                        courseCode: courseData.courseCode,
                        title: courseData.title,
                        description: courseData.description || '',
                        ects: courseData.ects,
                        semester: courseData.semester,
                        faculty: courseData.faculty,
                        department: courseData.department || '',
                        prerequisites: [], // Kann später erweitert werden
                        language: courseData.language,
                        courseType: courseData.courseType,
                        isActive: true
                    }
                })

                importedCount++
            } catch (error) {
                console.error(`Error importing course ${courseData.courseCode}:`, error)
            }
        }

        return NextResponse.json({
            message: 'JKU courses import completed',
            imported: importedCount,
            skipped: skippedCount,
            total: jkuCourses.length
        })

    } catch (error) {
        console.error('Error importing JKU courses:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

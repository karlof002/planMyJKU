import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const faculty = searchParams.get('faculty')
        const semester = searchParams.get('semester')
        const courseType = searchParams.get('courseType')

        const courses = await db.course.findMany({
            where: {
                AND: [
                    search ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { courseCode: { contains: search, mode: 'insensitive' } },
                            { description: { contains: search, mode: 'insensitive' } },
                        ]
                    } : {},
                    faculty ? { faculty: faculty } : {},
                    semester ? { semester: semester } : {},
                    courseType ? { courseType: courseType } : {},
                    { isActive: true }
                ]
            },
            orderBy: [
                { faculty: 'asc' },
                { courseCode: 'asc' }
            ]
        })

        return NextResponse.json(courses)
    } catch (error) {
        console.error('Error fetching courses:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { courseCode, title, description, ects, semester, faculty, department, prerequisites, language, courseType } = body

        const course = await db.course.create({
            data: {
                courseCode,
                title,
                description,
                ects,
                semester,
                faculty,
                department,
                prerequisites,
                language,
                courseType,
            }
        })

        return NextResponse.json(course, { status: 201 })
    } catch (error) {
        console.error('Error creating course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
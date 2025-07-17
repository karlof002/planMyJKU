import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/db'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id: semesterId } = params
        const body = await request.json()
        const { courseId, userId } = body

        if (!userId || !courseId) {
            return NextResponse.json(
                { error: 'User ID and Course ID are required' },
                { status: 400 }
            )
        }

        // Check if the semester belongs to the user
        const semester = await db.semester.findFirst({
            where: {
                id: semesterId,
                userId: userId
            }
        })

        if (!semester) {
            return NextResponse.json(
                { error: 'Semester not found' },
                { status: 404 }
            )
        }

        // Check if course is already enrolled in this semester
        const existingEnrollment = await db.semesterCourse.findFirst({
            where: {
                semesterId: semesterId,
                courseId: courseId
            }
        })

        if (existingEnrollment) {
            return NextResponse.json(
                { error: 'Course is already enrolled in this semester' },
                { status: 400 }
            )
        }

        const semesterCourse = await db.semesterCourse.create({
            data: {
                semesterId,
                courseId,
            },
            include: {
                course: true
            }
        })

        return NextResponse.json(semesterCourse, { status: 201 })
    } catch (error) {
        console.error('Error adding course to semester:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id: semesterId } = params
        const body = await request.json()
        const { semesterCourseId, userId } = body

        if (!userId || !semesterCourseId) {
            return NextResponse.json(
                { error: 'User ID and Semester Course ID are required' },
                { status: 400 }
            )
        }

        // Check if the semester belongs to the user
        const semester = await db.semester.findFirst({
            where: {
                id: semesterId,
                userId: userId
            }
        })

        if (!semester) {
            return NextResponse.json(
                { error: 'Semester not found' },
                { status: 404 }
            )
        }

        // Remove course from semester
        await db.semesterCourse.delete({
            where: {
                id: semesterCourseId,
                semesterId: semesterId
            }
        })

        return NextResponse.json({ message: 'Course removed from semester successfully' })
    } catch (error) {
        console.error('Error removing course from semester:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

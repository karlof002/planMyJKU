import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/db'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id: semesterId } = params
        const body = await request.json()
        const { courseId } = body

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
        const { searchParams } = new URL(request.url)
        const courseId = searchParams.get('courseId')

        if (!courseId) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            )
        }

        await db.semesterCourse.delete({
            where: {
                semesterId_courseId: {
                    semesterId,
                    courseId
                }
            }
        })

        return NextResponse.json({ message: 'Course removed from semester' })
    } catch (error) {
        console.error('Error removing course from semester:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

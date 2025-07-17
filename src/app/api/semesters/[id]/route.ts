import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const { id: semesterId } = await params

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const semester = await db.semester.findFirst({
            where: {
                id: semesterId,
                userId: userId
            },
            include: {
                courses: {
                    include: {
                        course: true
                    }
                }
            }
        })

        if (!semester) {
            return NextResponse.json(
                { error: 'Semester not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(semester)
    } catch (error) {
        console.error('Error fetching semester:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json()
        const { userId, name, year, type, isActive } = body
        const { id: semesterId } = await params

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // If this semester is being set as active, deactivate all others
        if (isActive) {
            await db.semester.updateMany({
                where: {
                    userId,
                    id: { not: semesterId }
                },
                data: { isActive: false }
            })
        }

        const semester = await db.semester.update({
            where: {
                id: semesterId,
                userId: userId
            },
            data: {
                name,
                year,
                type,
                isActive,
            },
            include: {
                courses: {
                    include: {
                        course: true
                    }
                }
            }
        })

        return NextResponse.json(semester)
    } catch (error) {
        console.error('Error updating semester:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const { id: semesterId } = await params

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // First delete all semester courses
        await db.semesterCourse.deleteMany({
            where: {
                semester: {
                    id: semesterId,
                    userId: userId
                }
            }
        })

        // Then delete the semester
        await db.semester.delete({
            where: {
                id: semesterId,
                userId: userId
            }
        })

        return NextResponse.json({ message: 'Semester deleted successfully' })
    } catch (error) {
        console.error('Error deleting semester:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

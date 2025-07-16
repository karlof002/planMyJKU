import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const userCourses = await db.userCourse.findMany({
            where: { userId },
            include: {
                course: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(userCourses)
    } catch (error) {
        console.error('Error fetching user courses:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, courseId, status = 'planned' } = body

        const userCourse = await db.userCourse.create({
            data: {
                userId,
                courseId,
                status,
            },
            include: {
                course: true
            }
        })

        return NextResponse.json(userCourse, { status: 201 })
    } catch (error) {
        console.error('Error adding user course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
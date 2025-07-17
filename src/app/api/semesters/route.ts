import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../lib/db'

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

        const semesters = await db.semester.findMany({
            where: { userId },
            include: {
                courses: {
                    include: {
                        course: true
                    }
                }
            },
            orderBy: [
                { year: 'desc' },
                { type: 'desc' }
            ]
        })

        return NextResponse.json(semesters)
    } catch (error) {
        console.error('Error fetching semesters:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, name, year, type, isActive } = body

        // If this semester is being set as active, deactivate all others
        if (isActive) {
            await db.semester.updateMany({
                where: { userId },
                data: { isActive: false }
            })
        }

        const semester = await db.semester.create({
            data: {
                userId,
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

        return NextResponse.json(semester, { status: 201 })
    } catch (error) {
        console.error('Error creating semester:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

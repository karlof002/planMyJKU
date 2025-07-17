import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json()
        const { status, grade, ects } = body

        const userCourse = await db.userCourse.update({
            where: { id },
            data: {
                status,
                grade,
                ects,
            },
            include: {
                course: true
            }
        })

        return NextResponse.json(userCourse)
    } catch (error) {
        console.error('Error updating user course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        await db.userCourse.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Course removed successfully' })
    } catch (error) {
        console.error('Error deleting user course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

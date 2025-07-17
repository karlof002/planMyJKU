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
            }
        })

        const completedCourses = userCourses.filter((uc) => uc.status === 'completed')
        const enrolledCourses = userCourses.filter((uc) => uc.status === 'enrolled')
        const plannedCourses = userCourses.filter((uc) => uc.status === 'planned')

        const totalECTS = completedCourses.reduce((sum: number, uc) => sum + (uc.ects || uc.course.ects), 0)
        const gradesSum = completedCourses.reduce((sum: number, uc) => sum + (uc.grade || 0), 0)
        const currentGPA = completedCourses.length > 0 ? gradesSum / completedCourses.length : 0

        const stats = {
            totalCourses: userCourses.length,
            completedCourses: completedCourses.length,
            enrolledCourses: enrolledCourses.length,
            plannedCourses: plannedCourses.length,
            totalECTS,
            currentGPA: parseFloat(currentGPA.toFixed(2)),
            coursesByStatus: {
                completed: completedCourses.length,
                enrolled: enrolledCourses.length,
                planned: plannedCourses.length
            }
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Error fetching user stats:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

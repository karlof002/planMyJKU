import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { STEOP_REQUIRED_COURSES, STEOP_ALLOWED_COURSES } from '../../../lib/steop-mapping'

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const adminKey = searchParams.get('adminKey')

        // Einfacher Admin-Schutz
        if (adminKey !== 'update-steop-2025') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        let updatedSteopRequired = 0
        let updatedSteopAllowed = 0

        try {
            // Aktualisiere StEOP-Pflicht-Kurse
            for (const courseCode of STEOP_REQUIRED_COURSES) {
                const result = await db.$executeRaw`
                    UPDATE courses 
                    SET "isSteopRequired" = true 
                    WHERE "courseCode" = ${courseCode};
                `
                if (result) updatedSteopRequired++
            }

            // Aktualisiere StEOP-erlaubte Kurse
            for (const courseCode of STEOP_ALLOWED_COURSES) {
                const result = await db.$executeRaw`
                    UPDATE courses 
                    SET "isSteopAllowed" = true 
                    WHERE "courseCode" = ${courseCode};
                `
                if (result) updatedSteopAllowed++
            }

            return NextResponse.json({
                message: 'StEOP flags updated successfully',
                steopRequiredUpdated: updatedSteopRequired,
                steopAllowedUpdated: updatedSteopAllowed,
                totalSteopRequired: STEOP_REQUIRED_COURSES.length,
                totalSteopAllowed: STEOP_ALLOWED_COURSES.length
            })

        } catch (sqlError) {
            console.error('SQL Error:', sqlError)
            return NextResponse.json(
                { error: 'Database update failed', details: sqlError },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Error updating StEOP fields:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

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

        // Erstelle SQL-Statements, um StEOP-Felder hinzuzufügen
        // Da Prisma schema changes nicht direkt auf Vercel funktionieren,
        // verwenden wir Raw SQL

        try {
            // Füge die StEOP-Spalten hinzu, falls sie nicht existieren
            await db.$executeRaw`
                ALTER TABLE courses 
                ADD COLUMN IF NOT EXISTS "isSteopRequired" BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS "isSteopAllowed" BOOLEAN DEFAULT false;
            `

            // Aktualisiere StEOP-Pflicht-Kurse
            for (const courseCode of STEOP_REQUIRED_COURSES) {
                await db.$executeRaw`
                    UPDATE courses 
                    SET "isSteopRequired" = true 
                    WHERE "courseCode" = ${courseCode};
                `
            }

            // Aktualisiere StEOP-erlaubte Kurse
            for (const courseCode of STEOP_ALLOWED_COURSES) {
                await db.$executeRaw`
                    UPDATE courses 
                    SET "isSteopAllowed" = true 
                    WHERE "courseCode" = ${courseCode};
                `
            }

            return NextResponse.json({
                message: 'StEOP fields added and updated successfully',
                steopRequired: STEOP_REQUIRED_COURSES.length,
                steopAllowed: STEOP_ALLOWED_COURSES.length
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

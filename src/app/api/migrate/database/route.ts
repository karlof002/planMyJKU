import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const adminKey = searchParams.get('adminKey')

        // Einfacher Admin-Schutz
        if (adminKey !== 'migrate-database-2025') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Führe Prisma DB Push aus
        const { stdout, stderr } = await execAsync('npx prisma db push --force-reset')

        return NextResponse.json({
            message: 'Database migration completed',
            stdout,
            stderr: stderr || 'No errors'
        })

    } catch (error) {
        console.error('Error running migration:', error)
        return NextResponse.json(
            { error: 'Migration failed', details: error },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { verificationSchema } from '../../../lib/validations'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, code } = verificationSchema.parse(body)

        // Find verification record
        const verification = await db.emailVerification.findUnique({
            where: { email }
        })

        if (!verification) {
            return NextResponse.json(
                { error: 'No verification code found for this email' },
                { status: 400 }
            )
        }

        // Check if code is expired
        if (verification.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Verification code has expired' },
                { status: 400 }
            )
        }

        // Check if code matches
        if (verification.code !== code) {
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            )
        }

        // Update user as verified
        const user = await db.user.update({
            where: { email },
            data: { isVerified: true },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                studentId: true,
                isVerified: true,
            }
        })

        // Delete verification record
        await db.emailVerification.delete({
            where: { email }
        })

        return NextResponse.json(
            { message: 'Email verified successfully', user },
            { status: 200 }
        )
    } catch (error) {
        console.error('Verification error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '../../../lib/db'
import { registerSchema } from '../../../lib/validations'
import { sendVerificationEmail } from '../../../lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { firstName, lastName, email, password, studentId } = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        // Create user (unverified)
        const user = await db.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                studentId: studentId || null,
                isVerified: false,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                studentId: true,
            }
        })

        // Store verification code
        await db.emailVerification.upsert({
            where: { email },
            update: {
                code: verificationCode,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            },
            create: {
                email,
                code: verificationCode,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            },
        })

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationCode)

        if (!emailResult.success) {
            // If email fails, still return success but log the error
            console.error('Failed to send verification email:', emailResult.error)
        }

        return NextResponse.json(
            {
                message: 'User created successfully. Please check your email for verification code.',
                user,
                needsVerification: true
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
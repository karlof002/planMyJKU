import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '../../../lib/db'
import { registerSchema } from '../../../lib/validations'

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

        // Create user
        const user = await db.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                studentId: studentId || null,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                studentId: true,
            }
        })

        return NextResponse.json(
            { message: 'User created successfully', user },
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
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const activityTypes = await db.activityType.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(activityTypes);
    } catch (error) {
        console.error('Error fetching activity types:', error);
        return NextResponse.json({ error: 'Failed to fetch activity types' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, name, color } = body;

        if (!userId || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const activityType = await db.activityType.create({
            data: {
                userId,
                name,
                color: color || '#3b82f6'
            }
        });

        return NextResponse.json(activityType, { status: 201 });
    } catch (error) {
        console.error('Error creating activity type:', error);
        return NextResponse.json({ error: 'Failed to create activity type' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Activity type ID is required' }, { status: 400 });
        }

        await db.activityType.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Activity type deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity type:', error);
        return NextResponse.json({ error: 'Failed to delete activity type' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, color } = body;

        if (!id || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const activityType = await db.activityType.update({
            where: { id },
            data: {
                name,
                color: color || '#3b82f6'
            }
        });

        return NextResponse.json(activityType);
    } catch (error) {
        console.error('Error updating activity type:', error);
        return NextResponse.json({ error: 'Failed to update activity type' }, { status: 500 });
    }
}

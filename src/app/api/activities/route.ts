import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const activities = await db.activity.findMany({
            where: { userId },
            orderBy: { startTime: 'asc' }
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, title, description, startTime, endTime, type, color } = body;

        if (!userId || !title || !startTime || !endTime || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const activity = await db.activity.create({
            data: {
                userId,
                title,
                description: description || '',
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                type,
                color: color || '#3b82f6'
            }
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
        }

        const { title, description, startTime, endTime, type, color } = body;

        if (!title || !startTime || !endTime || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const activity = await db.activity.update({
            where: { id },
            data: {
                title,
                description: description || '',
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                type,
                color: color || '#3b82f6'
            }
        });

        return NextResponse.json(activity);
    } catch (error) {
        console.error('Error updating activity:', error);
        return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
        }

        await db.activity.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
    }
}

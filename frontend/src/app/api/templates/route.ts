import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const templates = await db.template.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, name, title, description, type, color } = body;

        if (!userId || !name || !title || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const template = await db.template.create({
            data: {
                userId,
                name,
                title,
                description: description || '',
                type,
                color: color || '#3b82f6'
            }
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
        }

        await db.template.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
    }
}

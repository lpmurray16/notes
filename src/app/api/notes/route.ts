import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all notes for the authenticated user
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		console.log('Session from get all notes', session);

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const client = await clientPromise;
		const db = client.db();

		const notes = await db.collection('notes').find({ userId: session?.user?.id }).sort({ updatedAt: -1 }).toArray();

		return NextResponse.json(notes);
	} catch (error) {
		console.error('Error fetching notes:', error);
		return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
	}
}

// POST create a new note
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		console.log('Session from creating new note:', session);

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { title, content } = await request.json();

		if (!title || !content) {
			return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
		}

		const client = await clientPromise;
		const db = client.db();

		const newNote = {
			title,
			content,
			userId: session.user.id,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await db.collection('notes').insertOne(newNote);

		return NextResponse.json({
			id: result.insertedId,
			...newNote,
		});
	} catch (error) {
		console.error('Error creating note:', error);
		return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
	}
}

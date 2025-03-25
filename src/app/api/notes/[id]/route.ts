import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

// GET a single note by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession();

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = params.id;

		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
		}

		const client = await clientPromise;
		const db = client.db();

		const note = await db.collection('notes').findOne({
			_id: new ObjectId(id),
			userId: session.user.id,
		});

		if (!note) {
			return NextResponse.json({ error: 'Note not found' }, { status: 404 });
		}

		return NextResponse.json({
			id: note._id,
			title: note.title,
			content: note.content,
			createdAt: note.createdAt,
			updatedAt: note.updatedAt,
		});
	} catch (error) {
		console.error('Error fetching note:', error);
		return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
	}
}

// PUT update a note by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession();

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = params.id;

		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
		}

		const { title, content } = await request.json();

		if (!title || !content) {
			return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
		}

		const client = await clientPromise;
		const db = client.db();

		const updatedNote = {
			title,
			content,
			updatedAt: new Date(),
		};

		const result = await db.collection('notes').updateOne(
			{
				_id: new ObjectId(id),
				userId: session.user.id,
			},
			{ $set: updatedNote }
		);

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'Note not found' }, { status: 404 });
		}

		return NextResponse.json({
			id,
			...updatedNote,
		});
	} catch (error) {
		console.error('Error updating note:', error);
		return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
	}
}

// DELETE a note by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession();

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = params.id;

		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
		}

		const client = await clientPromise;
		const db = client.db();

		const result = await db.collection('notes').deleteOne({
			_id: new ObjectId(id),
			userId: session.user.id,
		});

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Note not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting note:', error);
		return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
	}
}

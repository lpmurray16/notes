'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Note {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
}

export default function NotePage({ params }: { params: { id: string } }) {
	// Unwrap params using React.use()
	const unwrappedParams = use(params);
	const { status } = useSession();
	const router = useRouter();
	const [note, setNote] = useState<Note | null>(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Redirect to sign in if not authenticated
	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/auth/signin');
		}
	}, [status, router]);

	useEffect(() => {
		const fetchNote = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const response = await fetch(`/api/notes/${unwrappedParams.id}`);

				if (!response.ok) {
					if (response.status === 404) {
						throw new Error('Note not found');
					}
					throw new Error('Failed to fetch note');
				}

				const fetchedNote = await response.json();
				setNote(fetchedNote);
				setTitle(fetchedNote.title);
				setContent(fetchedNote.content);
			} catch (err) {
				console.error('Error fetching note:', err);
				setError(err instanceof Error ? err.message : 'Failed to load note');
			} finally {
				setIsLoading(false);
			}
		};

		fetchNote();
	}, [unwrappedParams.id]);

	const handleSave = async () => {
		if (!note) return;

		setIsSaving(true);

		try {
			const response = await fetch(`/api/notes/${params.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, content }),
			});

			if (!response.ok) {
				throw new Error('Failed to update note');
			}

			const updatedNote = await response.json();
			setNote({
				...note,
				title,
				content,
				updatedAt: updatedNote.updatedAt || new Date().toISOString(),
			});
			setIsEditing(false);
		} catch (err) {
			console.error('Error updating note:', err);
			alert('Failed to update note. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!note) return;

		if (!confirm('Are you sure you want to delete this note?')) return;

		try {
			const response = await fetch(`/api/notes/${params.id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete note');
			}

			router.push('/notes');
		} catch (err) {
			console.error('Error deleting note:', err);
			alert('Failed to delete note. Please try again.');
		}
	};

	if (!note) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-foreground/60 mb-4">Note not found</p>
					<Link
						href="/notes"
						className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
					>
						Back to Notes
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-foreground/10 p-4">
				<div className="max-w-3xl mx-auto flex justify-between items-center">
					<Link href="/notes" className="text-foreground/70 hover:text-foreground flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M19 12H5"></path>
							<path d="M12 19l-7-7 7-7"></path>
						</svg>
						<span>Back to Notes</span>
					</Link>
					<div className="flex items-center gap-2">
						{isEditing ? (
							<>
								<button
									onClick={() => setIsEditing(false)}
									className="rounded-full bg-foreground/10 text-foreground px-4 py-2 hover:bg-foreground/20 transition-colors"
									disabled={isSaving}
								>
									Cancel
								</button>
								<button
									onClick={handleSave}
									disabled={isSaving || !title.trim()}
									className="rounded-full bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSaving ? 'Saving...' : 'Save'}
								</button>
							</>
						) : (
							<>
								<button
									onClick={handleDelete}
									className="rounded-full bg-red-500/10 text-red-500 px-4 py-2 hover:bg-red-500/20 transition-colors"
								>
									Delete
								</button>
								<button
									onClick={() => setIsEditing(true)}
									className="rounded-full bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
								>
									Edit
								</button>
							</>
						)}
					</div>
				</div>
			</header>

			<main className="max-w-3xl mx-auto p-4 pt-8">
				{isEditing ? (
					<div className="space-y-6">
						<div>
							<input
								type="text"
								placeholder="Title"
								className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-foreground/30"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div>
							<textarea
								placeholder="Start writing..."
								className="w-full h-[calc(100vh-200px)] bg-transparent border-none focus:outline-none focus:ring-0 placeholder-foreground/30 resize-none"
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
						</div>
					</div>
				) : (
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">{note.title}</h1>
						<div className="text-xs text-foreground/50">Updated {new Date(note.updatedAt).toLocaleString()}</div>
						<div className="whitespace-pre-wrap">{note.content}</div>
					</div>
				)}
			</main>
		</div>
	);
}

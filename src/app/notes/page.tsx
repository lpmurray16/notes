'use client';

import { useState, useEffect } from 'react';
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
}

export default function NotesPage() {
	const { status } = useSession();
	const router = useRouter();
	const [notes, setNotes] = useState<Note[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Redirect to sign in if not authenticated
	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/auth/signin');
		}
	}, [status, router]);

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch('/api/notes');

				if (!response.ok) {
					throw new Error('Failed to fetch notes');
				}

				const data = await response.json();
				setNotes(data);
			} catch (err) {
				console.error('Error fetching notes:', err);
				setError('Failed to load notes. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchNotes();
	}, []);

	const filteredNotes = notes.filter(
		(note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="max-w-5xl mx-auto p-4 pt-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Your Notes</h1>
					<div className="flex items-center gap-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Search notes..."
								className="px-4 py-2 rounded-full bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20 w-full"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							{searchTerm && (
								<button
									className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
									onClick={() => setSearchTerm('')}
								>
									✕
								</button>
							)}
						</div>
						<Link href="/notes/new" className="rounded-full bg-foreground text-background p-2 hover:bg-foreground/90 transition-colors">
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
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
						</Link>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-12">
						<p className="text-foreground/60">Loading notes...</p>
					</div>
				) : error ? (
					<div className="text-center py-12">
						<p className="text-red-500 mb-4">{error}</p>
						<Link
							href="/notes/new"
							className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
						>
							Try creating a new note
						</Link>
					</div>
				) : filteredNotes.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-foreground/60 mb-4">No notes found</p>
						<Link
							href="/notes/new"
							className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							Create a new note
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredNotes.map((note) => (
							<Link key={note._id} href={`/notes/${note._id}`}>
								<div className="border border-foreground/10 rounded-lg p-4 h-full hover:border-foreground/30 transition-colors">
									<h2 className="text-lg font-semibold mb-2 line-clamp-1">{note.title}</h2>
									<p className="text-foreground/70 text-sm line-clamp-4">{note.content}</p>
									<div className="mt-4 text-xs text-foreground/50">Updated {new Date(note.updatedAt).toLocaleDateString()}</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

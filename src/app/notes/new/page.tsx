'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NewNotePage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	// Redirect to sign in if not authenticated
	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/auth/signin');
		}
	}, [status, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);

		try {
			const response = await fetch('/api/notes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, content }),
			});

			if (!response.ok) {
				throw new Error('Failed to create note');
			}

			// Redirect back to notes list
			router.push('/notes');
		} catch (err) {
			console.error('Error creating note:', err);
			alert('Failed to create note. Please try again.');
			setIsSaving(false);
		}
	};

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
					<button
						type="submit"
						form="note-form"
						disabled={isSaving || !title.trim()}
						className="rounded-full bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSaving ? 'Saving...' : 'Save'}
					</button>
				</div>
			</header>

			<main className="max-w-3xl mx-auto p-4 pt-8">
				<form id="note-form" onSubmit={handleSubmit} className="space-y-6">
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
				</form>
			</main>
		</div>
	);
}

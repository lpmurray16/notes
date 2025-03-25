'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
	const router = useRouter();
	const { status } = useSession();

	useEffect(() => {
		// Redirect to notes page
		if (status === 'authenticated') {
			router.push('/notes');
		} else if (status === 'unauthenticated') {
			router.push('/auth/signin');
		}
		// Don't redirect if status is 'loading' - wait for authentication check to complete
	}, [status, router]);

	// Return a minimal loading state while redirecting
	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center">
				<p className="text-foreground/60 mb-4">Redirecting to Notes app...</p>
			</div>
		</div>
	);
}

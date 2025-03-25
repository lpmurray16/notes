'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
	const { data: session, status } = useSession();
	const isLoading = status === 'loading';

	return (
		<nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-foreground/10 p-4">
			<div className="max-w-5xl mx-auto flex justify-between items-center">
				<Link href="/notes" className="text-2xl font-bold">
					Notes
				</Link>
				<div className="flex items-center gap-4">
					{isLoading ? (
						<div className="text-sm text-foreground/50">Loading...</div>
					) : session ? (
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 text-sm">
									<span className="text-foreground/50 mr-2">Signed in as</span>
									<div className="relative w-8 h-8 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center">
										{session.user?.image ? (
											<Image src={session.user.image} alt="User profile" width={32} height={32} className="object-cover" />
										) : (
											<Image src="/user.svg" alt="User profile" width={20} height={20} className="text-foreground" />
										)}
									</div>
									<span className="font-medium">{session.user?.name || session.user?.email}</span>
							</div>
							<button
								onClick={() => signOut({ callbackUrl: '/' })}
								className="text-sm rounded-full bg-foreground/10 text-foreground px-4 py-2 hover:bg-foreground/20 transition-colors"
							>
								Sign out
							</button>
						</div>
					) : (
						<button
							onClick={() => signIn()}
							className="text-sm rounded-full bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
						>
							Sign in
						</button>
					)}
				</div>
			</div>
		</nav>
	);
}

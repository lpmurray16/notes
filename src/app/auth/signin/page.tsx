'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccessMessage('');

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				setError('Invalid email or password');
				setIsLoading(false);
				return;
			}

			// Redirect to notes page on successful login
			router.push('/notes');
		} catch (err) {
			console.error('Sign in error:', err);
			setError('An error occurred during sign in');
			setIsLoading(false);
		}
	};

	// Check for registered=true in URL when component mounts
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.get('registered') === 'true') {
			setSuccessMessage('Account created successfully! Please sign in.');
		}
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-8 p-8 border border-foreground/10 rounded-lg">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Sign in to Notes</h1>
					<p className="mt-2 text-foreground/70">Access your notes from anywhere</p>
				</div>

				{error && <div className="p-3 bg-red-500/10 text-red-500 rounded-md text-sm">{error}</div>}
				{successMessage && <div className="p-3 bg-green-500/10 text-green-500 rounded-md text-sm">{successMessage}</div>}

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-1">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-foreground/70 mb-1">
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
							placeholder="password"
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-2 px-4 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>
				</form>

				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-foreground/10"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-background text-foreground/50">Or continue with</span>
						</div>
					</div>

					<div className="mt-6">
						<button
							onClick={() => signIn('google', { callbackUrl: '/notes' })}
							className="w-full py-2 px-4 rounded-md border border-foreground/20 bg-background hover:bg-foreground/5 transition-colors flex items-center justify-center gap-2"
						>
							<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
								<g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
									<path
										fill="currentColor"
										d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
									/>
									<path
										fill="currentColor"
										d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
									/>
									<path
										fill="currentColor"
										d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
									/>
									<path
										fill="currentColor"
										d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
									/>
								</g>
							</svg>
							Sign in with Google
						</button>
					</div>
				</div>

				<div className="mt-6 text-center text-sm">
					<p>
						Don&apos;t have an account?{' '}
						<Link href="/auth/signup" className="text-foreground hover:underline">
							Sign up
						</Link>
					</p>
				</div>

				<div className="mt-6 text-center text-sm">
					<Link href="/" className="text-foreground/70 hover:text-foreground">
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}

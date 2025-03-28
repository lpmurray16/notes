'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Basic validation
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long');
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Registration failed');
			}

			// Redirect to sign-in page on successful registration
			router.push('/auth/signin?registered=true');
		} catch (err: any) {
			console.error('Sign up error:', err);
			setError(err.message || 'An error occurred during registration');
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-8 p-8 border border-foreground/10 rounded-lg">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Create an account</h1>
					<p className="mt-2 text-foreground/70">Sign up to start creating notes</p>
				</div>

				{error && <div className="p-3 bg-red-500/10 text-red-500 rounded-md text-sm">{error}</div>}

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-1">
							Name (optional)
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-4 py-2 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
							placeholder="Your name"
						/>
					</div>

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
							placeholder="At least 6 characters"
						/>
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/70 mb-1">
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="w-full px-4 py-2 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
							placeholder="Confirm your password"
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-2 px-4 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Creating account...' : 'Sign up'}
						</button>
					</div>
				</form>

				<div className="mt-6 text-center text-sm">
					<p>
						Already have an account?{' '}
						<Link href="/auth/signin" className="text-foreground hover:underline">
							Sign in
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

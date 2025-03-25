import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				// This is a simplified example. In a real app, you would:
				// 1. Validate credentials against your database
				// 2. Return user data if valid, null if invalid
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				// For demo purposes, accept any email with password "password"
				if (credentials.password === 'password') {
					return {
						id: '1',
						name: 'Demo User',
						email: credentials.email,
					};
				}

				return null;
			},
		}),
	],
	adapter: MongoDBAdapter(clientPromise),
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async session({ session, token }) {
			// Add user ID to session
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
});

export { handler as GET, handler as POST };

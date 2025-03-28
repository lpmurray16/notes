import NextAuth, { AuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const authOptions: AuthOptions = {
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
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					// Connect to MongoDB
					await mongoose.connect(process.env.MONGODB_URI as string);

					// Find user by email
					const user = await User.findOne({ email: credentials.email });

					// If user doesn't exist or password doesn't match
					if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
						return null;
					}

					// Return user object (without password)
					return {
						id: user._id.toString(),
						name: user.name || 'User',
						email: user.email,
					};
				} catch (error) {
					console.error('Auth error:', error);
					return null;
				}
			},
		}),
	],
	adapter: MongoDBAdapter(clientPromise),
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			// Persist the user ID to the token right after signin
			if (user) {
				// Use user.id if available (AdapterUser), otherwise try to use MongoDB's _id if it exists
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				token.sub = user.id || (user as any)._id?.toString();
			}
			return token;
		},
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

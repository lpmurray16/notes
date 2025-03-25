# Authentication Setup Guide

## Overview

This application uses NextAuth.js for authentication with the following providers:

-   Google OAuth (for social login)
-   Credentials (email/password)

## Setup Instructions

### 1. Environment Variables

Copy the `example.env.local` file to `.env.local` and fill in the required values:

```bash
cp example.env.local .env.local
```

Then edit `.env.local` with your actual values:

-   `MONGODB_URI`: Your MongoDB connection string
-   `NEXTAUTH_SECRET`: A secret key for NextAuth.js (generate with `openssl rand -base64 32`)
-   `NEXTAUTH_URL`: The base URL of your application (use `http://localhost:3000` for local development)
-   `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Obtain these from the [Google Cloud Console](https://console.cloud.google.com/)

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add authorized JavaScript origins: `http://localhost:3000`
7. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Click "Create" and copy the Client ID and Client Secret to your `.env.local` file

### 3. Testing Credentials Provider

For development purposes, the Credentials provider is configured to accept any email with the password "password". In a production environment, you should implement proper user authentication against your database.

## Usage

### Authentication Status

You can check if a user is authenticated using the `useSession` hook from NextAuth.js:

```jsx
import { useSession } from 'next-auth/react';

function MyComponent() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	if (status === 'unauthenticated') {
		return <p>Not signed in</p>;
	}

	return <p>Signed in as {session.user.email}</p>;
}
```

### Sign In/Out

Use the `signIn` and `signOut` functions from NextAuth.js:

```jsx
import { signIn, signOut } from 'next-auth/react';

// Sign in with Google
<button onClick={() => signIn('google')}>Sign in with Google</button>

// Sign in with credentials
<button onClick={() => signIn('credentials', { email, password })}>Sign in</button>

// Sign out
<button onClick={() => signOut()}>Sign out</button>
```

## Security Considerations

-   Always keep your `.env.local` file secure and never commit it to version control
-   In production, use a strong, unique `NEXTAUTH_SECRET`
-   Implement proper validation for the Credentials provider
-   Consider adding rate limiting to prevent brute force attacks

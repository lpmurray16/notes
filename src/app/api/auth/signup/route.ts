import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		// Validate input
		if (!email || !password) {
			return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
		}

		if (password.length < 6) {
			return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
		}

		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI as string);

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create new user
		const user = new User({
			name: name || '',
			email,
			password: hashedPassword,
		});

		// Save user to database
		await user.save();

		// Return success response (without password)
		return NextResponse.json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error: any) {
		console.error('Registration error:', error);

		// Handle duplicate key error (if MongoDB unique index catches it)
		if (error.code === 11000) {
			return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
		}

		return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
	}
}

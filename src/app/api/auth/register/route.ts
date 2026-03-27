export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { createToken } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    const { email, name, phone, password } = await request.json();

    if (!email || !name || !phone || !password) {
      return NextResponse.json(
        { message: 'All fields are required: email, name, phone, and password.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const existing = db.findUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const user = db.createUser({
      email,
      name,
      phone,
      password,
      role: 'customer',
    });

    const token = createToken(user);

    return NextResponse.json({ user, token }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { createToken } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const user = db.findUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const { password: _password, ...safeUser } = user;
    const token = createToken(safeUser);

    return NextResponse.json({ user: safeUser, token });
  } catch {
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

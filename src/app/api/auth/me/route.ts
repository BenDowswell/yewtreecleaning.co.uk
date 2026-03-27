import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorised. Please log in.' },
      { status: 401 }
    );
  }

  return NextResponse.json(user);
}

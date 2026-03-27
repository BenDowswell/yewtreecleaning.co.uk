export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { getUserFromRequest } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorised. Please log in.' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { message: 'Only administrators can view the customer list.' },
      { status: 403 }
    );
  }

  const db = getDatabase();
  const customers = db.getAllCustomers();

  return NextResponse.json(customers);
}

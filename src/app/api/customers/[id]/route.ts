export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { getUserFromRequest } from '@/lib/auth-helpers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorised. Please log in.' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { message: 'Only administrators can view customer profiles.' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const db = getDatabase();
  const customer = db.getCustomerById(id);

  if (!customer) {
    return NextResponse.json(
      { message: 'Customer not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json(customer);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorised. Please log in.' },
      { status: 401 }
    );
  }

  const { id } = await params;

  // Admin can update any customer; customers can only update themselves
  if (user.role !== 'admin' && user.id !== id) {
    return NextResponse.json(
      { message: 'You do not have permission to update this profile.' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const db = getDatabase();
  const updated = db.updateCustomer(id, body);

  if (!updated) {
    return NextResponse.json(
      { message: 'Customer not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

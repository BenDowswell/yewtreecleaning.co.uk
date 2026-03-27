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

  const { id } = await params;
  const db = getDatabase();
  const message = db.getMessageById(id);

  if (!message) {
    return NextResponse.json(
      { message: 'Message not found.' },
      { status: 404 }
    );
  }

  if (user.role !== 'admin' && message.customerId !== user.id) {
    return NextResponse.json(
      { message: 'You do not have permission to view this message.' },
      { status: 403 }
    );
  }

  return NextResponse.json(message);
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
  const db = getDatabase();
  const message = db.getMessageById(id);

  if (!message) {
    return NextResponse.json(
      { message: 'Message not found.' },
      { status: 404 }
    );
  }

  if (user.role !== 'admin' && message.customerId !== user.id) {
    return NextResponse.json(
      { message: 'You do not have permission to update this message.' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const updated = db.updateMessage(id, { read: body.read ?? true });

  return NextResponse.json(updated);
}

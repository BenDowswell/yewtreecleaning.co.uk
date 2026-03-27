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

  const db = getDatabase();

  const messages =
    user.role === 'admin'
      ? db.getAllMessages()
      : db.getMessagesByCustomer(user.id);

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorised. Please log in.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.subject || !body.body) {
      return NextResponse.json(
        { message: 'Subject and body are required.' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    const message = db.createMessage({
      customerId: body.customerId || user.id,
      customerName: body.customerName || user.name,
      customerEmail: body.customerEmail || user.email,
      subject: body.subject,
      body: body.body,
      direction: body.direction || (user.role === 'admin' ? 'outbound' : 'inbound'),
      read: false,
    });

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

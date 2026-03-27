export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Name, email, subject, and message are required.' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if the sender is an existing customer
    const existingUser = db.findUserByEmail(email);
    const customerId = existingUser?.id || 'guest';
    const customerName = existingUser?.name || name;

    db.createMessage({
      customerId,
      customerName,
      customerEmail: email,
      subject,
      body: `${message}${phone ? `\n\nPhone: ${phone}` : ''}`,
      direction: 'inbound',
      read: false,
    });

    return NextResponse.json({
      success: true,
      message:
        'Thank you for your message. We will get back to you within 24 hours.',
    });
  } catch {
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

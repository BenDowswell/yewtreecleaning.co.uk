export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { sendEmail, field } from '@/lib/email';
import { BUSINESS_PHONE } from '@/lib/constants';

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

    const emailResult = await sendEmail({
      subject: `Website enquiry: ${subject}`,
      replyTo: email,
      body: [
        `New enquiry from the website contact form.`,
        [
          field('Name', name),
          field('Email', email),
          field('Phone', phone),
          field('Subject', subject),
        ].join('\n'),
        `Message:\n${message}`,
      ].join('\n\n'),
    });

    // The email is the only durable record of the enquiry, so if it could not
    // be sent we must not tell the customer their message got through.
    if (!emailResult.ok) {
      return NextResponse.json(
        {
          message: `We could not send your message just now. Please call us on ${BUSINESS_PHONE} and we will help straight away.`,
        },
        { status: 502 }
      );
    }

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

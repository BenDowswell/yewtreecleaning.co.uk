export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { HOURLY_RATE, BUSINESS_PHONE } from '@/lib/constants';
import { services } from '@/domain/service/data';
import { sendEmail, field } from '@/lib/email';
import type { BookingFrequency } from '@/domain/booking/types';

const FREQUENCY_LABELS: Record<BookingFrequency, string> = {
  'one-off': 'One-off clean',
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
};

export async function GET(request: Request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorised. Please log in.' },
      { status: 401 }
    );
  }

  const db = getDatabase();

  const bookings =
    user.role === 'admin'
      ? db.getAllBookings()
      : db.getBookingsByCustomer(user.id);

  return NextResponse.json(bookings);
}

/**
 * Booking requests come from the public booking wizard, so this endpoint is
 * deliberately unauthenticated — customers are not asked to create an account.
 * If the request does carry a valid token we attribute the booking to that
 * user, otherwise it is recorded as a guest.
 */
export async function POST(request: Request) {
  const user = getUserFromRequest(request);

  try {
    const body = await request.json();

    const {
      serviceId,
      preferredDate,
      preferredTime,
      frequency,
      estimatedHours,
      customerName,
      email,
      phone,
      address,
      postcode,
      notes,
    } = body;

    if (
      !serviceId ||
      !preferredDate ||
      !preferredTime ||
      !estimatedHours ||
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !postcode
    ) {
      return NextResponse.json(
        { message: 'Missing required booking fields.' },
        { status: 400 }
      );
    }

    // Resolve the service and price server-side rather than trusting the client.
    const service = services.find((s) => s.id === serviceId);

    if (!service) {
      return NextResponse.json(
        { message: 'Unknown service selected.' },
        { status: 400 }
      );
    }

    const hours = Number(estimatedHours);

    if (!Number.isFinite(hours) || hours <= 0) {
      return NextResponse.json(
        { message: 'Invalid number of hours.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const totalPrice = hours * HOURLY_RATE;

    const booking = db.createBooking({
      customerId: user?.id ?? 'guest',
      customerName,
      customerEmail: email,
      customerPhone: phone,
      serviceId: service.id,
      serviceName: service.name,
      date: preferredDate,
      startTime: preferredTime,
      frequency,
      estimatedHours: hours,
      address: {
        line1: address,
        town: '',
        postcode,
      },
      specialRequirements: notes || undefined,
      status: 'pending',
      totalPrice,
    });

    const emailResult = await sendEmail({
      subject: `New booking request: ${service.name} on ${preferredDate}`,
      replyTo: email,
      body: [
        'A new booking request has come in from the website.',
        [
          field('Service', service.name),
          field('Date', preferredDate),
          field('Time', preferredTime),
          field(
            'Frequency',
            frequency ? FREQUENCY_LABELS[frequency as BookingFrequency] : null,
          ),
          field('Estimated hours', hours),
          field('Estimated cost', `£${totalPrice.toFixed(2)}`),
        ].join('\n'),
        [
          field('Name', customerName),
          field('Email', email),
          field('Phone', phone),
          field('Address', address),
          field('Postcode', postcode),
        ].join('\n'),
        `Notes:\n${notes || '—'}`,
        'This is a request, not a confirmed booking. Contact the customer to confirm.',
      ].join('\n\n'),
    });

    // The email is how the booking actually reaches us, so a send failure has
    // to surface to the customer rather than showing a false confirmation.
    if (!emailResult.ok) {
      return NextResponse.json(
        {
          message: `We could not submit your booking request just now. Please call us on ${BUSINESS_PHONE} and we will book you in.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

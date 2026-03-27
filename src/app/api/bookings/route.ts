import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { HOURLY_RATE } from '@/lib/constants';

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

    if (!body.serviceId || !body.date || !body.startTime || !body.estimatedHours || !body.address) {
      return NextResponse.json(
        { message: 'Missing required booking fields.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const totalPrice = body.estimatedHours * HOURLY_RATE;

    const booking = db.createBooking({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      serviceId: body.serviceId,
      serviceName: body.serviceName || 'Cleaning Service',
      date: body.date,
      startTime: body.startTime,
      estimatedHours: body.estimatedHours,
      address: body.address,
      specialRequirements: body.specialRequirements,
      status: 'pending',
      totalPrice,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

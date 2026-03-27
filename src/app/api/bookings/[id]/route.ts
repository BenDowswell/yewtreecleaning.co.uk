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
  const booking = db.getBookingById(id);

  if (!booking) {
    return NextResponse.json(
      { message: 'Booking not found.' },
      { status: 404 }
    );
  }

  if (user.role !== 'admin' && booking.customerId !== user.id) {
    return NextResponse.json(
      { message: 'You do not have permission to view this booking.' },
      { status: 403 }
    );
  }

  return NextResponse.json(booking);
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
  const booking = db.getBookingById(id);

  if (!booking) {
    return NextResponse.json(
      { message: 'Booking not found.' },
      { status: 404 }
    );
  }

  const body = await request.json();

  // Admin can update status and admin notes
  if (user.role === 'admin') {
    const updated = db.updateBooking(id, {
      ...(body.status && { status: body.status }),
      ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
    });
    return NextResponse.json(updated);
  }

  // Customer can only cancel their own pending or confirmed bookings
  if (booking.customerId !== user.id) {
    return NextResponse.json(
      { message: 'You do not have permission to update this booking.' },
      { status: 403 }
    );
  }

  if (body.status === 'cancelled') {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return NextResponse.json(
        { message: 'Only pending or confirmed bookings can be cancelled.' },
        { status: 400 }
      );
    }

    const updated = db.updateBooking(id, { status: 'cancelled' });
    return NextResponse.json(updated);
  }

  return NextResponse.json(
    { message: 'Customers may only cancel bookings.' },
    { status: 403 }
  );
}

export async function DELETE(
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
      { message: 'Only administrators can delete bookings.' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const db = getDatabase();
  const deleted = db.deleteBooking(id);

  if (!deleted) {
    return NextResponse.json(
      { message: 'Booking not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mock-db';
import { getUserFromRequest } from '@/lib/auth-helpers';
import type { DayAvailability, TimeSlot } from '@/domain/availability/types';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function generateDefaultSlots(): TimeSlot[] {
  return [
    { start: '09:00', end: '11:00', available: true },
    { start: '11:00', end: '13:00', available: true },
    { start: '13:00', end: '15:00', available: true },
    { start: '15:00', end: '17:00', available: true },
  ];
}

function generateAvailability(db: ReturnType<typeof getDatabase>): DayAvailability[] {
  const days: DayAvailability[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = DAY_NAMES[date.getDay()];

    // Check if we have stored availability for this date
    const stored = db.availability.get(dateStr);
    if (stored) {
      days.push(stored);
      continue;
    }

    // Weekends are not available by default
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const slots = isWeekend
      ? generateDefaultSlots().map((s) => ({ ...s, available: false }))
      : generateDefaultSlots();

    days.push({
      date: dateStr,
      dayOfWeek,
      slots,
      isFullyBooked: slots.every((s) => !s.available),
    });
  }

  return days;
}

export async function GET() {
  const db = getDatabase();
  const availability = generateAvailability(db);
  return NextResponse.json(availability);
}

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorised. Please log in.' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { message: 'Only administrators can update availability.' },
      { status: 403 }
    );
  }

  try {
    const data: DayAvailability[] = await request.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: 'Request body must be an array of day availability objects.' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    for (const day of data) {
      if (!day.date || !day.slots) continue;

      const isFullyBooked = day.slots.every((s: TimeSlot) => !s.available);
      db.availability.set(day.date, {
        ...day,
        isFullyBooked,
      });
    }

    const availability = generateAvailability(db);
    return NextResponse.json(availability);
  } catch {
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

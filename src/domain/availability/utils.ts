import type { TimeSlot, DayAvailability } from './types';

const DEFAULT_START = '09:00';
const DEFAULT_END = '17:00';
const SLOT_DURATION_MINUTES = 60;

interface DaySchedule {
  start: string;
  end: string;
}

interface WeeklySchedule {
  monday: DaySchedule | null;
  tuesday: DaySchedule | null;
  wednesday: DaySchedule | null;
  thursday: DaySchedule | null;
  friday: DaySchedule | null;
  saturday: null;
  sunday: null;
}

/**
 * Returns the default weekly schedule for the business.
 * Monday to Friday, 9am to 5pm. Saturday and Sunday are closed.
 */
export function getDefaultWeeklySchedule(): WeeklySchedule {
  const workday: DaySchedule = { start: DEFAULT_START, end: DEFAULT_END };
  return {
    monday: { ...workday },
    tuesday: { ...workday },
    wednesday: { ...workday },
    thursday: { ...workday },
    friday: { ...workday },
    saturday: null,
    sunday: null,
  };
}

/**
 * Check whether a given date falls on a business day (Monday\u2013Friday).
 */
export function isBusinessDay(date: string): boolean {
  const day = new Date(date).getDay();
  return day >= 1 && day <= 5;
}

/**
 * Generate hourly time slots for a given date.
 * Returns an empty array if the date is not a business day.
 */
export function getAvailableSlots(date: string): TimeSlot[] {
  if (!isBusinessDay(date)) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const [startHour] = DEFAULT_START.split(':').map(Number);
  const [endHour] = DEFAULT_END.split(':').map(Number);

  for (let hour = startHour; hour < endHour; hour += SLOT_DURATION_MINUTES / 60) {
    const start = `${String(hour).padStart(2, '0')}:00`;
    const nextHour = hour + SLOT_DURATION_MINUTES / 60;
    const end = `${String(nextHour).padStart(2, '0')}:00`;

    slots.push({
      start,
      end,
      available: true,
    });
  }

  return slots;
}

/**
 * Build a full DayAvailability object for a given date.
 */
export function getDayAvailability(date: string): DayAvailability {
  const slots = getAvailableSlots(date);
  const d = new Date(date);
  const dayOfWeek = d.toLocaleDateString('en-GB', { weekday: 'long' });

  return {
    date,
    dayOfWeek,
    slots,
    isFullyBooked: slots.length > 0 && slots.every((s) => !s.available),
  };
}

import { HOURLY_RATE, MINIMUM_HOURS } from '../../lib/constants';

/**
 * Calculate the total price for a booking based on the number of hours.
 * Enforces the minimum hours policy.
 */
export function calculatePrice(hours: number): number {
  const billableHours = Math.max(hours, MINIMUM_HOURS);
  return billableHours * HOURLY_RATE;
}

/**
 * Check whether the requested date meets the 24-hour minimum notice requirement.
 * Returns true if the date is at least 24 hours from now.
 */
export function isMinimumNotice(date: string): boolean {
  const requested = new Date(date);
  const now = new Date();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  return requested.getTime() - now.getTime() >= twentyFourHoursMs;
}

/**
 * Format a date string into a human-readable British format.
 * e.g. "Monday 15 January 2026"
 */
export function formatBookingDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Get the next available business day (Monday\u2013Friday), at least 24 hours from now.
 * Returns an ISO date string (YYYY-MM-DD).
 */
export function getNextAvailableDate(): string {
  const now = new Date();
  const candidate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Advance past weekends
  while (candidate.getDay() === 0 || candidate.getDay() === 6) {
    candidate.setDate(candidate.getDate() + 1);
  }

  return candidate.toISOString().split('T')[0];
}

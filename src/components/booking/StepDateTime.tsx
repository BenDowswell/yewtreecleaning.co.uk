'use client';

import { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { HOURLY_RATE, BUSINESS_PHONE, BUSINESS_PHONE_LINK } from '@/lib/constants';
import type { BookingFrequency } from '@/domain/booking/types';
import Button from '@/components/ui/Button';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
];

const FREQUENCY_OPTIONS: { value: BookingFrequency; label: string }[] = [
  { value: 'one-off', label: 'One-off' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
];

const HOURS_OPTIONS = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8];

function getMinDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getMaxDate(): string {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  return maxDate.toISOString().split('T')[0];
}

function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = (hours - wholeHours) * 60;
  if (minutes === 0) {
    return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
  }
  return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${minutes} mins`;
}

const inputClasses =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400';

export default function StepDateTime() {
  const { state, dispatch } = useBooking();

  const [date, setDate] = useState(state.preferredDate || '');
  const [time, setTime] = useState(state.preferredTime || '');
  const [frequency, setFrequency] = useState<BookingFrequency>(state.frequency || 'one-off');
  const [hours, setHours] = useState(state.estimatedHours || 2);

  const estimatedCost = hours * HOURLY_RATE;
  const isValid = date !== '' && time !== '';

  function handleContinue() {
    if (!isValid) return;
    dispatch({
      type: 'SET_DATETIME',
      payload: {
        preferredDate: date,
        preferredTime: time,
        frequency,
        estimatedHours: hours,
      },
    });
    dispatch({ type: 'NEXT_STEP' });
  }

  function handleBack() {
    dispatch({ type: 'PREV_STEP' });
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900">
        Choose a Date and Time
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Select when you&apos;d like us to come. We require at least 24
        hours&apos; notice for all bookings.
      </p>

      {/* Warning box */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">
          We&apos;re available Monday to Friday, 9am to 5pm. Please allow at
          least 24 hours&apos; notice when booking.
        </p>
      </div>

      <div className="space-y-5">
        {/* Date */}
        <div>
          <label htmlFor="booking-date" className="mb-1.5 block text-sm font-medium text-gray-700">
            Preferred date
          </label>
          <input
            id="booking-date"
            type="date"
            min={getMinDate()}
            max={getMaxDate()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-gray-500">
            Weekdays only (Monday to Friday). Weekend bookings are not
            available.
          </p>
        </div>

        {/* Time */}
        <div>
          <label htmlFor="booking-time" className="mb-1.5 block text-sm font-medium text-gray-700">
            Preferred start time
          </label>
          <select
            id="booking-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClasses}
          >
            <option value="">Select a time</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label htmlFor="booking-frequency" className="mb-1.5 block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            id="booking-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as BookingFrequency)}
            className={inputClasses}
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated hours */}
        <div>
          <label htmlFor="booking-hours" className="mb-1.5 block text-sm font-medium text-gray-700">
            Estimated hours
          </label>
          <select
            id="booking-hours"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className={inputClasses}
          >
            {HOURS_OPTIONS.map((h) => (
              <option key={h} value={h}>
                {formatHours(h)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Minimum booking is 2 hours.
          </p>
        </div>

        {/* Cost estimate */}
        <div className="rounded-xl border border-brand-green-200 bg-brand-green-50 p-4">
          <p className="text-lg font-semibold text-brand-green-800">
            Estimated cost: &pound;{estimatedCost.toFixed(2)}
          </p>
          <p className="mt-0.5 text-xs text-brand-green-600">
            Based on {formatHours(hours)} at &pound;{HOURLY_RATE}/hour
          </p>
        </div>
      </div>

      {/* Call-us info */}
      <div className="mt-6 rounded-xl border border-brand-blue-200 bg-brand-blue-50 p-4 text-sm text-brand-blue-800">
        <p>
          Need a clean sooner? Call us directly on{' '}
          <a
            href={BUSINESS_PHONE_LINK}
            className="font-semibold underline hover:text-brand-blue-900"
          >
            {BUSINESS_PHONE}
          </a>{' '}
          and we&apos;ll do our best to help.
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { Booking, BookingStatus } from '@/domain/booking/types';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api-client';

interface BookingCardProps {
  booking: Booking;
  onUpdated: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BookingCard({ booking, onUpdated }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState(booking.date);
  const [newTime, setNewTime] = useState(booking.startTime);
  const [rescheduling, setRescheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    setCancelling(true);
    setError(null);
    try {
      await api.bookings.cancel(booking.id);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  }

  async function handleReschedule() {
    setRescheduling(true);
    setError(null);
    try {
      await api.bookings.update(booking.id, {
        date: newDate,
        startTime: newTime,
      });
      setRescheduleOpen(false);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reschedule booking.');
    } finally {
      setRescheduling(false);
    }
  }

  const status = booking.status as BookingStatus | 'rejected';

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row sm:items-centre sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {booking.serviceName}
              </h3>
              <StatusBadge status={status} />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{formatDate(booking.date)}</p>
              <p>{booking.startTime} &middot; {booking.estimatedHours} hour{booking.estimatedHours !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel'}
              </Button>
            )}

            {status === 'confirmed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRescheduleOpen(true)}
                >
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel'}
                </Button>
              </>
            )}

            {status === 'rejected' && (
              <Button variant="primary" size="sm" href="/book">
                Rebook
              </Button>
            )}

            <Button variant="ghost" size="sm" href={`/dashboard/bookings/${booking.id}`}>
              View
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </Card>

      {/* Reschedule modal */}
      <Modal
        isOpen={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule Booking"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reschedule-date" className="text-sm font-medium text-gray-700">
              New Date
            </label>
            <input
              id="reschedule-date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reschedule-time" className="text-sm font-medium text-gray-700">
              New Time
            </label>
            <input
              id="reschedule-time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRescheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReschedule}
              disabled={rescheduling}
            >
              {rescheduling ? 'Saving...' : 'Confirm Reschedule'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

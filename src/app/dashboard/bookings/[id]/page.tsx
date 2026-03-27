'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Booking, BookingStatus } from '@/domain/booking/types';
import { api } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  async function fetchBooking() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.bookings.get(bookingId);
      setBooking(data);
      setNewDate(data.date);
      setNewTime(data.startTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  async function handleCancel() {
    if (!booking) return;
    setCancelling(true);
    setActionError(null);
    try {
      await api.bookings.cancel(booking.id);
      await fetchBooking();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  }

  async function handleReschedule() {
    if (!booking) return;
    setRescheduling(true);
    setActionError(null);
    try {
      await api.bookings.update(booking.id, {
        date: newDate,
        startTime: newTime,
      });
      setRescheduleOpen(false);
      await fetchBooking();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reschedule booking.');
    } finally {
      setRescheduling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div>
        <Button variant="ghost" size="sm" href="/dashboard" className="mb-4">
          &larr; Back to My Bookings
        </Button>
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error ?? 'Booking not found.'}
        </div>
      </div>
    );
  }

  const status = booking.status as BookingStatus | 'rejected';

  return (
    <div>
      <Button variant="ghost" size="sm" href="/dashboard" className="mb-6">
        &larr; Back to My Bookings
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{booking.serviceName}</h1>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking details */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Date</dt>
              <dd className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Time</dt>
              <dd className="text-sm font-medium text-gray-900">{booking.startTime}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Duration</dt>
              <dd className="text-sm font-medium text-gray-900">
                {booking.estimatedHours} hour{booking.estimatedHours !== 1 ? 's' : ''}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Estimated Cost</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatCurrency(booking.totalPrice)}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Address & notes */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Address</dt>
              <dd className="text-sm font-medium text-gray-900">
                {booking.address.line1}
                {booking.address.line2 && <>, {booking.address.line2}</>}
                <br />
                {booking.address.town}, {booking.address.postcode}
              </dd>
            </div>
            {booking.specialRequirements && (
              <div>
                <dt className="text-sm text-gray-500">Special Requirements</dt>
                <dd className="text-sm text-gray-900">{booking.specialRequirements}</dd>
              </div>
            )}
            {booking.adminNotes && (
              <div>
                <dt className="text-sm text-gray-500">Notes from Yew Tree Cleaning</dt>
                <dd className="text-sm text-gray-900 bg-brand-green-50 rounded-lg p-3">
                  {booking.adminNotes}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      </div>

      {/* Actions */}
      {(status === 'pending' || status === 'confirmed' || status === 'rejected') && (
        <div className="mt-6 flex gap-3">
          {status === 'confirmed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRescheduleOpen(true)}
            >
              Reschedule
            </Button>
          )}
          {(status === 'pending' || status === 'confirmed') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          )}
          {status === 'rejected' && (
            <Button variant="primary" size="sm" href="/book">
              Rebook
            </Button>
          )}
        </div>
      )}

      {actionError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {actionError}
        </p>
      )}

      {/* Reschedule modal */}
      <Modal
        isOpen={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule Booking"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="detail-reschedule-date" className="text-sm font-medium text-gray-700">
              New Date
            </label>
            <input
              id="detail-reschedule-date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="detail-reschedule-time" className="text-sm font-medium text-gray-700">
              New Time
            </label>
            <input
              id="detail-reschedule-time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400"
            />
          </div>

          {actionError && (
            <p className="text-sm text-red-600" role="alert">
              {actionError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setRescheduleOpen(false)}>
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
    </div>
  );
}

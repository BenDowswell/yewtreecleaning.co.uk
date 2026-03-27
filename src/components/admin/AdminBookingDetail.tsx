'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Booking, BookingStatus } from '@/domain/booking/types';
import { api } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
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

export default function AdminBookingDetail() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  async function fetchBooking() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.bookings.get(bookingId);
      setBooking(data);
      setAdminNotes(data.adminNotes ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  async function handleStatusChange(newStatus: BookingStatus | 'rejected') {
    if (!booking) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await api.bookings.update(booking.id, { status: newStatus as BookingStatus });
      await fetchBooking();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveNotes() {
    if (!booking) return;
    setNoteSaving(true);
    setActionError(null);
    try {
      await api.bookings.update(booking.id, { adminNotes });
      await fetchBooking();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to save notes.');
    } finally {
      setNoteSaving(false);
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
        <Button variant="ghost" size="sm" href="/admin/bookings" className="mb-4">
          &larr; Back to All Bookings
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
      <Button variant="ghost" size="sm" href="/admin/bookings" className="mb-6">
        &larr; Back to All Bookings
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Service</dt>
              <dd className="text-sm font-medium text-gray-900">{booking.serviceName}</dd>
            </div>
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
              <dd className="text-sm font-medium text-gray-900">{formatCurrency(booking.totalPrice)}</dd>
            </div>
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
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="text-sm font-medium text-gray-900">{booking.customerName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-900">{booking.customerEmail}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Phone</dt>
              <dd className="text-sm font-medium text-gray-900">{booking.customerPhone}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Booked</dt>
              <dd className="text-sm text-gray-900">
                {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h2>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          placeholder="Add internal notes about this booking..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400 resize-y"
        />
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={handleSaveNotes} disabled={noteSaving}>
            {noteSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </div>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        {status === 'pending' && (
          <>
            <Button variant="primary" size="sm" disabled={actionLoading} onClick={() => handleStatusChange('confirmed')}>
              {actionLoading ? 'Processing...' : 'Approve'}
            </Button>
            <Button variant="outline" size="sm" disabled={actionLoading} onClick={() => handleStatusChange('rejected' as BookingStatus)}>
              Reject
            </Button>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <Button variant="primary" size="sm" disabled={actionLoading} onClick={() => handleStatusChange('completed')}>
              {actionLoading ? 'Processing...' : 'Mark Complete'}
            </Button>
            <Button variant="outline" size="sm" disabled={actionLoading} onClick={() => handleStatusChange('cancelled')}>
              Cancel Booking
            </Button>
          </>
        )}
        {(status === 'completed' || status === 'cancelled' || status === 'rejected') && (
          <p className="text-sm text-gray-500 italic">
            This booking is {status}. No further actions available.
          </p>
        )}
      </div>

      {actionError && (
        <p className="mt-4 text-sm text-red-600" role="alert">{actionError}</p>
      )}
    </div>
  );
}

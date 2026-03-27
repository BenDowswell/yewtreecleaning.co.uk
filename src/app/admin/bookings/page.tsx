'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import type { Booking, BookingStatus } from '@/domain/booking/types';
import { api } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type FilterTab = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
type SortOrder = 'newest' | 'oldest';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchBookings() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.bookings.list();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    if (activeTab !== 'all') {
      filtered = bookings.filter((b) => b.status === activeTab);
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [bookings, activeTab, sortOrder]);

  async function handleStatusChange(bookingId: string, newStatus: BookingStatus | 'rejected', adminNotes?: string) {
    setActionLoading(bookingId);
    try {
      const updateData: Partial<Booking> = { status: newStatus as BookingStatus };
      if (adminNotes) {
        updateData.adminNotes = adminNotes;
      }
      await api.bookings.update(bookingId, updateData);
      await fetchBookings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Bookings</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-brand-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Sort: {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No bookings found for this filter.</p>
        </div>
      )}

      {!loading && !error && filteredBookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-500">Customer</th>
                <th className="pb-3 font-medium text-gray-500">Service</th>
                <th className="pb-3 font-medium text-gray-500">Date</th>
                <th className="pb-3 font-medium text-gray-500">Time</th>
                <th className="pb-3 font-medium text-gray-500">Status</th>
                <th className="pb-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => {
                const isProcessing = actionLoading === booking.id;
                const status = booking.status as BookingStatus | 'rejected';

                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="font-medium text-gray-900 hover:text-brand-green-600"
                      >
                        {booking.customerName}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-600">{booking.serviceName}</td>
                    <td className="py-3 text-gray-600">
                      {new Date(booking.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 text-gray-600">{booking.startTime}</td>
                    <td className="py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          href={`/admin/bookings/${booking.id}`}
                        >
                          View
                        </Button>

                        {status === 'pending' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            >
                              {isProcessing ? '...' : 'Approve'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => {
                                const notes = prompt('Reason for rejection (optional):');
                                handleStatusChange(booking.id, 'rejected' as BookingStatus, notes ?? undefined);
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {status === 'confirmed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                          >
                            {isProcessing ? '...' : 'Complete'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

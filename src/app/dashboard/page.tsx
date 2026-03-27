'use client';

import { useEffect, useState, useMemo } from 'react';
import type { Booking } from '@/domain/booking/types';
import { api } from '@/lib/api-client';
import BookingCard from '@/components/dashboard/BookingCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type FilterTab = 'all' | 'upcoming' | 'past';

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

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
    const today = new Date().toISOString().split('T')[0];
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(
          (b) => b.date >= today && b.status !== 'cancelled',
        );
      case 'past':
        return bookings.filter(
          (b) => b.date < today || b.status === 'completed' || b.status === 'cancelled',
        );
      default:
        return bookings;
    }
  }, [bookings, activeTab]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <Button variant="primary" size="sm" href="/book">
          Book a New Clean
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
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
          <p className="text-gray-500 mb-4">
            {activeTab === 'all'
              ? "You haven't made any bookings yet."
              : `No ${activeTab} bookings found.`}
          </p>
          {activeTab === 'all' && (
            <Button variant="primary" href="/book">
              Book a Clean
            </Button>
          )}
        </div>
      )}

      {!loading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onUpdated={fetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
}

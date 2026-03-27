'use client';

import { useEffect, useState } from 'react';
import type { Booking } from '@/domain/booking/types';
import type { Message } from '@/domain/message/types';
import type { CustomerProfile } from '@/domain/customer/types';
import { api } from '@/lib/api-client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  totalBookings: number;
  pendingRequests: number;
  confirmedThisWeek: number;
  totalCustomers: number;
}

function getStartOfWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function getEndOfWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? 0 : 7);
  const sunday = new Date(now.setDate(diff));
  return sunday.toISOString().split('T')[0];
}

export default function AdminOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [bookingsData, messagesData, customersData] = await Promise.all([
          api.bookings.list(),
          api.messages.list(),
          api.customers.list(),
        ]);
        setBookings(bookingsData);
        setMessages(messagesData);
        setCustomers(customersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats: DashboardStats = {
    totalBookings: bookings.length,
    pendingRequests: bookings.filter((b) => b.status === 'pending').length,
    confirmedThisWeek: bookings.filter((b) => {
      const weekStart = getStartOfWeek();
      const weekEnd = getEndOfWeek();
      return b.status === 'confirmed' && b.date >= weekStart && b.date <= weekEnd;
    }).length,
    totalCustomers: customers.length,
  };

  const recentPending = bookings
    .filter((b) => b.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentUnread = messages
    .filter((m) => !m.read && m.direction === 'outbound')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, colour: 'bg-brand-blue-50 text-brand-blue-700' },
    { label: 'Pending Requests', value: stats.pendingRequests, colour: 'bg-yellow-50 text-yellow-700' },
    { label: 'Confirmed This Week', value: stats.confirmedThisWeek, colour: 'bg-brand-green-50 text-brand-green-700' },
    { label: 'Total Customers', value: stats.totalCustomers, colour: 'bg-brand-purple-50 text-brand-purple-700' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.colour.split(' ')[1]}`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent pending bookings */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Booking Requests</h2>
            <Button variant="ghost" size="sm" href="/admin/bookings">
              View All
            </Button>
          </div>

          {recentPending.length === 0 ? (
            <p className="text-sm text-gray-500">No pending requests.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentPending.map((booking) => (
                <li key={booking.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.serviceName} &middot;{' '}
                        {new Date(booking.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent messages */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
            <Button variant="ghost" size="sm" href="/admin/messages">
              View All
            </Button>
          </div>

          {recentUnread.length === 0 ? (
            <p className="text-sm text-gray-500">No unread messages.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentUnread.map((msg) => (
                <li key={msg.id} className="py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {msg.customerName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(msg.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-6 flex gap-3">
        <Button variant="primary" size="sm" href="/admin/bookings">
          View All Bookings
        </Button>
        <Button variant="outline" size="sm" href="/admin/messages">
          Check Messages
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CustomerProfile } from '@/domain/customer/types';
import type { Booking } from '@/domain/booking/types';
import { api } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminCustomerDetail() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [customerData, allBookings] = await Promise.all([
          api.customers.get(customerId),
          api.bookings.list(),
        ]);
        setCustomer(customerData);
        setEditName(customerData.name);
        setBookings(allBookings.filter((b) => b.customerId === customerId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load customer details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [customerId]);

  async function handleSave() {
    if (!customer) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await api.customers.update(customer.id, { name: editName });
      setCustomer(updated);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update customer.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  }

  if (error || !customer) {
    return (
      <div>
        <Button variant="ghost" size="sm" href="/admin/customers" className="mb-4">&larr; Back to Customers</Button>
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">{error ?? 'Customer not found.'}</div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" href="/admin/customers" className="mb-6">&larr; Back to Customers</Button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{customer.name}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          {editing ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Name</label>
                <input id="edit-name" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400" />
              </div>
              {saveError && <p className="text-sm text-red-600" role="alert">{saveError}</p>}
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setEditName(customer.name); }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <dl className="space-y-3">
              <div><dt className="text-sm text-gray-500">Name</dt><dd className="text-sm font-medium text-gray-900">{customer.name}</dd></div>
              <div><dt className="text-sm text-gray-500">Email</dt><dd className="text-sm font-medium text-gray-900">{customer.email}</dd></div>
              <div><dt className="text-sm text-gray-500">Total Bookings</dt><dd className="text-sm font-medium text-gray-900">{customer.totalBookings}</dd></div>
              <div><dt className="text-sm text-gray-500">Completed Bookings</dt><dd className="text-sm font-medium text-gray-900">{customer.completedBookings}</dd></div>
              <div><dt className="text-sm text-gray-500">Member Since</dt><dd className="text-sm font-medium text-gray-900">{new Date(customer.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="mt-2">Edit Details</Button>
            </dl>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-500">No bookings found for this customer.</p>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[24rem] overflow-y-auto">
              {bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((booking) => (
                <li key={booking.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.serviceName}</p>
                      <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {booking.startTime}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

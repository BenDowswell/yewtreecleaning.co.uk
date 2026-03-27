import type { User, LoginCredentials, RegisterData } from '@/domain/auth/types';
import type { Booking, BookingRequest } from '@/domain/booking/types';
import type { Message, ContactFormData } from '@/domain/message/types';
import type { DayAvailability } from '@/domain/availability/types';
import type { CustomerProfile } from '@/domain/customer/types';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (credentials: LoginCredentials) =>
      request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (data: RegisterData) =>
      request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request<User>('/auth/me'),
  },

  bookings: {
    list: () => request<Booking[]>('/bookings'),
    get: (id: string) => request<Booking>(`/bookings/${id}`),
    create: (data: BookingRequest) =>
      request<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Booking>) =>
      request<Booking>(`/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    cancel: (id: string) =>
      request<Booking>(`/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
      }),
  },

  contact: {
    submit: (data: ContactFormData) =>
      request<{ success: boolean; message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  messages: {
    list: () => request<Message[]>('/messages'),
    get: (id: string) => request<Message>(`/messages/${id}`),
    send: (data: Omit<Message, 'id' | 'createdAt'>) =>
      request<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    markRead: (id: string) =>
      request<Message>(`/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: true }),
      }),
  },

  customers: {
    list: () => request<CustomerProfile[]>('/customers'),
    get: (id: string) => request<CustomerProfile>(`/customers/${id}`),
    update: (id: string, data: Partial<CustomerProfile>) =>
      request<CustomerProfile>(`/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  availability: {
    get: () => request<DayAvailability[]>('/availability'),
    update: (data: DayAvailability[]) =>
      request<DayAvailability[]>('/availability', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};

import { User } from '@/domain/auth/types';
import { Booking } from '@/domain/booking/types';
import { Message } from '@/domain/message/types';
import { DayAvailability } from '@/domain/availability/types';
import { CustomerProfile } from '@/domain/customer/types';
import { seedDatabase } from './mock-seed';

let idCounter = 1000;

function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

class MockDatabase {
  users: Map<string, User & { password: string }> = new Map();
  bookings: Map<string, Booking> = new Map();
  messages: Map<string, Message> = new Map();
  availability: Map<string, DayAvailability> = new Map();

  constructor() {
    seedDatabase(this);
  }

  // ---------------------------------------------------------------------------
  // Auth methods
  // ---------------------------------------------------------------------------

  findUserByEmail(email: string): (User & { password: string }) | undefined {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  findUserById(id: string): User | undefined {
    const record = this.users.get(id);
    if (!record) return undefined;
    // Return without password
    const { password: _password, ...user } = record;
    return user;
  }

  createUser(data: {
    email: string;
    name: string;
    phone: string;
    password: string;
    role: 'customer' | 'admin';
  }): User {
    const id = generateId('user');
    const now = new Date().toISOString();
    const record = {
      id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      password: data.password,
      createdAt: now,
    };
    this.users.set(id, record);
    const { password: _password, ...user } = record;
    return user;
  }

  // ---------------------------------------------------------------------------
  // Booking methods
  // ---------------------------------------------------------------------------

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getBookingsByCustomer(customerId: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter((b) => b.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    const id = generateId('booking');
    const now = new Date().toISOString();
    const booking: Booking = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  updateBooking(id: string, data: Partial<Booking>): Booking | undefined {
    const existing = this.bookings.get(id);
    if (!existing) return undefined;
    const updated: Booking = {
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.bookings.set(id, updated);
    return updated;
  }

  deleteBooking(id: string): boolean {
    return this.bookings.delete(id);
  }

  // ---------------------------------------------------------------------------
  // Message methods
  // ---------------------------------------------------------------------------

  getAllMessages(): Message[] {
    return Array.from(this.messages.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getMessagesByCustomer(customerId: string): Message[] {
    return Array.from(this.messages.values())
      .filter((m) => m.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getMessageById(id: string): Message | undefined {
    return this.messages.get(id);
  }

  createMessage(data: Omit<Message, 'id' | 'createdAt'>): Message {
    const id = generateId('msg');
    const now = new Date().toISOString();
    const message: Message = {
      ...data,
      id,
      createdAt: now,
    };
    this.messages.set(id, message);
    return message;
  }

  updateMessage(id: string, data: Partial<Message>): Message | undefined {
    const existing = this.messages.get(id);
    if (!existing) return undefined;
    const updated: Message = {
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt,
    };
    this.messages.set(id, updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // Customer methods
  // ---------------------------------------------------------------------------

  getAllCustomers(): CustomerProfile[] {
    const customers: CustomerProfile[] = [];

    for (const user of this.users.values()) {
      if (user.role !== 'customer') continue;

      const bookings = this.getBookingsByCustomer(user.id);
      const completed = bookings.filter((b) => b.status === 'completed');
      const upcoming = bookings.filter(
        (b) => b.status === 'pending' || b.status === 'confirmed'
      );
      const lastCompleted = completed.length > 0
        ? completed.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0]
        : undefined;

      customers.push({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        totalBookings: bookings.length,
        completedBookings: completed.length,
        upcomingBookings: upcoming.length,
        lastBookingDate: lastCompleted?.date,
        createdAt: user.createdAt,
      });
    }

    return customers;
  }

  getCustomerById(id: string): CustomerProfile | undefined {
    const user = this.users.get(id);
    if (!user || user.role !== 'customer') return undefined;

    const bookings = this.getBookingsByCustomer(id);
    const completed = bookings.filter((b) => b.status === 'completed');
    const upcoming = bookings.filter(
      (b) => b.status === 'pending' || b.status === 'confirmed'
    );
    const lastCompleted = completed.length > 0
      ? completed.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]
      : undefined;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      totalBookings: bookings.length,
      completedBookings: completed.length,
      upcomingBookings: upcoming.length,
      lastBookingDate: lastCompleted?.date,
      createdAt: user.createdAt,
    };
  }

  updateCustomer(id: string, data: Partial<CustomerProfile>): CustomerProfile | undefined {
    const user = this.users.get(id);
    if (!user || user.role !== 'customer') return undefined;

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.phone) user.phone = data.phone;

    this.users.set(id, user);
    return this.getCustomerById(id);
  }
}

// Singleton – persists for the lifetime of the dev server
let db: MockDatabase;

export function getDatabase(): MockDatabase {
  if (!db) {
    db = new MockDatabase();
  }
  return db;
}

export type { MockDatabase };

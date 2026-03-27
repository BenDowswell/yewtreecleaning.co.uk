import type { MockDatabase } from './mock-db';

export function seedDatabase(db: MockDatabase): void {
  // Users
  db.users.set('admin-1', {
    id: 'admin-1',
    email: 'joy@yewtreecleaning.co.uk',
    name: 'Joy',
    phone: '07799 118358',
    role: 'admin',
    password: 'admin123',
    createdAt: '2024-01-15T09:00:00.000Z',
  });

  db.users.set('customer-1', {
    id: 'customer-1',
    email: 'sarah@example.co.uk',
    name: 'Sarah Thompson',
    phone: '07700 900123',
    role: 'customer',
    password: 'customer123',
    createdAt: '2024-06-10T14:30:00.000Z',
  });

  db.users.set('customer-2', {
    id: 'customer-2',
    email: 'james@example.co.uk',
    name: 'James Wilson',
    phone: '07700 900456',
    role: 'customer',
    password: 'customer123',
    createdAt: '2024-08-22T10:15:00.000Z',
  });

  // Bookings
  db.bookings.set('booking-1', {
    id: 'booking-1',
    customerId: 'customer-1',
    customerName: 'Sarah Thompson',
    customerEmail: 'sarah@example.co.uk',
    customerPhone: '07700 900123',
    serviceId: 'svc-001',
    serviceName: 'Regular Domestic Cleaning',
    date: '2025-03-10',
    startTime: '09:00',
    estimatedHours: 3,
    address: { line1: '14 Oak Lane', town: 'Madeley', postcode: 'CW3 9EH' },
    status: 'completed',
    totalPrice: 45,
    adminNotes: 'Regular fortnightly client. Key under the mat.',
    createdAt: '2025-02-28T11:20:00.000Z',
    updatedAt: '2025-03-10T12:30:00.000Z',
  });

  db.bookings.set('booking-2', {
    id: 'booking-2',
    customerId: 'customer-1',
    customerName: 'Sarah Thompson',
    customerEmail: 'sarah@example.co.uk',
    customerPhone: '07700 900123',
    serviceId: 'svc-001',
    serviceName: 'Regular Domestic Cleaning',
    date: '2025-03-24',
    startTime: '09:00',
    estimatedHours: 3,
    address: { line1: '14 Oak Lane', town: 'Madeley', postcode: 'CW3 9EH' },
    status: 'confirmed',
    totalPrice: 45,
    createdAt: '2025-03-11T08:00:00.000Z',
    updatedAt: '2025-03-12T09:00:00.000Z',
  });

  db.bookings.set('booking-3', {
    id: 'booking-3',
    customerId: 'customer-2',
    customerName: 'James Wilson',
    customerEmail: 'james@example.co.uk',
    customerPhone: '07700 900456',
    serviceId: 'svc-002',
    serviceName: 'Deep Cleaning',
    date: '2025-04-05',
    startTime: '10:00',
    estimatedHours: 5,
    address: {
      line1: '7 Church Street',
      line2: 'Flat 2',
      town: 'Newcastle-under-Lyme',
      postcode: 'ST5 1QP',
    },
    specialRequirements:
      'Please pay extra attention to the kitchen \u2013 we have had building work recently.',
    status: 'pending',
    totalPrice: 75,
    createdAt: '2025-03-18T16:45:00.000Z',
    updatedAt: '2025-03-18T16:45:00.000Z',
  });

  db.bookings.set('booking-4', {
    id: 'booking-4',
    customerId: 'customer-2',
    customerName: 'James Wilson',
    customerEmail: 'james@example.co.uk',
    customerPhone: '07700 900456',
    serviceId: 'svc-003',
    serviceName: 'End of Tenancy Cleaning',
    date: '2025-02-15',
    startTime: '08:00',
    estimatedHours: 6,
    address: { line1: '22 Mill Road', town: 'Market Drayton', postcode: 'TF9 3BN' },
    status: 'completed',
    totalPrice: 90,
    adminNotes: 'Landlord inspection passed first time.',
    createdAt: '2025-02-01T09:30:00.000Z',
    updatedAt: '2025-02-15T16:00:00.000Z',
  });

  db.bookings.set('booking-5', {
    id: 'booking-5',
    customerId: 'customer-1',
    customerName: 'Sarah Thompson',
    customerEmail: 'sarah@example.co.uk',
    customerPhone: '07700 900123',
    serviceId: 'svc-006',
    serviceName: 'Oven Cleaning',
    date: '2025-01-20',
    startTime: '14:00',
    estimatedHours: 2,
    address: { line1: '14 Oak Lane', town: 'Madeley', postcode: 'CW3 9EH' },
    status: 'cancelled',
    totalPrice: 30,
    createdAt: '2025-01-10T13:00:00.000Z',
    updatedAt: '2025-01-18T10:00:00.000Z',
  });

  db.bookings.set('booking-6', {
    id: 'booking-6',
    customerId: 'customer-2',
    customerName: 'James Wilson',
    customerEmail: 'james@example.co.uk',
    customerPhone: '07700 900456',
    serviceId: 'svc-004',
    serviceName: 'Airbnb / Holiday Let Cleaning',
    date: '2025-04-12',
    startTime: '11:00',
    estimatedHours: 3,
    address: { line1: '3 Riverside Cottage', town: 'Ironbridge', postcode: 'TF8 7NH' },
    specialRequirements:
      'Guest checking in at 3pm \u2013 please ensure finished by 2:30pm.',
    status: 'confirmed',
    totalPrice: 45,
    createdAt: '2025-03-20T11:00:00.000Z',
    updatedAt: '2025-03-21T08:30:00.000Z',
  });

  // Messages
  db.messages.set('msg-1', {
    id: 'msg-1',
    customerId: 'customer-1',
    customerName: 'Sarah Thompson',
    customerEmail: 'sarah@example.co.uk',
    subject: 'Regular cleaning schedule',
    body: 'Hi Joy, I was wondering if we could move my regular clean from Monday to Wednesday starting next month? Many thanks, Sarah.',
    direction: 'inbound',
    read: true,
    createdAt: '2025-03-15T09:20:00.000Z',
  });

  db.messages.set('msg-2', {
    id: 'msg-2',
    customerId: 'customer-1',
    customerName: 'Sarah Thompson',
    customerEmail: 'sarah@example.co.uk',
    subject: 'Re: Regular cleaning schedule',
    body: 'Hi Sarah, of course! I have updated your schedule to Wednesday mornings from April onwards. See you then! Best, Joy',
    direction: 'outbound',
    read: true,
    createdAt: '2025-03-15T11:45:00.000Z',
  });

  db.messages.set('msg-3', {
    id: 'msg-3',
    customerId: 'customer-2',
    customerName: 'James Wilson',
    customerEmail: 'james@example.co.uk',
    subject: 'Deep clean enquiry',
    body: 'Hello, I have just had some building work done and the place is quite dusty. Could you give me a quote for a deep clean of a 3-bedroom house? Thanks, James.',
    direction: 'inbound',
    read: false,
    createdAt: '2025-03-18T16:30:00.000Z',
  });

  db.messages.set('msg-4', {
    id: 'msg-4',
    customerId: 'customer-2',
    customerName: 'James Wilson',
    customerEmail: 'james@example.co.uk',
    subject: 'Airbnb changeover details',
    body: 'Hi James, just to confirm I have your Airbnb changeover booked for 12th April at 11am. I will bring fresh linen as requested. Kind regards, Joy',
    direction: 'outbound',
    read: true,
    createdAt: '2025-03-21T09:00:00.000Z',
  });
}

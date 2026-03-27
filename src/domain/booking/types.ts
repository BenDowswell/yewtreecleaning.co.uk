export type BookingFrequency = 'one-off' | 'weekly' | 'fortnightly' | 'monthly';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  startTime: string;
  estimatedHours: number;
  address: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
  };
  specialRequirements?: string;
  status: BookingStatus;
  totalPrice: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  serviceId: string;
  serviceName: string;
  date: string;
  startTime: string;
  estimatedHours: number;
  address: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
  };
  specialRequirements?: string;
}

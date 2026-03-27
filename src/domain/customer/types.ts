export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  completedBookings: number;
  upcomingBookings: number;
  lastBookingDate?: string;
  createdAt: string;
}

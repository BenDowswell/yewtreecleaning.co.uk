import type { Metadata } from 'next';
import { BookingProvider } from '@/context/BookingContext';
import BookingWizard from '@/components/booking/BookingWizard';

export const metadata: Metadata = {
  title: 'Book a Clean',
  description:
    'Book a domestic cleaning service in Madeley and the surrounding area. Choose your service, pick a date and time, and submit your request.',
};

export default function BookPage() {
  return (
    <BookingProvider>
      <BookingWizard />
    </BookingProvider>
  );
}

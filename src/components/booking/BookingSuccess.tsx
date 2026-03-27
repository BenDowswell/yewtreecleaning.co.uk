'use client';

import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_LINK,
  WHATSAPP_LINK,
} from '@/lib/constants';
import Button from '@/components/ui/Button';

const NEXT_STEPS = [
  "We'll review your request and check availability.",
  "You'll receive confirmation within 24 hours.",
  "If we need any additional information, we'll be in touch.",
];

export default function BookingSuccess() {
  const { dispatch } = useBooking();

  function handleReset() {
    dispatch({ type: 'RESET' });
  }

  return (
    <div className="text-center">
      {/* Green checkmark */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-brand-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        Booking Request Submitted
      </h2>
      <p className="mb-8 text-gray-600">
        Thank you! Your booking request has been submitted successfully.
      </p>

      {/* What happens next */}
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-900">
          What happens next?
        </h3>
        <ol className="space-y-3">
          {NEXT_STEPS.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green-100 text-xs font-semibold text-brand-green-700">
                {index + 1}
              </span>
              <span className="text-sm text-gray-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Contact box */}
      <div className="mx-auto mt-6 max-w-md rounded-xl border border-brand-blue-200 bg-brand-blue-50 p-4 text-sm text-brand-blue-800">
        <p>
          Questions? Call us on{' '}
          <a
            href={BUSINESS_PHONE_LINK}
            className="font-semibold underline hover:text-brand-blue-900"
          >
            {BUSINESS_PHONE}
          </a>{' '}
          or{' '}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-brand-blue-900"
          >
            send a WhatsApp message
          </a>
          .
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button onClick={handleReset}>Book Another Clean</Button>
        <Button variant="outline" href="/">
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}

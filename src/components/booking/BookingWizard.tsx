'use client';

import { useBooking } from '@/context/BookingContext';
import Stepper from '@/components/ui/Stepper';
import StepService from './StepService';
import StepDateTime from './StepDateTime';
import StepDetails from './StepDetails';
import StepConfirm from './StepConfirm';
import BookingSuccess from './BookingSuccess';
import { BUSINESS_PHONE, BUSINESS_PHONE_LINK } from '@/lib/constants';

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Review', 'Confirmed'];

function CurrentStep({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <StepService />;
    case 1:
      return <StepDateTime />;
    case 2:
      return <StepDetails />;
    case 3:
      return <StepConfirm />;
    case 4:
      return <BookingSuccess />;
    default:
      return null;
  }
}

export default function BookingWizard() {
  const { state } = useBooking();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Book a Clean
      </h1>

      {/* Info banner */}
      <div className="mb-8 rounded-xl border border-brand-blue-200 bg-brand-blue-50 p-4 text-sm text-brand-blue-800">
        <p>
          Booking requests are reviewed and confirmed within 24 hours. For
          urgent bookings, please call us on{' '}
          <a
            href={BUSINESS_PHONE_LINK}
            className="font-semibold underline hover:text-brand-blue-900"
          >
            {BUSINESS_PHONE}
          </a>
          .
        </p>
      </div>

      {/* Stepper */}
      {state.currentStep < 4 && (
        <div className="mb-8">
          <Stepper steps={STEPS} currentStep={state.currentStep} />
        </div>
      )}

      {/* Active step */}
      <CurrentStep step={state.currentStep} />
    </section>
  );
}

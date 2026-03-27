'use client';

import { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { services } from '@/domain/service/data';
import { HOURLY_RATE } from '@/lib/constants';
import Button from '@/components/ui/Button';

const FREQUENCY_LABELS: Record<string, string> = {
  'one-off': 'One-off',
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
};

function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = (hours - wholeHours) * 60;
  if (minutes === 0) {
    return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
  }
  return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${minutes} mins`;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface SummaryRowProps {
  label: string;
  value: string;
  onEdit?: () => void;
}

function SummaryRow({ label, value, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <dt className="text-sm text-gray-500">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-gray-900">{value}</dd>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-sm font-medium text-brand-green-600 hover:text-brand-green-700 hover:underline"
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default function StepConfirm() {
  const { state, dispatch } = useBooking();
  const [error, setError] = useState<string | null>(null);

  const service = services.find((s) => s.id === state.serviceId);
  const estimatedCost = state.estimatedHours * HOURLY_RATE;

  function goToStep(step: number) {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }

  async function handleSubmit() {
    setError(null);
    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: state.serviceId,
          serviceName: service?.name ?? '',
          preferredDate: state.preferredDate,
          preferredTime: state.preferredTime,
          frequency: state.frequency,
          estimatedHours: state.estimatedHours,
          estimatedCost,
          customerName: state.customerName,
          email: state.email,
          phone: state.phone,
          address: state.address,
          postcode: state.postcode,
          notes: state.notes,
          ecoProducts: state.ecoProducts,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking request. Please try again.');
      }

      dispatch({ type: 'SET_SUBMITTED' });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }

  function handleBack() {
    dispatch({ type: 'PREV_STEP' });
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900">
        Review Your Booking Request
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Please check all the details below before submitting your request.
      </p>

      {/* Summary card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Service section */}
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Service
          </h3>
          <SummaryRow
            label="Service type"
            value={service?.name ?? 'Unknown'}
            onEdit={() => goToStep(0)}
          />
        </div>

        {/* Date & time section */}
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Date &amp; Time
          </h3>
          <SummaryRow
            label="Date"
            value={formatDate(state.preferredDate)}
            onEdit={() => goToStep(1)}
          />
          <SummaryRow
            label="Start time"
            value={state.preferredTime}
            onEdit={() => goToStep(1)}
          />
          <SummaryRow
            label="Frequency"
            value={FREQUENCY_LABELS[state.frequency] ?? state.frequency}
            onEdit={() => goToStep(1)}
          />
          <SummaryRow
            label="Estimated duration"
            value={formatHours(state.estimatedHours)}
            onEdit={() => goToStep(1)}
          />
          <SummaryRow
            label="Estimated cost"
            value={`\u00A3${estimatedCost.toFixed(2)}`}
          />
        </div>

        {/* Customer section */}
        <div className="px-5 py-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Your Details
          </h3>
          <SummaryRow
            label="Name"
            value={state.customerName}
            onEdit={() => goToStep(2)}
          />
          <SummaryRow
            label="Email"
            value={state.email}
            onEdit={() => goToStep(2)}
          />
          <SummaryRow
            label="Phone"
            value={state.phone}
            onEdit={() => goToStep(2)}
          />
          <SummaryRow
            label="Address"
            value={state.address}
            onEdit={() => goToStep(2)}
          />
          <SummaryRow
            label="Postcode"
            value={state.postcode}
            onEdit={() => goToStep(2)}
          />
          {state.notes && (
            <SummaryRow
              label="Additional notes"
              value={state.notes}
              onEdit={() => goToStep(2)}
            />
          )}
          <SummaryRow
            label="Eco-friendly products"
            value={state.ecoProducts ? 'Yes' : 'No'}
            onEdit={() => goToStep(2)}
          />
        </div>
      </div>

      {/* Important notice */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">
          This is a booking request, not a confirmed booking.
        </p>
        <p className="mt-1">
          We&apos;ll review your request and get back to you within 24 hours to
          confirm.
        </p>
      </div>

      {/* Terms */}
      <p className="mt-4 text-xs text-gray-500">
        By submitting this request, you agree to our minimum booking of 2 hours
        and understand that bookings require at least 24 hours&apos; notice.
      </p>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={state.isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={state.isSubmitting}
        >
          {state.isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Submitting&hellip;
            </span>
          ) : (
            'Submit Booking Request'
          )}
        </Button>
      </div>
    </div>
  );
}

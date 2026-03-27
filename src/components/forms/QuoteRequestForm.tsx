'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  quoteRequestSchema,
  type QuoteRequestInput,
} from '@/domain/message/validation';
import { services } from '@/domain/service/data';

const inputClassName =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400';
const selectClassName =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400';
const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';
const errorClassName = 'text-sm text-red-500 mt-1';

const PROPERTY_TYPES = [
  { value: 'flat', label: 'Flat' },
  { value: 'terraced', label: 'Terraced' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'detached', label: 'Detached' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'other', label: 'Other' },
];

const BEDROOM_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' },
];

const FREQUENCY_OPTIONS = [
  { value: 'one-off', label: 'One-Off' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function QuoteRequestForm() {
  const [submitState, setSubmitState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteRequestInput>({
    resolver: zodResolver(quoteRequestSchema),
  });

  const onSubmit = async (data: QuoteRequestInput) => {
    setSubmitState('loading');
    setErrorMessage('');

    const selectedService = services.find((s) => s.id === data.serviceId);
    const body = [
      `Service: ${selectedService?.name ?? data.serviceId}`,
      `Property Type: ${data.propertyType}`,
      `Bedrooms: ${data.bedrooms}`,
      `Frequency: ${data.frequency}`,
      data.preferredStartDate
        ? `Preferred Start Date: ${data.preferredStartDate}`
        : null,
      data.additionalNotes ? `\nAdditional Notes:\n${data.additionalNotes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: 'Quote Request',
          message: body,
        }),
      });

      if (!res.ok) {
        const resBody = await res.json().catch(() => null);
        throw new Error(
          resBody?.message || 'Something went wrong. Please try again.',
        );
      }

      setSubmitState('success');
      reset();
    } catch (err) {
      setSubmitState('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  if (submitState === 'success') {
    return (
      <div className="rounded-xl border border-brand-green-200 bg-brand-green-50 p-6 text-center">
        <svg
          className="mx-auto mb-3 h-12 w-12 text-brand-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-brand-green-800">
          Quote Request Sent
        </h3>
        <p className="mt-1 text-brand-green-700">
          Thank you for your message. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState('idle')}
          className="mt-4 text-sm font-medium text-brand-green-600 underline hover:text-brand-green-800"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {submitState === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Personal details */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className={labelClassName}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-name"
            type="text"
            autoComplete="name"
            className={inputClassName}
            {...register('name')}
          />
          {errors.name && <p className={errorClassName}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="quote-email" className={labelClassName}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-email"
            type="email"
            autoComplete="email"
            className={inputClassName}
            {...register('email')}
          />
          {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="quote-phone" className={labelClassName}>
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="quote-phone"
          type="tel"
          autoComplete="tel"
          className={inputClassName}
          {...register('phone')}
        />
        {errors.phone && <p className={errorClassName}>{errors.phone.message}</p>}
      </div>

      {/* Service details */}
      <div>
        <label htmlFor="quote-service" className={labelClassName}>
          Service <span className="text-red-500">*</span>
        </label>
        <select
          id="quote-service"
          className={selectClassName}
          {...register('serviceId')}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className={errorClassName}>{errors.serviceId.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="quote-property" className={labelClassName}>
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            id="quote-property"
            className={selectClassName}
            {...register('propertyType')}
          >
            <option value="">Select</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
          {errors.propertyType && (
            <p className={errorClassName}>{errors.propertyType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quote-bedrooms" className={labelClassName}>
            Bedrooms <span className="text-red-500">*</span>
          </label>
          <select
            id="quote-bedrooms"
            className={selectClassName}
            {...register('bedrooms')}
          >
            <option value="">Select</option>
            {BEDROOM_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          {errors.bedrooms && (
            <p className={errorClassName}>{errors.bedrooms.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quote-frequency" className={labelClassName}>
            Frequency <span className="text-red-500">*</span>
          </label>
          <select
            id="quote-frequency"
            className={selectClassName}
            {...register('frequency')}
          >
            <option value="">Select</option>
            {FREQUENCY_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          {errors.frequency && (
            <p className={errorClassName}>{errors.frequency.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="quote-date" className={labelClassName}>
          Preferred Start Date <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="quote-date"
          type="date"
          className={inputClassName}
          {...register('preferredStartDate')}
        />
      </div>

      <div>
        <label htmlFor="quote-notes" className={labelClassName}>
          Additional Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="quote-notes"
          rows={4}
          className={inputClassName}
          {...register('additionalNotes')}
        />
        {errors.additionalNotes && (
          <p className={errorClassName}>{errors.additionalNotes.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitState === 'loading'}
        className="w-full rounded-xl bg-brand-green-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitState === 'loading' ? 'Sending...' : 'Request a Quote'}
      </button>
    </form>
  );
}

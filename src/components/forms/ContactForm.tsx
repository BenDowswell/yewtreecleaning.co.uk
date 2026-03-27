'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactFormSchema,
  type ContactFormInput,
} from '@/domain/message/validation';

const inputClassName =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400';
const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';
const errorClassName = 'text-sm text-red-500 mt-1';

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    setSubmitState('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Something went wrong. Please try again.');
      }

      setSubmitState('success');
      reset();
    } catch (err) {
      setSubmitState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
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
        <h3 className="text-lg font-semibold text-brand-green-800">Message Sent</h3>
        <p className="mt-1 text-brand-green-700">
          Thank you for your message. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState('idle')}
          className="mt-4 text-sm font-medium text-brand-green-600 underline hover:text-brand-green-800"
        >
          Send another message
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

      <div>
        <label htmlFor="contact-name" className={labelClassName}>
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          className={inputClassName}
          {...register('name')}
        />
        {errors.name && <p className={errorClassName}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClassName}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          className={inputClassName}
          {...register('email')}
        />
        {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClassName}>
          Phone <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          className={inputClassName}
          {...register('phone')}
        />
        {errors.phone && <p className={errorClassName}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClassName}>
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          className={inputClassName}
          {...register('subject')}
        />
        {errors.subject && <p className={errorClassName}>{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={inputClassName}
          {...register('message')}
        />
        {errors.message && <p className={errorClassName}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitState === 'loading'}
        className="w-full rounded-xl bg-brand-green-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitState === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

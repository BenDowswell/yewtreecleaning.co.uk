'use client';

import { useBooking } from '@/context/BookingContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const detailsSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(5, 'Please enter your full property address'),
  postcode: z.string().min(5, 'Please enter a valid postcode'),
  notes: z.string(),
  ecoProducts: z.boolean(),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

const inputClasses =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400';

const errorClasses = 'mt-1 text-xs text-red-600';

export default function StepDetails() {
  const { state, dispatch } = useBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      customerName: state.customerName,
      email: state.email,
      phone: state.phone,
      address: state.address,
      postcode: state.postcode,
      notes: state.notes,
      ecoProducts: state.ecoProducts,
    },
  });

  function onSubmit(data: DetailsFormData) {
    dispatch({
      type: 'SET_DETAILS',
      payload: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        postcode: data.postcode,
        notes: data.notes ?? '',
        ecoProducts: data.ecoProducts ?? false,
      },
    });
    dispatch({ type: 'NEXT_STEP' });
  }

  function handleBack() {
    dispatch({ type: 'PREV_STEP' });
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900">
        Your Details
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Please provide your contact details and the property address for the
        clean.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Full name */}
        <div>
          <label
            htmlFor="customerName"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="customerName"
            type="text"
            autoComplete="name"
            {...register('customerName')}
            className={`${inputClasses} ${errors.customerName ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
          />
          {errors.customerName && (
            <p className={errorClasses}>{errors.customerName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={`${inputClasses} ${errors.email ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
          />
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            className={`${inputClasses} ${errors.phone ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
          />
          {errors.phone && (
            <p className={errorClasses}>{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Property address <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            autoComplete="street-address"
            {...register('address')}
            className={`${inputClasses} ${errors.address ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
          />
          {errors.address && (
            <p className={errorClasses}>{errors.address.message}</p>
          )}
        </div>

        {/* Postcode */}
        <div>
          <label
            htmlFor="postcode"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            id="postcode"
            type="text"
            autoComplete="postal-code"
            {...register('postcode')}
            className={`${inputClasses} ${errors.postcode ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
          />
          {errors.postcode && (
            <p className={errorClasses}>{errors.postcode.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Additional notes{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Any specific requirements, access instructions, or areas to focus on?"
            {...register('notes')}
            className={inputClasses}
          />
        </div>

        {/* Eco products */}
        <div className="flex items-start gap-3">
          <input
            id="ecoProducts"
            type="checkbox"
            {...register('ecoProducts')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-green-400 focus:ring-brand-green-400"
          />
          <label htmlFor="ecoProducts" className="text-sm text-gray-700">
            I&apos;d prefer eco-friendly cleaning products
          </label>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" type="button" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  );
}

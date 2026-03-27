import { z } from 'zod';

const UK_POSTCODE_REGEX =
  /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

export const bookingAddressSchema = z.object({
  line1: z
    .string()
    .min(3, 'Address line 1 is required')
    .max(200, 'Address line 1 must be fewer than 200 characters'),
  line2: z
    .string()
    .max(200, 'Address line 2 must be fewer than 200 characters')
    .optional(),
  town: z
    .string()
    .min(2, 'Town is required')
    .max(100, 'Town must be fewer than 100 characters'),
  postcode: z
    .string()
    .regex(UK_POSTCODE_REGEX, 'Please enter a valid UK postcode'),
});

export const bookingRequestSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  serviceName: z.string().min(1, 'Service name is required'),
  date: z.string().min(1, 'Please choose a date'),
  startTime: z.string().min(1, 'Please choose a start time'),
  estimatedHours: z
    .number()
    .min(2, 'Minimum booking is 2 hours')
    .max(12, 'Maximum booking is 12 hours'),
  address: bookingAddressSchema,
  specialRequirements: z
    .string()
    .max(1000, 'Special requirements must be fewer than 1000 characters')
    .optional(),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

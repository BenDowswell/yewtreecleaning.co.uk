import { z } from 'zod';

const UK_PHONE_REGEX = /^(?:0|\+44)\d{9,10}$/;

export const customerProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be fewer than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number'),
});

export type CustomerProfileUpdateInput = z.infer<typeof customerProfileUpdateSchema>;

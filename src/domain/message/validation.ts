import { z } from 'zod';

const UK_PHONE_REGEX = /^(?:0|\+44)\d{9,10}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be fewer than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number')
    .optional(),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be fewer than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be fewer than 5000 characters'),
});

export const quoteRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be fewer than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number'),
  serviceId: z.string().min(1, 'Please select a service'),
  propertyType: z.string().min(1, 'Please select a property type'),
  bedrooms: z.string().min(1, 'Please select the number of bedrooms'),
  frequency: z.string().min(1, 'Please select a frequency'),
  preferredStartDate: z.string().optional(),
  additionalNotes: z
    .string()
    .max(2000, 'Notes must be fewer than 2000 characters')
    .optional(),
});

export const messageSchema = z.object({
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be fewer than 200 characters'),
  body: z
    .string()
    .min(1, 'Message body is required')
    .max(5000, 'Message must be fewer than 5000 characters'),
  parentId: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type MessageInput = z.infer<typeof messageSchema>;

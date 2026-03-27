import type { Metadata } from 'next';
import FaqAccordion from '@/components/faq/FaqAccordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common questions about Yew Tree Cleaning, including pricing, areas covered, and how to book.',
};

const FAQ_ITEMS = [
  {
    question: 'What areas do you cover?',
    answer:
      'We\u2019re based in Madeley and cover homes within approximately 10 miles of the surrounding area. If you\u2019re unsure whether we reach your location, just get in touch and we\u2019ll let you know.',
  },
  {
    question: 'How much do you charge?',
    answer:
      'Our rate is \u00a315 per hour with a minimum booking of 2 hours. The exact time needed depends on the size of your home and the type of clean required.',
  },
  {
    question: 'Do I need to provide cleaning products?',
    answer:
      'No \u2014 we bring all cleaning products and equipment with us. If you\u2019d prefer us to use eco-friendly products, just let us know when you book.',
  },
  {
    question: 'How do I book a clean?',
    answer:
      'You can book online through our website, call us on 07799 118358, or send us a WhatsApp message. Bookings require at least 24 hours\u2019 notice.',
  },
  {
    question: 'Can I book a one-off clean?',
    answer:
      'Absolutely. We offer both regular cleaning (weekly, fortnightly, or monthly) and one-off cleans for deep cleaning, end of tenancy, or any other occasion.',
  },
  {
    question: 'What happens after I submit a booking request?',
    answer:
      'Once you submit a request, we\u2019ll review it and confirm your booking within 24 hours. Booking requests are not instantly confirmed \u2014 we check availability first and then get in touch to confirm.',
  },
  {
    question: 'Can I reschedule or cancel a booking?',
    answer:
      'Yes. You can manage your bookings through your customer account, or contact us directly. We ask for at least 24 hours\u2019 notice for changes.',
  },
  {
    question: 'Do you offer ironing?',
    answer:
      'No, we don\u2019t currently offer ironing as part of our service.',
  },
  {
    question: 'Is there a minimum booking time?',
    answer: 'Yes, the minimum booking is 2 hours.',
  },
  {
    question: 'How do I pay?',
    answer:
      'Payment is made after the clean is completed. We\u2019ll confirm payment details when we confirm your booking.',
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Here are answers to some of the questions we&apos;re asked most often. If
          there&apos;s anything else you&apos;d like to know, please don&apos;t
          hesitate to get in touch.
        </p>
      </div>

      <FaqAccordion items={FAQ_ITEMS} />
    </main>
  );
}

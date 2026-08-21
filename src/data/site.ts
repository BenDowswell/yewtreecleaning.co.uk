/**
 * All site content in one place. Copy is taken verbatim from the approved
 * Claude Design file (`Yew Tree Cleaning.dc.html`, project 33097fe2-…).
 */

export const business = {
  name: 'Yew Tree Cleaning',
  phone: '07799 118358',
  phoneLink: 'tel:07799118358',
  email: 'joy.dowswell@gmail.com',
  whatsapp: 'https://wa.me/447799118358',
  address: {
    line1: 'Yew Tree Cottage',
    line2: 'The Holborn',
    town: 'Madeley',
    postcode: 'CW3 9DT',
    full: 'Yew Tree Cottage, The Holborn, Madeley, CW3 9DT',
  },
  hours: 'Mon–Fri, 9am–5pm',
  hourlyRate: 15,
  minimumHours: 2,
  /** Centre of the service area, used by the LocalBusiness GeoCircle. */
  geo: { latitude: 52.9736, longitude: -2.4432, radiusMetres: 16000 },
} as const;

/** Icon path data from the design's ICONS map. 24x24, outline, stroke 1.5. */
export const icons: Record<string, string[]> = {
  home: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z', 'M9 22v-10h6v10'],
  clean: [
    'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
  ],
  key: [
    'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z',
  ],
  bed: [
    'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  ],
  flame: [
    'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
    'M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z',
  ],
};

export interface Service {
  key: keyof typeof icons | string;
  name: string;
  description: string;
  meta: string;
}

export const services: Service[] = [
  {
    key: 'home',
    name: 'Regular Domestic Cleaning',
    description:
      'Keep your home fresh and tidy with a regular clean tailored to your routine — weekly, fortnightly or monthly.',
    meta: '2–4 hours · from £30',
  },
  {
    key: 'clean',
    name: 'Deep Cleaning',
    description:
      'A thorough top-to-bottom clean for homes that need extra attention, including skirting boards and light fittings.',
    meta: '4–6 hours · from £45',
  },
  {
    key: 'key',
    name: 'End of Tenancy Cleaning',
    description:
      'Leave your rental spotless and ready for inspection, cleaned to letting agent standards.',
    meta: '4–8 hours · from £60',
  },
  {
    key: 'bed',
    name: 'Airbnb / Holiday Let Cleaning',
    description:
      'Quick turnaround cleans between guests, with linen changes and restocking on request.',
    meta: '2–3 hours · from £30',
  },
  {
    key: 'flame',
    name: 'Oven Cleaning',
    description:
      'Interior, door glass and seals cleaned back to a shine. Hobs and extractor filters cleaned on request.',
    meta: '1–2 hours · from £30',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'What areas do you cover?',
    answer:
      'We’re based in Madeley and cover homes within approximately 10 miles of the surrounding area. If you’re unsure whether we reach your location, just get in touch and we’ll let you know.',
  },
  {
    question: 'How much do you charge?',
    answer:
      'Our rate is £15 per hour with a minimum booking of 2 hours. The exact time needed depends on the size of your home and the type of clean required.',
  },
  {
    question: 'Do I need to provide cleaning products?',
    answer:
      'Yes — please have your cleaning products and equipment ready for us. That way your home is cleaned with the products you already trust.',
  },
  {
    question: 'How do I book a clean?',
    answer:
      'Call us on 07799 118358, send a WhatsApp message, or email joy.dowswell@gmail.com. Bookings require at least 24 hours’ notice.',
  },
  {
    question: 'What happens after I request a booking?',
    answer:
      'We’ll check availability and confirm within 24 hours. Requests are not instantly confirmed — we always come back to you first.',
  },
  {
    question: 'Do you offer ironing?',
    answer: 'No, we don’t currently offer ironing as part of our service.',
  },
  {
    question: 'How do I pay?',
    answer:
      'Payment is made after the clean is completed. We’ll confirm payment details when we confirm your booking.',
  },
];

/** Rendered as a sentence in the areas section, exactly as the design writes it. */
export const areasSentence =
  'That covers Silverdale, Keele, Betley, Audley, Baldwins Gate, Whitmore, Loggerheads, Woore, Market Drayton and the villages in between.';

export const navLinks = [
  { href: '/#services', label: 'Services', footerLabel: 'Services' },
  { href: '/#why', label: 'Why us', footerLabel: 'Why choose us' },
  { href: '/#areas', label: 'Areas', footerLabel: 'Areas we cover' },
  { href: '/#faq', label: 'FAQ', footerLabel: 'FAQ' },
  { href: '/#contact', label: 'Contact', footerLabel: 'Contact' },
];

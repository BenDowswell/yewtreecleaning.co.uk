import type { Metadata } from 'next';
import ContactFormTabs from '@/components/forms/ContactFormTabs';
import ServiceAreaMap from '@/components/map/ServiceAreaMap';
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_LINK,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Yew Tree Cleaning. Call, email, or send us a message to book a clean or request a quote.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Whether you&apos;d like to book a clean, request a quote, or simply ask a
          question, we&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Left column — forms */}
        <div className="lg:col-span-3">
          <ContactFormTabs />
        </div>

        {/* Right column — contact details */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Contact Details
            </h2>

            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <a
                    href={BUSINESS_PHONE_LINK}
                    className="font-medium text-brand-green-700 hover:underline"
                  >
                    {BUSINESS_PHONE}
                  </a>
                  <p className="text-sm text-gray-500">Also available on WhatsApp</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="font-medium text-brand-green-700 hover:underline"
                >
                  {BUSINESS_EMAIL}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <address className="not-italic text-gray-700">
                  {BUSINESS_ADDRESS.line1}
                  <br />
                  {BUSINESS_ADDRESS.line2}
                  <br />
                  {BUSINESS_ADDRESS.town}
                  <br />
                  {BUSINESS_ADDRESS.postcode}
                </address>
              </div>

              {/* Opening hours */}
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-700">Opening Hours</p>
                  <p className="text-sm text-gray-500">
                    {BUSINESS_HOURS.days}, {BUSINESS_HOURS.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive map */}
            <div className="mt-6">
              <ServiceAreaMap height="h-48 lg:h-56" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

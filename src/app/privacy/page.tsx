import type { Metadata } from 'next';
import { BUSINESS_NAME, BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_ADDRESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Yew Tree Cleaning privacy policy to understand how we collect, use, and protect your personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-gray-500">
        This policy was last updated on 1 April 2026.
      </p>

      <div className="mt-10 space-y-10 text-gray-700 leading-relaxed">
        {/* 1 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Who we are</h2>
          <p>
            {BUSINESS_NAME} is a domestic cleaning business based at{' '}
            {BUSINESS_ADDRESS.full}. For any questions about this policy or your
            data, contact us at{' '}
            <a
              href={`mailto:${BUSINESS_EMAIL}`}
              className="text-brand-green-700 underline hover:text-brand-green-800"
            >
              {BUSINESS_EMAIL}
            </a>{' '}
            or call{' '}
            <a
              href={`tel:${BUSINESS_PHONE.replace(/\s/g, '')}`}
              className="text-brand-green-700 underline hover:text-brand-green-800"
            >
              {BUSINESS_PHONE}
            </a>
            .
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            What data we collect
          </h2>
          <p className="mb-3">
            We collect the following personal information when you use our website
            or book a service:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Your name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Home address and postcode</li>
            <li>Booking details including service type, date, and time</li>
            <li>Any messages or notes you provide</li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            How we use your data
          </h2>
          <p className="mb-3">We use your data to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Process and manage your booking requests</li>
            <li>Communicate with you about your bookings and enquiries</li>
            <li>Provide our cleaning services</li>
            <li>Improve our service</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            How we store your data
          </h2>
          <p>
            Your data is stored securely and is only accessible to{' '}
            {BUSINESS_NAME}. We do not sell, share, or transfer your personal data
            to third parties unless required by law.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            How long we keep your data
          </h2>
          <p>
            We retain your personal data for as long as necessary to provide our
            services and manage your account. If you request deletion of your data,
            we will do so within 30 days unless we are legally required to retain
            it.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Your rights</h2>
          <p className="mb-3">
            Under UK GDPR, you have the right to:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Restrict processing of your data</li>
            <li>Data portability</li>
            <li>Object to processing</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a
              href={`mailto:${BUSINESS_EMAIL}`}
              className="text-brand-green-700 underline hover:text-brand-green-800"
            >
              {BUSINESS_EMAIL}
            </a>
            .
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Cookies</h2>
          <p>
            This website uses only essential cookies required for the site to
            function. We do not use analytics or advertising cookies.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. Any changes will be posted
            on this page.
          </p>
        </section>
      </div>
    </main>
  );
}

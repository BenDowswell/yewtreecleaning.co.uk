import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/domain/service/data';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Browse our full range of domestic cleaning services including regular cleaning, deep cleaning, end of tenancy, Airbnb turnarounds, carpet cleaning, oven cleaning, and after-builders cleaning.',
};

const iconMap: Record<string, string> = {
  home: '\uD83C\uDFE0',
  sparkles: '\u2728',
  key: '\uD83D\uDD11',
  bed: '\uD83D\uDECF\uFE0F',
  layers: '\uD83E\uDDF9',
  flame: '\uD83D\uDD25',
  hammer: '\uD83D\uDD28',
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-blue-50 to-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Our Cleaning Services
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              From regular housekeeping to specialist one-off cleans, we offer a
              full range of domestic cleaning services. All services include
              cleaning products and equipment &mdash; just let us know if
              you&rsquo;d prefer eco-friendly products.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-100 text-xl">
                  <span aria-hidden="true">
                    {iconMap[service.icon] ?? '\uD83E\uDDF9'}
                  </span>
                </div>

                {/* Name */}
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {service.name}
                </h2>

                {/* Short description */}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                  {service.shortDescription}
                </p>

                {/* Features */}
                <ul className="mt-4 space-y-1.5">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-400"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/book"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-green-400 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-500 active:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:ring-offset-2"
                >
                  Book This Service
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="mt-12 text-center text-sm font-medium text-gray-500">
            All services from &pound;15 per hour &middot; Minimum 2 hours
            &middot; Products and equipment provided
          </p>
        </div>
      </section>
    </>
  );
}

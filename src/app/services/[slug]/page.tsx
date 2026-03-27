import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getServiceBySlug } from '@/domain/service/data';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: service.name,
    description: service.shortDescription,
  };
}

const iconMap: Record<string, string> = {
  home: '\uD83C\uDFE0',
  sparkles: '\u2728',
  key: '\uD83D\uDD11',
  bed: '\uD83D\uDECF\uFE0F',
  layers: '\uD83E\uDDF9',
  flame: '\uD83D\uDD25',
  hammer: '\uD83D\uDD28',
};

export default async function ServiceDetailPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-green-50 to-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link
                    href="/services"
                    className="transition-colors hover:text-brand-green-600"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
                <li className="text-gray-900 font-medium">{service.name}</li>
              </ol>
            </nav>

            {/* Icon and heading */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-100 text-2xl">
                <span aria-hidden="true">
                  {iconMap[service.icon] ?? '\uD83E\uDDF9'}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {service.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Full description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              About This Service
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              {service.longDescription}
            </p>
          </div>

          {/* Features */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">
              What&rsquo;s Included
            </h2>
            <ul className="mt-6 space-y-3">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-400"
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
          </div>

          {/* Pricing */}
          <div className="mt-12 rounded-2xl bg-brand-green-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-brand-green-600">
                &pound;{service.pricePerHour}
              </span>
              <span className="text-lg text-gray-500">per hour</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Minimum booking: {service.minimumHours} hours
              {service.estimatedDuration && (
                <span>
                  {' '}
                  &middot; Estimated duration: {service.estimatedDuration}
                </span>
              )}
            </p>
          </div>

          {/* Additional notes */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Good to Know</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue-400"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Available as a one-off or on a regular schedule (weekly,
                  fortnightly, or monthly).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue-400"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  All cleaning products and equipment provided. Eco-friendly
                  products available on request.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue-400"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  We cover Madeley and within approximately 10 miles of the
                  surrounding area.
                </span>
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl bg-brand-green-400 px-8 py-3.5 text-lg font-medium text-white transition-colors hover:bg-brand-green-500 active:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:ring-offset-2"
            >
              Book This Service
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-brand-green-400 px-8 py-3.5 text-lg font-medium text-brand-green-700 transition-colors hover:bg-brand-green-50 active:bg-brand-green-100 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:ring-offset-2"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

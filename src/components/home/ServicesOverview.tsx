import Link from 'next/link';
import { services } from '@/domain/service/data';
import ServiceCard from '@/components/services/ServiceCard';

const DISPLAY_COUNT = 6;

export default function ServicesOverview() {
  const displayedServices = services.slice(0, DISPLAY_COUNT);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Cleaning Services
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Whether you need a regular weekly clean or a thorough one-off deep
            clean, we offer a range of services to suit your home.
          </p>
        </div>

        {/* Service cards grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-xl bg-brand-green-400 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-brand-green-500 active:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:ring-offset-2"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

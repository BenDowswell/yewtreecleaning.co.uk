import Link from 'next/link';
import ServiceAreaMap from '@/components/map/ServiceAreaMap';

export default function AreaPreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Covering Madeley and Beyond
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              We serve homes in Madeley and within approximately 10 to 15 miles of the
              surrounding area, including nearby villages and towns.
            </p>
            <Link
              href="/areas"
              className="mt-6 inline-flex items-center gap-1 text-base font-medium text-brand-green-600 transition-colors hover:text-brand-green-700"
            >
              See full list of areas covered
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {/* Interactive map */}
          <ServiceAreaMap height="h-72 lg:h-96" />
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_PHONE, BUSINESS_PHONE_LINK } from '@/lib/constants';
import ServiceAreaMap from '@/components/map/ServiceAreaMap';

export const metadata: Metadata = {
  title: 'Areas We Cover',
  description:
    'Yew Tree Cleaning covers Madeley and approximately 10 miles of the surrounding area, including Silverdale, Keele, Betley, Audley, and more.',
};

const AREAS = [
  { name: 'Madeley', primary: true },
  { name: 'Silverdale', primary: false },
  { name: 'Keele', primary: false },
  { name: 'Betley', primary: false },
  { name: 'Audley', primary: false },
  { name: 'Baldwins Gate', primary: false },
  { name: 'Whitmore', primary: false },
  { name: 'Loggerheads', primary: false },
  { name: 'Ashley', primary: false },
  { name: 'Mucklestone', primary: false },
  { name: 'Norton in Hales', primary: false },
  { name: 'Woore', primary: false },
  { name: 'Pipe Gate', primary: false },
  { name: 'Market Drayton (outskirts)', primary: false },
  { name: 'Newcastle-under-Lyme (outskirts)', primary: false },
  { name: 'Nantwich (outskirts)', primary: false },
];

export default function AreasPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Areas We Cover
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Based in Madeley, we provide domestic cleaning services within
          approximately 10 miles of the surrounding area.
        </p>
      </div>

      {/* Areas grid */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {AREAS.map((area) => (
          <div
            key={area.name}
            className={`rounded-xl border px-4 py-3 text-center text-sm font-medium ${
              area.primary
                ? 'border-brand-green-300 bg-brand-green-50 text-brand-green-800'
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            {area.name}
            {area.primary && (
              <span className="ml-1.5 inline-block rounded-full bg-brand-green-200 px-2 py-0.5 text-xs text-brand-green-800">
                Base
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mb-10 rounded-2xl border border-brand-green-200 bg-brand-green-50 px-6 py-5 text-center">
        <p className="text-brand-green-800">
          Not sure if we cover your area? Give us a call on{' '}
          <a
            href={BUSINESS_PHONE_LINK}
            className="font-semibold text-brand-green-700 hover:underline"
          >
            {BUSINESS_PHONE}
          </a>{' '}
          or send a message &mdash; we&apos;re always happy to check.
        </p>
      </div>

      {/* Interactive map */}
      <div className="mb-10">
        <ServiceAreaMap height="h-80 lg:h-[28rem]" />
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/book"
          className="inline-block rounded-xl bg-brand-green-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-green-700"
        >
          Book a Clean
        </Link>
      </div>
    </main>
  );
}

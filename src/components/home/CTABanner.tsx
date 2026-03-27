import Link from 'next/link';
import { BUSINESS_PHONE, BUSINESS_PHONE_LINK } from '@/lib/constants';

export default function CTABanner() {
  return (
    <section className="bg-brand-green-400 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready for a Cleaner Home?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            Book your first clean today or get in touch for a free,
            no-obligation quote.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-medium text-brand-green-700 transition-colors hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-green-400"
            >
              Book Online
            </Link>
            <a
              href={BUSINESS_PHONE_LINK}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-green-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call {BUSINESS_PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

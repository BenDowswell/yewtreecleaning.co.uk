import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-green-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your Trusted Local Cleaner in{' '}
              <span className="text-brand-green-400">Madeley</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Reliable, friendly domestic cleaning for homes across Madeley and
              the surrounding area. From regular cleans to one-off deep cleans,
              we take the hassle out of keeping your home spotless.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-xl bg-brand-green-400 px-8 py-3.5 text-lg font-medium text-white transition-colors hover:bg-brand-green-500 active:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:ring-offset-2"
              >
                Book a Clean
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border-2 border-brand-green-400 px-8 py-3.5 text-lg font-medium text-brand-green-700 transition-colors hover:bg-brand-green-50 active:bg-brand-green-100 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:ring-offset-2"
              >
                Get a Free Quote
              </Link>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              From just &pound;15 per hour &middot; Minimum 2 hours
            </p>
          </div>

          {/* Decorative illustration area */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="relative flex h-96 w-96 items-center justify-center rounded-3xl bg-brand-green-100/60">
              {/* House icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-32 w-32 text-brand-green-400"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>

              {/* Sparkle decorations */}
              <div className="absolute right-8 top-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-brand-green-300"
                  aria-hidden="true"
                >
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
                </svg>
              </div>
              <div className="absolute bottom-16 left-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-brand-blue-300"
                  aria-hidden="true"
                >
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
                </svg>
              </div>
              <div className="absolute right-16 bottom-24">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-brand-purple-300"
                  aria-hidden="true"
                >
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Yew Tree Cleaning, a local and independent domestic cleaning service based in Madeley. Reliable, friendly, and trusted by homes across the area.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-green-50 to-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About Yew Tree Cleaning
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              A local, independent cleaning service you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Our Story */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Yew Tree Cleaning was founded with a simple idea: that everyone
              deserves to come home to a clean, comfortable space &mdash;
              without the stress of doing it all themselves.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              Based at Yew Tree Cottage in Madeley, we&rsquo;re a local,
              independent cleaning business offering a personal and reliable
              service to homes across the area. We believe in doing things
              properly, building trust with every clean, and treating your home
              with the same care we&rsquo;d give our own.
            </p>
          </div>

          {/* What We Offer */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">
              What We Offer
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              We specialise in regular domestic cleaning, but we also offer deep
              cleans, end of tenancy cleans, Airbnb turnarounds, carpet
              cleaning, oven cleaning, and after-builders cleans. Whether you
              need us every week or just for a one-off job, we&rsquo;ll work
              around your schedule and make sure the job is done to a high
              standard.
            </p>
          </div>

          {/* How We Work */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">How We Work</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Booking is straightforward. You choose your service, pick a
              preferred date and time, and we&rsquo;ll confirm your appointment.
              We bring all cleaning products and equipment &mdash; and if
              you&rsquo;d prefer eco-friendly products, just let us know.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              We charge a simple, honest rate of &pound;15 per hour with a
              minimum booking of 2 hours. No hidden fees, no complicated
              pricing.
            </p>
          </div>

          {/* Our Area */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Our Area</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              We&rsquo;re based in Madeley and cover homes within approximately
              10 miles of the surrounding area. If you&rsquo;re not sure whether
              we cover your location, get in touch and we&rsquo;ll let you know.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-brand-green-400 px-8 py-3.5 text-lg font-medium text-white transition-colors hover:bg-brand-green-500 active:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:ring-offset-2"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

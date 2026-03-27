import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-green-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-brand-green-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-green-700"
      >
        Go to Homepage
      </Link>
    </main>
  );
}

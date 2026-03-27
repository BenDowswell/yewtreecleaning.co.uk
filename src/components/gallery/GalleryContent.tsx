'use client';

import { useState } from 'react';

interface GalleryItem {
  label: string;
  colour: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { label: 'Kitchen Clean', colour: 'bg-brand-green-200 text-brand-green-800' },
  { label: 'Living Room', colour: 'bg-brand-blue-200 text-brand-blue-800' },
  { label: 'Bathroom', colour: 'bg-brand-purple-200 text-brand-purple-800' },
  { label: 'Oven Clean', colour: 'bg-brand-green-300 text-brand-green-900' },
  { label: 'Carpet Clean', colour: 'bg-brand-blue-300 text-brand-blue-900' },
  { label: 'End of Tenancy', colour: 'bg-brand-purple-300 text-brand-purple-900' },
  { label: 'Deep Clean', colour: 'bg-brand-green-100 text-brand-green-700' },
  { label: 'After Builders', colour: 'bg-brand-blue-100 text-brand-blue-700' },
];

export default function GalleryContent() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToPrevious = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? GALLERY_ITEMS.length - 1 : lightboxIndex - 1,
    );
  };

  const goToNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === GALLERY_ITEMS.length - 1 ? 0 : lightboxIndex + 1,
    );
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Our Work
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Here are some examples of the results we deliver for our customers
          across the area.
        </p>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {GALLERY_ITEMS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => openLightbox(index)}
            className={`flex aspect-square items-center justify-center rounded-2xl text-sm font-semibold transition hover:opacity-80 ${item.colour}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Photos will be added as we complete more work.
      </p>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image: ${GALLERY_ITEMS[lightboxIndex].label}`}
        >
          <div
            className="relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              aria-label="Close lightbox"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image placeholder */}
            <div
              className={`flex aspect-[4/3] items-center justify-center rounded-2xl text-lg font-bold ${GALLERY_ITEMS[lightboxIndex].colour}`}
            >
              {GALLERY_ITEMS[lightboxIndex].label}
            </div>

            {/* Navigation */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevious}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/30"
              >
                Previous
              </button>
              <span className="text-sm text-white/70">
                {lightboxIndex + 1} / {GALLERY_ITEMS.length}
              </span>
              <button
                type="button"
                onClick={goToNext}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/30"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

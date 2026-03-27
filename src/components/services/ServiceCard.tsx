import Link from 'next/link';
import type { Service } from '@/domain/service/types';

const iconMap: Record<string, string> = {
  home: '\uD83C\uDFE0',
  sparkles: '\u2728',
  key: '\uD83D\uDD11',
  bed: '\uD83D\uDECF\uFE0F',
  layers: '\uD83E\uDDF9',
  flame: '\uD83D\uDD25',
  hammer: '\uD83D\uDD28',
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const displayFeatures = service.features.slice(0, 3);

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-100 text-xl">
        <span aria-hidden="true">
          {iconMap[service.icon] ?? '\uD83E\uDDF9'}
        </span>
      </div>

      {/* Name */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {service.name}
      </h3>

      {/* Short description */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
        {service.shortDescription}
      </p>

      {/* Features preview */}
      <ul className="mt-4 space-y-1">
        {displayFeatures.map((feature) => (
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

      {/* Learn more link */}
      <Link
        href={`/services/${service.slug}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-green-600 transition-colors group-hover:text-brand-green-700"
      >
        Learn more
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
  );
}

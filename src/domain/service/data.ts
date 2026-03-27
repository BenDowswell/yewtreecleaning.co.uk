import type { Service } from './types';

export const services: Service[] = [
  {
    id: 'svc-001',
    slug: 'regular-domestic-cleaning',
    name: 'Regular Domestic Cleaning',
    shortDescription:
      'Keep your home fresh and tidy with a regular cleaning service tailored to your needs.',
    longDescription:
      'Our regular domestic cleaning service is designed to maintain your home to the highest standard. We work with you to create a bespoke cleaning schedule that fits your lifestyle, covering all the essentials from hoovering and dusting to bathroom and kitchen cleaning. Whether you need us weekly, fortnightly, or monthly, we ensure your home always feels welcoming and spotless.',
    pricePerHour: 15,
    minimumHours: 2,
    estimatedDuration: '2\u20134 hours',
    icon: 'home',
    features: [
      'Hoovering, mopping, and dusting throughout',
      'Kitchen and bathroom cleaning',
      'Bed making and linen changes',
      'Flexible scheduling to suit your routine',
    ],
    popular: true,
  },
  {
    id: 'svc-002',
    slug: 'deep-cleaning',
    name: 'Deep Cleaning',
    shortDescription:
      'A thorough top-to-bottom clean for homes that need extra attention.',
    longDescription:
      'Our deep cleaning service goes far beyond a standard clean. We tackle built-up grime, forgotten corners, and hard-to-reach areas to leave your home feeling completely refreshed. Ideal as a one-off spring clean or as a first visit before starting a regular service, this comprehensive clean covers every room in detail.',
    pricePerHour: 15,
    minimumHours: 3,
    estimatedDuration: '4\u20136 hours',
    icon: 'sparkles',
    features: [
      'Detailed cleaning of all rooms including skirting boards and light fittings',
      'Inside window sills, door frames, and fixtures',
      'Deep scrubbing of kitchens and bathrooms',
      'Ideal as a one-off or before starting a regular service',
    ],
  },
  {
    id: 'svc-003',
    slug: 'end-of-tenancy-cleaning',
    name: 'End of Tenancy Cleaning',
    shortDescription:
      'Leave your rental spotless and ready for inspection.',
    longDescription:
      'Moving out can be stressful enough without worrying about the cleaning. Our end of tenancy service ensures the property is left in immaculate condition, meeting the standards required by landlords and letting agents. We cover every area from oven cleaning to carpet freshening, helping you get your full deposit back.',
    pricePerHour: 15,
    minimumHours: 4,
    estimatedDuration: '4\u20138 hours',
    icon: 'key',
    features: [
      'Full property clean to letting agent standards',
      'Oven and appliance cleaning included',
      'Inside cupboards, drawers, and wardrobes',
      'Helps secure your deposit return',
    ],
  },
  {
    id: 'svc-004',
    slug: 'airbnb-holiday-let-cleaning',
    name: 'Airbnb / Holiday Let Cleaning',
    shortDescription:
      'Quick turnaround cleans between guests, keeping your property guest-ready.',
    longDescription:
      'First impressions matter for holiday lets and Airbnb properties. Our changeover cleaning service ensures your property is spotless and welcoming for every new guest. We work to tight schedules and can handle linen changes, restocking essentials, and a thorough clean of all living spaces, kitchens, and bathrooms.',
    pricePerHour: 15,
    minimumHours: 2,
    estimatedDuration: '2\u20133 hours',
    icon: 'bed',
    features: [
      'Fast turnaround between guest check-out and check-in',
      'Linen changes and towel replacement',
      'Kitchen and bathroom deep clean',
      'Restocking of guest essentials on request',
    ],
  },
  {
    id: 'svc-005',
    slug: 'carpet-cleaning',
    name: 'Carpet Cleaning',
    shortDescription:
      'Refresh and revitalise your carpets with a professional deep clean.',
    longDescription:
      'Over time, carpets accumulate dirt, dust, and allergens that regular hoovering cannot remove. Our professional carpet cleaning service uses effective techniques to lift stains, remove odours, and restore the appearance of your carpets. Suitable for individual rooms or whole-house treatments.',
    pricePerHour: 15,
    minimumHours: 2,
    estimatedDuration: '1\u20133 hours',
    icon: 'layers',
    features: [
      'Deep extraction cleaning for stubborn dirt and stains',
      'Odour removal and freshening',
      'Suitable for all carpet types',
    ],
  },
  {
    id: 'svc-006',
    slug: 'oven-cleaning',
    name: 'Oven Cleaning',
    shortDescription:
      'Restore your oven to its best with a detailed professional clean.',
    longDescription:
      'A grimy oven is not only unpleasant but can affect the taste of your food and even pose a fire risk. Our oven cleaning service dismantles removable parts and thoroughly cleans every surface, including racks, trays, the door glass, and the interior. Your oven will look and perform like new.',
    pricePerHour: 15,
    minimumHours: 2,
    estimatedDuration: '1\u20132 hours',
    icon: 'flame',
    features: [
      'Full disassembly and cleaning of removable parts',
      'Interior, door glass, and seal cleaning',
      'Hob and extractor hood cleaning available',
    ],
  },
  {
    id: 'svc-007',
    slug: 'after-builders-cleaning',
    name: 'After-Builders Cleaning',
    shortDescription:
      'Remove dust, debris, and mess left behind after building or renovation work.',
    longDescription:
      'Building work leaves behind a surprising amount of dust, plaster residue, and debris that settles on every surface. Our after-builders cleaning service tackles this specialist clean-up, removing fine dust from hard-to-reach places, cleaning windows and frames, and ensuring your newly renovated space is ready to enjoy.',
    pricePerHour: 15,
    minimumHours: 3,
    estimatedDuration: '4\u20138 hours',
    icon: 'hammer',
    features: [
      'Removal of construction dust and plaster residue',
      'Window, frame, and sill cleaning',
      'Floor scrubbing and surface polishing',
      'Disposal of leftover packaging and debris',
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getPopularServices(): Service[] {
  return services.filter((s) => s.popular);
}

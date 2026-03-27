export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  pricePerHour: number;
  minimumHours: number;
  estimatedDuration?: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

export type ServiceSlug =
  | 'regular-domestic-cleaning'
  | 'deep-cleaning'
  | 'end-of-tenancy-cleaning'
  | 'airbnb-holiday-let-cleaning'
  | 'carpet-cleaning'
  | 'oven-cleaning'
  | 'after-builders-cleaning';

import { type ReactNode } from 'react';

type BadgeVariant = 'green' | 'blue' | 'purple' | 'gray' | 'red' | 'yellow';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-brand-green-100 text-brand-green-800',
  blue: 'bg-brand-blue-100 text-brand-blue-800',
  purple: 'bg-brand-purple-100 text-brand-purple-800',
  gray: 'bg-gray-100 text-gray-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-800',
};

export default function Badge({ variant = 'green', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

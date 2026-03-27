'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface MobileNavItem {
  label: string;
  href: string;
  icon: string;
}

const mobileNavItems: MobileNavItem[] = [
  { label: 'Bookings', href: '/dashboard', icon: '[calendar]' },
  { label: 'Profile', href: '/dashboard/profile', icon: '[user]' },
  { label: 'Messages', href: '/dashboard/messages', icon: '[envelope]' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-brand-green-400 border-t-transparent border-3" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop layout */}
      <div className="hidden md:flex">
        <DashboardSidebar />
        <main className="flex-1 p-8 max-w-5xl">{children}</main>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <main className="p-4 pb-24">{children}</main>

        {/* Bottom navigation bar */}
        <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40">
          <ul className="flex justify-around">
            {mobileNavItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-brand-green-600'
                        : 'text-gray-500 hover:text-brand-green-500'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

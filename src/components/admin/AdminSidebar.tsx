'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: '[dashboard]' },
  { label: 'Bookings', href: '/admin/bookings', icon: '[calendar]' },
  { label: 'Availability', href: '/admin/availability', icon: '[clock]' },
  { label: 'Customers', href: '/admin/customers', icon: '[people]' },
  { label: 'Messages', href: '/admin/messages', icon: '[envelope]' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-brand-green-900 text-white w-64 min-h-screen">
      {/* Admin title */}
      <div className="px-6 py-8 border-b border-brand-green-800">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-brand-green-400 px-2 py-0.5 text-xs font-semibold text-white">
            Admin
          </span>
        </div>
        <p className="text-lg font-semibold mt-2">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-brand-green-400 text-white'
                      : 'text-brand-green-100 hover:bg-brand-green-800 hover:text-white'
                  }`}
                >
                  <span className="text-xs opacity-80">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-brand-green-800">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-green-200 hover:bg-brand-green-800 hover:text-white transition-colors duration-200"
        >
          <span className="text-xs opacity-80">[logout]</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}

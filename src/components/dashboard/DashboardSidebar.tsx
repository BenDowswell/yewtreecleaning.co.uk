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
  { label: 'My Bookings', href: '/dashboard', icon: '[calendar]' },
  { label: 'Profile', href: '/dashboard/profile', icon: '[user]' },
  { label: 'Messages', href: '/dashboard/messages', icon: '[envelope]' },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-brand-green-900 text-white w-64 min-h-screen">
      {/* User greeting */}
      <div className="px-6 py-8 border-b border-brand-green-800">
        <p className="text-brand-green-200 text-sm">Welcome back</p>
        <p className="text-lg font-semibold mt-1">
          Hello, {user?.name?.split(' ')[0] ?? 'there'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
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

import type { Metadata } from 'next';
import LoginContent from '@/components/forms/LoginContent';

export const metadata: Metadata = {
  title: 'Customer Login',
  description:
    'Log in to your Yew Tree Cleaning account to manage your bookings.',
};

export default function LoginPage() {
  return <LoginContent />;
}

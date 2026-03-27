import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import JsonLd from '@/components/seo/JsonLd';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Yew Tree Cleaning | Reliable Domestic Cleaner in Madeley',
    template: '%s | Yew Tree Cleaning',
  },
  description:
    'Professional, reliable domestic cleaning in Madeley and the surrounding area. Regular cleans, deep cleaning, end of tenancy, and more. Book online or call 07799 118358.',
  keywords: [
    'domestic cleaner',
    'cleaner Madeley',
    'cleaner near me',
    'house cleaning Madeley',
    'regular cleaning',
    'deep cleaning',
    'end of tenancy cleaning',
    'cleaning service Shropshire',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Yew Tree Cleaning',
    title: 'Yew Tree Cleaning | Reliable Domestic Cleaner in Madeley',
    description:
      'Professional, reliable domestic cleaning in Madeley and the surrounding area. Book online or call 07799 118358.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <JsonLd />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}

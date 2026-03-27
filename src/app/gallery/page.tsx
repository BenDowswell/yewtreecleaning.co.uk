import type { Metadata } from 'next';
import GalleryContent from '@/components/gallery/GalleryContent';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'See examples of our cleaning work across Madeley and the surrounding area.',
};

export default function GalleryPage() {
  return <GalleryContent />;
}

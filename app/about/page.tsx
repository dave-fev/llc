import { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';
import { getSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = await getSEOMetadata('/about');

export default function AboutPage() {
  return <AboutPageClient />;
}


import { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';
import { getSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = await getSEOMetadata('/contact');

export default function ContactPage() {
  return <ContactPageClient />;
}

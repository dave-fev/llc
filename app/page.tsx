import { Metadata } from 'next';
import { LandingPage } from './components/LandingPage';
import { getSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = await getSEOMetadata('/');

export default function Home() {
  return <LandingPage />;
}

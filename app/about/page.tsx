import AboutPageClient from '@/components/about/AboutPageClient';
import { aboutMetadata } from '@/lib/metadata';

export const metadata = aboutMetadata;

export default function AboutPage() {
  return <AboutPageClient />;
}

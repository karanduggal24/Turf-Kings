import ContactPageClient from '@/components/contact/ContactPageClient';
import { contactMetadata } from '@/lib/metadata';

export const metadata = contactMetadata;

export default function ContactPage() {
  return <ContactPageClient />;
}

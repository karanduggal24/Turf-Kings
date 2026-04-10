import BecomeOwnerClient from '@/components/owner/BecomeOwnerClient';
import { becomeOwnerMetadata } from '@/lib/metadata';

export const metadata = becomeOwnerMetadata;

export default function BecomeOwnerPage() {
  return <BecomeOwnerClient />;
}

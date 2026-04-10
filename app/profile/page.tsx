import ProfilePageClient from '@/components/profile/ProfilePageClient';
import { profileMetadata } from '@/lib/metadata';

export const metadata = profileMetadata;

export default function ProfilePage() {
  return <ProfilePageClient />;
}

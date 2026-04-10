import LoginPageClient from '@/components/auth/LoginPageClient';
import { loginMetadata } from '@/lib/metadata';

export const metadata = loginMetadata;

export default function LoginPage() {
  return <LoginPageClient />;
}

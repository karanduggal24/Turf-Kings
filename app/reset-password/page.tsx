import ResetPasswordClient from '@/components/auth/ResetPasswordClient';
import { resetPasswordMetadata } from '@/lib/metadata';

export const metadata = resetPasswordMetadata;

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}

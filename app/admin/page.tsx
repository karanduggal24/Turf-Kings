import { Metadata } from 'next';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | TurfKings',
  description: 'Admin dashboard for managing turfs, bookings, and users',
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}

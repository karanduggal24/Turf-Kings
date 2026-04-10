'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function VenuesSubNav() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [pending, rejected]: any[] = await Promise.all([
          adminApi.getPendingVenues(),
          adminApi.getRejectedVenues(),
        ]);
        setPendingCount(pending.venues?.length || 0);
        setRejectedCount(rejected.venues?.length || 0);
      } catch {}
    }
    fetchCounts();
  }, []);

  const isAllVenues = pathname === '/admin/venues';
  const isPendingRequests = pathname === '/admin/venues/requests';
  const isRejected = pathname === '/admin/venues/rejected';
  const isMaintenanceMode = pathname === '/admin/venues/maintenance';

  return (
    <div className="flex items-center gap-8 border-b border-primary/10 mb-8">
      <Link
        href="/admin/venues"
        className={`pb-4 font-medium transition-colors border-b-2 ${
          isAllVenues
            ? 'text-primary border-primary'
            : 'text-gray-400 hover:text-primary border-transparent'
        }`}
      >
        All Venues
      </Link>
      <Link
        href="/admin/venues/requests"
        className={`pb-4 font-medium transition-colors border-b-2 relative ${
          isPendingRequests
            ? 'text-primary border-primary font-bold'
            : 'text-gray-400 hover:text-primary border-transparent'
        }`}
      >
        Pending Requests
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-4 bg-yellow-500 text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {pendingCount}
          </span>
        )}
      </Link>
      <Link
        href="/admin/venues/rejected"
        className={`pb-4 font-medium transition-colors border-b-2 relative ${
          isRejected
            ? 'text-primary border-primary'
            : 'text-gray-400 hover:text-primary border-transparent'
        }`}
      >
        Rejected
        {rejectedCount > 0 && (
          <span className="absolute -top-1 -right-4 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {rejectedCount}
          </span>
        )}
      </Link>
      <Link
        href="/admin/venues/maintenance"
        className={`pb-4 font-medium transition-colors border-b-2 ${
          isMaintenanceMode
            ? 'text-primary border-primary'
            : 'text-gray-400 hover:text-primary border-transparent'
        }`}
      >
        Maintenance Mode
      </Link>
    </div>
  );
}

'use client';

import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Venue {
  id: string;
  name: string;
  description?: string;
  location?: string;
  city: string;
  state: string;
  phone?: string;
  amenities?: string[];
  images: string[];
  total_turfs: number;
  available_sports: string[];
  min_price?: number;
  max_price?: number;
  owner: {
    full_name: string;
    email: string;
  };
  turfs?: any[];
  created_at: string;
}

interface VenueTableBaseProps {
  venues: Venue[];
  loading: boolean;
  emptyMessage: string;
  children: React.ReactNode;
  dateColumnLabel?: string;
}

export default function VenueTableBase({
  venues,
  loading,
  emptyMessage,
  children,
  dateColumnLabel = 'Submitted'
}: VenueTableBaseProps) {
  if (loading) {
    return (
      <div className="bg-white/5 border border-primary/10 rounded-xl p-12">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-primary/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Venue Details</th>
              <th className="px-6 py-4">Turfs</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">{dateColumnLabel}</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {venues.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>

      {venues.length > 0 && (
        <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-bold text-white">{venues.length}</span> venue{venues.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

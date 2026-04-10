'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ownerApi } from '@/lib/api';
import AlertModal from '@/components/common/AlertModal';

interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  images: string[];
  is_active: boolean;
  approval_status: string;
  total_turfs: number;
  available_sports: string[];
  min_price: number;
  max_price: number;
  rating: number;
  total_reviews: number;
}

const statusBadge = (v: Venue) => {
  if (v.approval_status === 'pending') return { label: 'Pending Review', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
  if (v.approval_status === 'rejected') return { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20' };
  if (!v.is_active) return { label: 'Maintenance', cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  return { label: 'Active', cls: 'bg-primary/10 text-primary border-primary/20' };
};

export default function OwnerVenuesClient() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false, message: '', type: 'success',
  });

  useEffect(() => {
    ownerApi.getVenues()
      .then((data: any) => setVenues(data.venues || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleMaintenance = async (venue: Venue) => {
    setTogglingId(venue.id);
    try {
      await ownerApi.toggleVenueMaintenance(venue.id, !venue.is_active);
      setVenues(prev => prev.map(v =>
        v.id === venue.id ? { ...v, is_active: !v.is_active } : v
      ));
      setAlert({
        open: true,
        message: venue.is_active
          ? `${venue.name} is now in maintenance mode.`
          : `${venue.name} is now active and accepting bookings.`,
        type: 'success',
      });
    } catch (err: any) {
      setAlert({ open: true, message: err.message || 'Failed to update venue.', type: 'error' });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">My Venues</h1>
          <p className="text-gray-400 mt-1">{venues.length} venue{venues.length !== 1 ? 's' : ''} listed</p>
        </div>
        <Link
          href="/list-venue"
          className="inline-flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:brightness-110 transition-all text-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Venue
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-primary/10 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">stadium</span>
          <p className="text-xl font-bold text-white mb-2">No venues yet</p>
          <p className="text-gray-400 mb-6">List your first venue to start accepting bookings</p>
          <Link href="/list-venue" className="bg-primary text-black font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all">
            List a Venue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {venues.map(venue => {
            const badge = statusBadge(venue);
            const isApproved = venue.approval_status === 'approved';
            const isToggling = togglingId === venue.id;

            return (
              <div key={venue.id} className="bg-white/5 border border-primary/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={venue.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{venue.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {venue.city}, {venue.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">sports_soccer</span>
                      {venue.total_turfs} turf{venue.total_turfs !== 1 ? 's' : ''}
                    </span>
                    {venue.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-yellow-400">star</span>
                        {venue.rating} ({venue.total_reviews})
                      </span>
                    )}
                    {venue.min_price > 0 && (
                      <span className="text-primary font-semibold ml-auto">₹{venue.min_price}/hr</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/owner/venues/edit/${venue.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-primary/20 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </Link>
                    {isApproved && (
                      <Link
                        href={`/turfs/${venue.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </Link>
                    )}
                  </div>

                  {/* Maintenance toggle — only for approved venues */}
                  {isApproved && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <p className="text-xs font-semibold text-gray-400">Maintenance Mode</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {!venue.is_active ? 'Venue is closed for bookings' : 'Venue is accepting bookings'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleMaintenance(venue)}
                        disabled={isToggling}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                        style={{ backgroundColor: !venue.is_active ? '#ef4444' : '#374151' }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            !venue.is_active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert(a => ({ ...a, open: false }))}
        title={alert.type === 'success' ? 'Updated' : 'Error'}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}

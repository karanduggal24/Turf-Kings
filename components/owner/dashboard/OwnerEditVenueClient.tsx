'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VenueFormEditNew from '@/components/venue/VenueFormEditNew';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import { ownerApi } from '@/lib/api';

interface OwnerEditVenueClientProps {
  venueId: string;
}

export default function OwnerEditVenueClient({ venueId }: OwnerEditVenueClientProps) {
  const router = useRouter();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchVenue() {
      try {
        // Fetch all owner venues and find the matching one
        // This ensures the owner can only edit their own venues
        const data: any = await ownerApi.getVenues();
        const found = (data.venues || []).find((v: any) => v.id === venueId);

        if (!found) {
          setError('Venue not found or you do not have permission to edit it.');
        } else {
          setVenue(found);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load venue');
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [venueId]);

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="bg-white/5 border border-primary/10 rounded-xl p-12 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading venue details..." />
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="p-6 lg:p-10">
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 block mb-4">error</span>
          <p className="text-red-500 text-lg font-bold">{error || 'Venue not found'}</p>
          <Button onClick={() => router.push('/owner/venues')} className="mt-4">
            Back to My Venues
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <button onClick={() => router.push('/owner/venues')} className="hover:text-primary transition-colors">
            My Venues
          </button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary/80">Edit Venue</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">Edit Venue</h1>
        <p className="text-gray-400 mt-1">Update your venue information and turfs</p>
      </div>

      <VenueFormEditNew venue={venue} redirectTo="/owner/venues" />
    </div>
  );
}

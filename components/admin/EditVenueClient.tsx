'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VenueFormEdit from '@/components/venue/VenueFormEdit';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

interface EditVenueClientProps {
  turfId: string;
}

export default function EditVenueClient({ turfId }: EditVenueClientProps) {
  const router = useRouter();
  const [turf, setTurf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTurf();
  }, [turfId]);

  async function fetchTurf() {
    try {
      setLoading(true);
      console.log('Fetching turf with ID:', turfId);
      const response = await fetch(`/api/admin/turfs/${turfId}`);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch turf details');
      }

      setTurf(data.turf);
    } catch (err: any) {
      console.error('Error fetching turf:', err);
      setError(err.message || 'Failed to load turf');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <header className="p-6 lg:p-10 pb-0">
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Venues</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary/80">Edit Venue</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">Edit Venue</h1>
          </div>
        </header>

        <div className="p-6 lg:p-10 pt-6">
          <div className="bg-white/5 border border-primary/10 rounded-xl p-12 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading venue details..." />
          </div>
        </div>
      </>
    );
  }

  if (error || !turf) {
    return (
      <>
        <header className="p-6 lg:p-10 pb-0">
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Venues</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary/80">Edit Venue</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">Edit Venue</h1>
          </div>
        </header>

        <div className="p-6 lg:p-10 pt-6">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
            <p className="text-red-500 text-lg font-bold">{error || 'Turf not found'}</p>
            <Button
              onClick={() => router.push('/admin/venues')}
              className="mt-4"
            >
              Back to Venues
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="p-6 lg:p-10 pb-0">
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>Admin</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>Venues</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary/80">Edit Venue</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">Edit Venue</h1>
          <p className="text-gray-400 mt-1">Update venue information and settings</p>
        </div>
      </header>

      <div className="p-6 lg:p-10 pt-6">
        <VenueFormEdit turf={turf} />
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import VenueCard from './venues/VenueCard';
import VenueGridPagination from './venues/VenueGridPagination';

interface Turf {
  id: string;
  name: string;
  location: string;
  city: string;
  images: string[];
  rating: number;
  total_reviews: number;
  total_turfs?: number;
  is_active: boolean;
  owner: {
    full_name: string;
    email: string;
  };
}

interface VenuesGridProps {
  searchQuery: string;
  onStatsChange: () => void;
}

export default function VenuesGrid({ searchQuery, onStatsChange }: VenuesGridProps) {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchTurfs();
  }, [page, debouncedSearchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  async function fetchTurfs() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/venues?page=${page}&limit=6&search=${encodeURIComponent(debouncedSearchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setTurfs(data.turfs);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching turfs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleMaintenance(turfId: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/admin/venues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: turfId,
          is_active: !currentStatus,
        }),
      });

      if (response.ok) {
        setTurfs(turfs.map(turf => 
          turf.id === turfId ? { ...turf, is_active: !currentStatus } : turf
        ));
        onStatsChange();
      }
    } catch (error) {
      console.error('Error toggling maintenance:', error);
    }
  }

  const handleDeleteClick = (turf: Turf) => {
    setVenueToDelete({ id: turf.id, name: turf.name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!venueToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/admin/venues', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: venueToDelete.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setTurfs(turfs.filter(turf => turf.id !== venueToDelete.id));
        setDeleteModalOpen(false);
        setVenueToDelete(null);
        onStatsChange();
        setAlertModal({
          isOpen: true,
          title: 'Venue Deleted',
          message: 'The venue has been successfully deleted.',
          type: 'success'
        });
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Deletion Failed',
          message: data.error || 'Failed to delete venue. Please try again.',
          type: 'error'
        });
      }
    } catch (error: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Network error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading venues..." />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {turfs.map((turf) => (
          <div key={turf.id} className="relative">
            <VenueCard
              venue={turf}
              onToggleMaintenance={toggleMaintenance}
            />
            <button
              onClick={() => handleDeleteClick(turf)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md text-white rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors z-10"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        ))}

        {/* Add New Placeholder */}
        <a
          href="/list-venue"
          className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl min-h-[400px] group hover:bg-primary/10 transition-all"
        >
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <h4 className="text-lg font-bold text-white">Register New Venue</h4>
          <p className="text-sm text-gray-400 px-10 text-center">
            Add another turf to the network and expand your management reach.
          </p>
        </a>
      </div>

      <VenueGridPagination
        page={page}
        totalPages={totalPages}
        total={total}
        displayCount={turfs.length}
        onPageChange={setPage}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVenueToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        venueName={venueToDelete?.name || ''}
        isDeleting={isDeleting}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import AlertModal from '@/components/common/AlertModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import VenueTableBase from './venues/VenueTableBase';
import VenueTableRow from './venues/VenueTableRow';
import VenueDetailModal from './venues/VenueDetailModal';
import { useVenueActions } from '@/hooks/useVenueActions';

interface Turf {
  id: string;
  name: string;
  sport_type: string;
  price_per_hour: number;
}

interface RejectedVenue {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  state: string;
  phone: string;
  amenities: string[];
  images: string[];
  created_at: string;
  owner: {
    full_name: string;
    email: string;
  };
  turfs: Turf[];
  total_turfs: number;
  available_sports: string[];
  min_price: number;
  max_price: number;
}

interface RejectedVenuesTableProps {
  searchQuery: string;
}

export default function RejectedVenuesTable({ searchQuery }: RejectedVenuesTableProps) {
  const [venues, setVenues] = useState<RejectedVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<RejectedVenue | null>(null);
  const { actionLoading, alertModal, closeAlert, approveVenue, deleteVenue } = useVenueActions();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    fetchRejectedVenues();
  }, [searchQuery]);

  async function fetchRejectedVenues() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/rejected-venues');
      
      if (response.ok) {
        const data = await response.json();
        setVenues(data.venues || []);
      }
    } catch (error) {
      console.error('Error fetching rejected venues:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReactivate(venueId: string) {
    const success = await approveVenue(venueId);
    if (success) {
      setVenues(venues.filter(v => v.id !== venueId));
      setSelectedVenue(null);
    }
  }

  function confirmDelete(venueId: string) {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Venue Permanently',
      message: 'Are you sure you want to permanently delete this venue? This action cannot be undone.',
      onConfirm: () => handleDelete(venueId)
    });
  }

  async function handleDelete(venueId: string) {
    setConfirmModal({ ...confirmModal, isOpen: false });
    const success = await deleteVenue(venueId);
    if (success) {
      setVenues(venues.filter(v => v.id !== venueId));
      setSelectedVenue(null);
    }
  }

  return (
    <>
      <VenueTableBase
        venues={venues}
        loading={loading}
        emptyMessage="No rejected venues"
        dateColumnLabel="Rejected On"
      >
        {venues.map((venue) => (
          <VenueTableRow
            key={venue.id}
            venue={venue}
            onViewDetails={(v) => setSelectedVenue(v as RejectedVenue)}
            accentColor="red"
            statusBadge={
              <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                REJECTED
              </span>
            }
            actionButtons={
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => confirmDelete(venue.id)}
                  disabled={actionLoading}
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleReactivate(venue.id)}
                  disabled={actionLoading}
                >
                  Reactivate
                </Button>
              </>
            }
          />
        ))}
      </VenueTableBase>

      <VenueDetailModal
        venue={selectedVenue}
        isOpen={!!selectedVenue}
        onClose={() => setSelectedVenue(null)}
        accentColor="red"
        actionButtons={
          selectedVenue && (
            <>
              <Button
                variant="danger"
                onClick={() => confirmDelete(selectedVenue.id)}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Delete Permanently
              </Button>
              <Button
                variant="primary"
                onClick={() => handleReactivate(selectedVenue.id)}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Reactivate Venue
              </Button>
            </>
          )
        }
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
        loading={actionLoading}
      />
    </>
  );
}

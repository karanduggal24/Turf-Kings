'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import AlertModal from '@/components/common/AlertModal';
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

interface PendingVenue {
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

interface PendingVenuesTableProps {
  searchQuery: string;
}

export default function PendingVenuesTable({ searchQuery }: PendingVenuesTableProps) {
  const [venues, setVenues] = useState<PendingVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<PendingVenue | null>(null);
  const { actionLoading, alertModal, closeAlert, approveVenue, rejectVenue } = useVenueActions();

  useEffect(() => {
    fetchPendingVenues();
  }, [searchQuery]);

  async function fetchPendingVenues() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pending-venues');
      
      if (response.ok) {
        const data = await response.json();
        setVenues(data.venues || []);
      }
    } catch (error) {
      console.error('Error fetching pending venues:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(venueId: string) {
    const success = await approveVenue(venueId);
    if (success) {
      setVenues(venues.filter(v => v.id !== venueId));
      setSelectedVenue(null);
    }
  }

  async function handleReject(venueId: string) {
    const success = await rejectVenue(venueId);
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
        emptyMessage="No pending venue requests"
        dateColumnLabel="Submitted"
      >
        {venues.map((venue) => (
          <VenueTableRow
            key={venue.id}
            venue={venue}
            onViewDetails={(v) => setSelectedVenue(v as PendingVenue)}
            accentColor="primary"
            statusBadge={
              <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                PENDING
              </span>
            }
            actionButtons={
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(venue.id)}
                  disabled={actionLoading}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(venue.id)}
                  disabled={actionLoading}
                >
                  Approve
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
        accentColor="primary"
        actionButtons={
          selectedVenue && (
            <>
              <Button
                variant="danger"
                onClick={() => handleReject(selectedVenue.id)}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Reject Venue
              </Button>
              <Button
                variant="primary"
                onClick={() => handleApprove(selectedVenue.id)}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Approve Venue
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
    </>
  );
}

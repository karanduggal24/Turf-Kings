'use client';

import { useEffect, useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

interface RejectedTurf {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  state: string;
  phone: string;
  price_per_hour: number;
  sport_type: string;
  amenities: string[];
  images: string[];
  created_at: string;
  owner: {
    full_name: string;
    email: string;
  };
}

interface RejectedTurfsTableProps {
  searchQuery: string;
}

export default function RejectedTurfsTable({ searchQuery }: RejectedTurfsTableProps) {
  const [turfs, setTurfs] = useState<RejectedTurf[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurf, setSelectedTurf] = useState<RejectedTurf | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [turfToDelete, setTurfToDelete] = useState<RejectedTurf | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRejectedTurfs();
  }, [searchQuery]);

  async function fetchRejectedTurfs() {
    try {
      setLoading(true);
      console.log('Fetching rejected turfs...');
      const response = await fetch('/api/admin/rejected-turfs');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Rejected turfs data:', data);
        console.log('Number of rejected turfs:', data.turfs?.length || 0);
        setTurfs(data.turfs || []);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching rejected turfs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReApprove(turfId: string) {
    try {
      const response = await fetch('/api/admin/venues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: turfId,
          is_active: true,
          approval_status: 'approved',
        }),
      });

      if (response.ok) {
        // Remove from list and close modal
        setTurfs(turfs.filter(t => t.id !== turfId));
        setShowModal(false);
        setSelectedTurf(null);
      }
    } catch (error) {
      console.error('Error re-approving turf:', error);
    }
  }

  async function handleDelete(turfId: string) {
    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/admin/venues', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: turfId }),
      });

      if (response.ok) {
        setTurfs(turfs.filter(t => t.id !== turfId));
        setShowModal(false);
        setSelectedTurf(null);
        setShowDeleteModal(false);
        setTurfToDelete(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete venue');
      }
    } catch (error) {
      console.error('Error deleting turf:', error);
      alert('Failed to delete venue');
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteModal(turf: RejectedTurf) {
    setTurfToDelete(turf);
    setShowDeleteModal(true);
  }

  function openModal(turf: RejectedTurf) {
    setSelectedTurf(turf);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedTurf(null);
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-primary/10 rounded-xl p-12">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <>
    <div className="bg-white/5 border border-primary/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Venue Details</th>
              <th className="px-6 py-4">Owner Name</th>
              <th className="px-6 py-4">Rejection Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {turfs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No rejected venues
                </td>
              </tr>
            ) : (
              turfs.map((turf) => (
                <tr 
                  key={turf.id} 
                  className="group hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => openModal(turf)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img
                          alt="Venue"
                          className="w-full h-full object-cover"
                          src={turf.images[0] || '/placeholder-turf.jpg'}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white">{turf.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">location_on</span>
                          {turf.location}, {turf.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {getInitials(turf.owner?.full_name || 'U')}
                      </div>
                      <span className="text-sm font-medium text-white">
                        {turf.owner?.full_name || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-400">{formatDate(turf.created_at)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="danger" size="md">REJECTED</Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          openDeleteModal(turf);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleReApprove(turf.id);
                        }}
                      >
                        Re-Approve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {turfs.length > 0 && (
        <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-bold text-white">{turfs.length}</span> of{' '}
            <span className="font-bold text-white">{turfs.length}</span> rejected venues
          </p>
        </div>
      )}
    </div>

      {/* Detail Modal */}
      {showModal && selectedTurf && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-900 border border-primary/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-primary/10 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Rejected Venue Details</h2>
                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 mt-2">
                  REJECTED
                </span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            {/* Modal Content - Same as PendingTurfsTable */}
            <div className="p-6 space-y-6">
              {selectedTurf.images && selectedTurf.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedTurf.images.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${selectedTurf.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Venue Name</label>
                  <p className="text-lg font-bold text-white mt-1">{selectedTurf.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Sport Type</label>
                  <p className="text-lg font-bold text-primary mt-1 capitalize">{selectedTurf.sport_type}</p>
                </div>
              </div>

              {selectedTurf.description && (
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Description</label>
                  <p className="text-gray-300 mt-2 leading-relaxed">{selectedTurf.description}</p>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Location</label>
                  <p className="text-white mt-1">{selectedTurf.location}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">City</label>
                  <p className="text-white mt-1">{selectedTurf.city}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">State</label>
                  <p className="text-white mt-1">{selectedTurf.state}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Contact Number</label>
                  <p className="text-white mt-1 font-mono">{selectedTurf.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Price Per Hour</label>
                  <p className="text-2xl font-black text-primary mt-1">₹{selectedTurf.price_per_hour}</p>
                </div>
              </div>

              {selectedTurf.amenities && selectedTurf.amenities.length > 0 && (
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Amenities</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTurf.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/5 border border-primary/10 rounded-xl p-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Owner Information</label>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {getInitials(selectedTurf.owner?.full_name || 'U')}
                  </div>
                  <div>
                    <p className="text-white font-bold">{selectedTurf.owner?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-400">{selectedTurf.owner?.email || 'No email'}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Rejected On</label>
                <p className="text-white mt-1">{formatDate(selectedTurf.created_at)}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-900 border-t border-primary/10 px-6 py-4 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => openDeleteModal(selectedTurf)}
              >
                Delete Permanently
              </Button>
              <Button
                variant="primary"
                onClick={() => handleReApprove(selectedTurf.id)}
              >
                Re-Approve Venue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTurfToDelete(null);
        }}
        onConfirm={() => turfToDelete && handleDelete(turfToDelete.id)}
        venueName={turfToDelete?.name}
        isDeleting={isDeleting}
      />
    </>
  );
}

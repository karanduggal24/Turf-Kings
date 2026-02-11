'use client';

import { useEffect, useState } from 'react';

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
  rating: number;
  total_reviews: number;
  created_at: string;
  owner: {
    full_name: string;
    email: string;
  };
}

interface RejectedTurfsGridProps {
  searchQuery: string;
}

export default function RejectedTurfsGrid({ searchQuery }: RejectedTurfsGridProps) {
  const [turfs, setTurfs] = useState<RejectedTurf[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurf, setSelectedTurf] = useState<RejectedTurf | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRejectedTurfs();
  }, [searchQuery]);

  async function fetchRejectedTurfs() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/rejected-turfs');
      
      if (response.ok) {
        const data = await response.json();
        setTurfs(data.turfs || []);
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
        setTurfs(turfs.filter(t => t.id !== turfId));
        setShowModal(false);
        setSelectedTurf(null);
      }
    } catch (error) {
      console.error('Error re-approving turf:', error);
    }
  }

  async function handleDelete(turfId: string) {
    if (!confirm('Are you sure you want to permanently delete this venue?')) {
      return;
    }
    
    setTurfs(turfs.filter(t => t.id !== turfId));
    setShowModal(false);
    setSelectedTurf(null);
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-primary/5 rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-700"></div>
            <div className="p-5 space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (turfs.length === 0) {
    return (
      <div className="bg-white/5 border border-primary/10 rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
          cancel
        </span>
        <p className="text-gray-400 text-lg">No rejected venues</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {turfs.map((turf) => (
          <div
            key={turf.id}
            className="group bg-white/5 border border-primary/5 rounded-xl overflow-hidden hover:border-red-500/40 transition-all duration-300 cursor-pointer"
            onClick={() => openModal(turf)}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={turf.images[0] || '/placeholder-turf.jpg'}
                alt={turf.name}
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  REJECTED
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg">{turf.name}</h3>
                <p className="text-gray-300 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {turf.location}, {turf.city}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-primary/10">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Owner
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {getInitials(turf.owner?.full_name || 'U')}
                    </div>
                    <span className="text-sm font-medium text-white truncate">
                      {turf.owner?.full_name || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Price/Hour
                  </p>
                  <span className="text-lg font-bold text-primary">₹{turf.price_per_hour}</span>
                </div>
              </div>

              {/* Sport Type & Date in single row */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                    Sport Type
                  </p>
                  <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 capitalize">
                    {turf.sport_type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                    Rejected On
                  </p>
                  <span className="text-xs text-gray-300">{formatDate(turf.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(turf.id);
                  }}
                  className="flex-1 bg-gray-500/10 hover:bg-gray-500 text-gray-400 hover:text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReApprove(turf.id);
                  }}
                  className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-black font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
                >
                  Re-Approve
                </button>
              </div>
            </div>
          </div>
        ))}
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

            {/* Modal Content */}
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
              <button
                onClick={() => handleDelete(selectedTurf.id)}
                className="px-6 py-3 bg-gray-500/10 hover:bg-gray-500 text-gray-400 hover:text-white font-bold rounded-lg transition-all"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => handleReApprove(selectedTurf.id)}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg transition-all"
              >
                Re-Approve Venue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

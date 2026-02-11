'use client';

import { useState, useEffect } from 'react';

interface PendingTurf {
  id: string;
  name: string;
  location: string;
  city: string;
  images: string[];
  sport_type: string;
  created_at: string;
  owner: {
    full_name: string;
    email: string;
  };
}

export default function RecentBookings() {
  const [pendingTurfs, setPendingTurfs] = useState<PendingTurf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingTurfs();
  }, []);

  const fetchPendingTurfs = async () => {
    try {
      const response = await fetch('/api/admin/pending-turfs');
      const data = await response.json();
      if (data.turfs) {
        setPendingTurfs(data.turfs);
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    // TODO: Implement approve logic
    alert(`Approve turf ${id}`);
  };

  const handleReject = async (id: string) => {
    // TODO: Implement reject logic
    alert(`Reject turf ${id}`);
  };

  const getSportIcon = (sport: string) => {
    const icons: Record<string, string> = {
      cricket: 'sports_cricket',
      football: 'sports_soccer',
      badminton: 'sports_tennis',
      multi: 'sports_kabaddi',
    };
    return icons[sport] || 'sports';
  };

  const getSportColor = (sport: string) => {
    const colors: Record<string, string> = {
      cricket: 'orange',
      football: 'blue',
      badminton: 'purple',
      multi: 'green',
    };
    return colors[sport] || 'gray';
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diff = now.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-primary/10 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-primary/10 flex justify-between items-center">
        <div>
          <h4 className="text-xl font-bold text-white">Recent Booking Requests</h4>
          <p className="text-sm text-gray-400">
            Action required for {pendingTurfs.length} pending venue listings
          </p>
        </div>
        <button className="text-primary text-sm font-bold hover:underline">
          View All Requests
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary/5 text-gray-400 text-xs uppercase tracking-widest">
              <th className="px-6 py-4 font-semibold">Venue Details</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Sport Type</th>
              <th className="px-6 py-4 font-semibold">Submitted</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : pendingTurfs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No pending requests
                </td>
              </tr>
            ) : (
              pendingTurfs.slice(0, 5).map((turf) => (
                <tr key={turf.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={turf.images[0] || '/placeholder-turf.jpg'}
                        alt={turf.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-white">{turf.name}</p>
                        <p className="text-xs text-gray-400">{turf.location}, {turf.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-white">
                        {turf.owner.full_name?.substring(0, 2).toUpperCase() || 'NA'}
                      </div>
                      <span className="text-sm font-medium text-white">
                        {turf.owner.full_name || turf.owner.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${getSportColor(turf.sport_type)}-500/10 text-${getSportColor(turf.sport_type)}-400 text-[10px] font-bold uppercase`}>
                      <span className="material-symbols-outlined text-sm">
                        {getSportIcon(turf.sport_type)}
                      </span>
                      {turf.sport_type}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-400 font-medium">
                    {getTimeAgo(turf.created_at)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(turf.id)}
                        className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">check</span>
                      </button>
                      <button
                        onClick={() => handleReject(turf.id)}
                        className="w-10 h-10 rounded-xl bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-all flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

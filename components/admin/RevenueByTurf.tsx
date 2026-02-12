'use client';

import { useEffect, useState } from 'react';

interface TurfRevenue {
  name: string;
  amount: string;
  percentage: string;
}

export default function RevenueByTurf() {
  const [turfs, setTurfs] = useState<TurfRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueByTurf();
  }, []);

  async function fetchRevenueByTurf() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/revenue-by-turf');
      if (response.ok) {
        const data = await response.json();
        setTurfs(data.turfs || []);
      }
    } catch (error) {
      console.error('Error fetching revenue by turf:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-primary/10 p-6 rounded-xl">
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-1.5 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-primary/10 p-6 rounded-xl">
      <h3 className="font-bold text-sm text-white mb-4">Revenue by Turf</h3>
      
      {turfs.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No revenue data available</p>
      ) : (
        <div className="space-y-4">
          {turfs.map((turf, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white truncate pr-2">{turf.name}</span>
                <span className="text-primary">₹{turf.amount}</span>
              </div>
              <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${turf.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

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
    return <LoadingSpinner size="md" text="Loading revenue data..." />;
  }

  return (
    <div className="bg-white/5 border border-primary/10 p-6 rounded-xl">
      <h3 className="font-bold text-sm text-white mb-4">Revenue by Turf</h3>
      
      {turfs.length === 0 ? (
        <EmptyState
          icon="bar_chart"
          title="No revenue data available"
          description="Revenue breakdown will appear once bookings are made"
        />
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

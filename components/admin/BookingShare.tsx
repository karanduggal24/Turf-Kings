'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface BookingShareData {
  sport: string;
  count: number;
  percentage: number;
}

interface BookingShareResponse {
  bookingShare: BookingShareData[];
  totalBookings: number;
}

const SPORT_COLORS: Record<string, string> = {
  cricket: '#9EFF00',
  football: '#3B82F6',
  badminton: '#A855F7',
  multi: '#F97316',
};

const SPORT_LABELS: Record<string, string> = {
  cricket: 'Cricket',
  football: 'Football',
  badminton: 'Badminton',
  multi: 'Multi-Sport',
};

export default function BookingShare() {
  const [data, setData] = useState<BookingShareResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookingShare() {
      try {
        const response = await fetch('/api/admin/booking-share');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBookingShare();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="md" text="Loading..." />
      </div>
    );
  }

  const totalBookings = data?.totalBookings || 0;
  const bookingShare = data?.bookingShare || [];

  // Filter and format data for Recharts
  const chartData = bookingShare
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: SPORT_LABELS[item.sport] || item.sport,
      value: item.count,
      percentage: item.percentage,
      color: SPORT_COLORS[item.sport] || '#6B7280',
    }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-8 rounded-2xl flex flex-col items-center justify-center">
      <h4 className="text-xl font-bold w-full text-left mb-2 text-white">Booking Share</h4>
      <p className="text-sm text-gray-400 w-full text-left mb-8">Distribution by sport category</p>

      {totalBookings === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
            sports_soccer
          </span>
          <p className="text-gray-400 text-sm">No bookings yet</p>
        </div>
      ) : (
        <>
          {/* Doughnut Chart */}
          <div className="relative w-full h-64 flex items-center justify-center [&_.recharts-pie-sector]:!cursor-default [&_.recharts-sector]:!outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">
                {totalBookings >= 1000 ? `${(totalBookings / 1000).toFixed(1)}k` : totalBookings}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full mt-8 grid grid-cols-2 gap-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-xs text-gray-400">
                  {item.name} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

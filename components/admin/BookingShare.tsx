'use client';

import { useEffect, useState } from 'react';

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
      } catch (error) {
        console.error('Error fetching booking share:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookingShare();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
        <span className="animate-spin text-4xl">⚡</span>
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    );
  }

  const totalBookings = data?.totalBookings || 0;
  const bookingShare = data?.bookingShare || [];

  // Calculate stroke dashoffset for each segment
  const circumference = 2 * Math.PI * 80; // 2πr where r=80
  let currentOffset = 0;

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
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
              {/* Background circle */}
              <circle
                className="text-primary/10"
                cx={96}
                cy={96}
                fill="transparent"
                r={80}
                stroke="currentColor"
                strokeWidth={20}
              />
              
              {/* Dynamic segments */}
              {bookingShare.map((item, index) => {
                if (item.count === 0) return null;
                
                const segmentLength = (item.percentage / 100) * circumference;
                const offset = currentOffset;
                currentOffset += segmentLength;
                
                const strokeColor = SPORT_COLORS[item.sport] || '#6B7280';
                
                return (
                  <circle
                    key={item.sport}
                    cx={96}
                    cy={96}
                    fill="transparent"
                    r={80}
                    stroke={strokeColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - offset}
                    strokeWidth={20}
                    style={{
                      strokeDasharray: `${segmentLength} ${circumference}`,
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {totalBookings >= 1000 ? `${(totalBookings / 1000).toFixed(1)}k` : totalBookings}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full mt-8 grid grid-cols-2 gap-4">
            {bookingShare
              .filter((item) => item.count > 0)
              .map((item) => (
                <div key={item.sport} className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: SPORT_COLORS[item.sport] || '#6B7280' }}
                  ></span>
                  <span className="text-xs text-gray-400">
                    {SPORT_LABELS[item.sport] || item.sport} ({item.percentage}%)
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

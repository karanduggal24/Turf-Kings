'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Stats {
  todayEarnings: string;
  todayGrowth: string;
  weekEarnings: string;
  weekGrowth: string;
  pendingPayouts: string;
  totalProfit: string;
  totalRevenue: string;
  baseCost: string;
  serviceFee: string;
  bookingFee: string;
}

export default function RevenueStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/revenue-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading revenue stats..." />;
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Main Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Earnings */}
        <div className="bg-white/5 border border-primary/10 p-6 rounded-xl relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">
              Today's Earnings
            </p>
            <h3 className="text-3xl font-black text-white">
              ₹{stats.todayEarnings}
              <span className="text-sm font-medium text-primary ml-2">
                {Number(stats.todayGrowth) >= 0 ? '+' : ''}
                {stats.todayGrowth}%
              </span>
            </h3>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl">payments</span>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white/5 border border-primary/10 p-6 rounded-xl relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">
              This Week
            </p>
            <h3 className="text-3xl font-black text-white">
              ₹{stats.weekEarnings}
              <span className="text-sm font-medium text-primary ml-2">
                {Number(stats.weekGrowth) >= 0 ? '+' : ''}
                {stats.weekGrowth}%
              </span>
            </h3>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl">trending_up</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white/5 border border-primary/10 p-6 rounded-xl relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-white">₹{stats.totalRevenue}</h3>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl">account_balance_wallet</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white/5 border border-primary/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">pie_chart</span>
          Revenue Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Base Cost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Base Cost</span>
              <span className="text-xs text-gray-500">
                {((Number(stats.baseCost) / Number(stats.totalRevenue)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(Number(stats.baseCost) / Number(stats.totalRevenue)) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-2xl font-bold text-white">₹{stats.baseCost}</p>
          </div>

          {/* Service Fee */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Service Fee (5%)</span>
              <span className="text-xs text-gray-500">
                {((Number(stats.serviceFee) / Number(stats.totalRevenue)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${(Number(stats.serviceFee) / Number(stats.totalRevenue)) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-2xl font-bold text-white">₹{stats.serviceFee}</p>
          </div>

          {/* Booking Fee */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Booking Fee</span>
              <span className="text-xs text-gray-500">
                {((Number(stats.bookingFee) / Number(stats.totalRevenue)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{
                  width: `${(Number(stats.bookingFee) / Number(stats.totalRevenue)) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-2xl font-bold text-white">₹{stats.bookingFee}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

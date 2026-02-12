'use client';

import { useState } from 'react';
import RevenueStats from './RevenueStats';
import RevenueChart from './RevenueChart';
import RecentTransactions from './RecentTransactions';
import RevenueByTurf from './RevenueByTurf';

export default function AdminRevenueClient() {
  const [period, setPeriod] = useState<'30' | '90' | '365'>('30');

  return (
    <>
      {/* Header */}
      <header className="p-6 lg:p-10 pb-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary/80">Revenue</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">Revenue Overview</h1>
            <p className="text-gray-400 mt-1">Track your performance and manage payouts.</p>
          </div>
          
          {/* Period Filter */}
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 p-1.5 rounded-lg">
            <button
              onClick={() => setPeriod('30')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                period === '30'
                  ? 'bg-primary text-black shadow-lg'
                  : 'hover:bg-primary/10 text-gray-400'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setPeriod('90')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                period === '90'
                  ? 'bg-primary text-black shadow-lg'
                  : 'hover:bg-primary/10 text-gray-400'
              }`}
            >
              This Quarter
            </button>
            <button
              onClick={() => setPeriod('365')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                period === '365'
                  ? 'bg-primary text-black shadow-lg'
                  : 'hover:bg-primary/10 text-gray-400'
              }`}
            >
              Year to Date
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 lg:p-10 pt-6 space-y-8">
        {/* KPI Stats */}
        <RevenueStats />

        {/* Revenue Chart */}
        <RevenueChart period={period} />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>

          {/* Revenue by Turf */}
          <div>
            <RevenueByTurf />
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { ownerApi } from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

interface RevenueData {
  stats: {
    todayEarnings: string;
    todayGrowth: string;
    weekEarnings: string;
    weekGrowth: string;
    totalRevenue: string;
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
  };
  chart: { date: string; amount: number }[];
  byVenue: { name: string; revenue: number; bookings: number }[];
  bookingsByStatus: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#10b981',
  pending: '#f59e0b',
  completed: '#3b82f6',
  cancelled: '#ef4444',
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

const formatCurrency = (v: number) => `₹${v.toFixed(0)}`;

export default function OwnerRevenueClient() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerApi.getRevenue()
      .then((d: any) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 lg:p-10 space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-80 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, chart, byVenue, bookingsByStatus } = data;

  const statCards = [
    { label: "Today's Earnings", value: `₹${stats.todayEarnings}`, growth: `${Number(stats.todayGrowth) >= 0 ? '+' : ''}${stats.todayGrowth}%`, icon: 'today', positive: Number(stats.todayGrowth) >= 0 },
    { label: 'This Week', value: `₹${stats.weekEarnings}`, growth: `${Number(stats.weekGrowth) >= 0 ? '+' : ''}${stats.weekGrowth}%`, icon: 'date_range', positive: Number(stats.weekGrowth) >= 0 },
    { label: 'Total Revenue', value: `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`, growth: `${stats.totalBookings} bookings`, icon: 'payments', positive: true },
    { label: 'Confirmed', value: stats.confirmedBookings.toString(), growth: `${stats.cancelledBookings} cancelled`, icon: 'event_available', positive: true },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Revenue</h1>
        <p className="text-gray-400 mt-1">Earnings and booking analytics for your venues</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white/5 border border-primary/10 rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary text-xl">{card.icon}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.positive ? 'text-primary bg-primary/10' : 'text-red-400 bg-red-400/10'}`}>
                {card.growth}
              </span>
            </div>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/5 border border-primary/10 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">Revenue — Last 30 Days</h2>
          <p className="text-xs text-gray-400">Daily revenue from paid bookings</p>
        </div>
        {chart.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl block mb-2 text-gray-600">bar_chart</span>
              No revenue data yet
            </div>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ownerBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#6B7280"
                  style={{ fontSize: '10px' }}
                  angle={-45}
                  textAnchor="end"
                  height={55}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  stroke="#6B7280"
                  style={{ fontSize: '10px' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #10b98130', borderRadius: '8px', color: '#fff' }}
                  labelFormatter={(l) => formatDate(String(l))}
                  formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'Revenue']}
                  cursor={{ fill: 'rgba(16,185,129,0.08)' }}
                />
                <Bar dataKey="amount" fill="url(#ownerBarGradient)" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bottom row: Revenue by Venue + Bookings by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue by Venue */}
        <div className="bg-white/5 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">Revenue by Venue</h2>
          {byVenue.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-4">
              {byVenue.map((v, i) => {
                const maxRevenue = byVenue[0].revenue;
                const pct = maxRevenue > 0 ? (v.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-white font-medium truncate pr-4">{v.name}</span>
                      <span className="text-primary font-bold shrink-0">₹{v.revenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{v.bookings} booking{v.bookings !== 1 ? 's' : ''}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookings by Status */}
        <div className="bg-white/5 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">Bookings by Status</h2>
          {bookingsByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
          ) : (
            <div className="flex flex-col items-center">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingsByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      isAnimationActive={false}
                    >
                      {bookingsByStatus.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.status] || '#6B7280'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111' }}
                      labelStyle={{ color: '#111', fontWeight: 600 }}
                      itemStyle={{ color: '#111' }}
                      formatter={(v, name) => [v, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {bookingsByStatus.map((entry, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] || '#6B7280' }} />
                    <span className="capitalize">{entry.status}</span>
                    <span className="text-white font-bold">({entry.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

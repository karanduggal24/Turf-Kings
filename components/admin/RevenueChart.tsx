'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  date: string;
  amount: number;
}

interface RevenueChartProps {
  period: '30' | '90' | '365';
}

export default function RevenueChart({ period }: RevenueChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [period]);

  async function fetchChartData() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/revenue-chart?period=${period}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data || []);
      }
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-primary/10 rounded-xl p-6">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/3 mb-8"></div>
        <div className="h-[300px] bg-gray-800/30 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-primary/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-white">Revenue Performance</h2>
          <p className="text-xs text-gray-400">Daily breakdown of bookings and sales</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-xs font-medium text-gray-400">Daily Revenue</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No revenue data available for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#33f20d" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#33f20d" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6B7280"
                style={{ fontSize: '10px', fontWeight: 'bold' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="#6B7280"
                style={{ fontSize: '10px', fontWeight: 'bold' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #33f20d20',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelFormatter={(label) => formatDate(String(label))}
                formatter={(value) => [`₹${Number(value || 0).toFixed(2)}`, 'Revenue']}
                cursor={{ fill: 'rgba(51, 242, 13, 0.1)' }}
              />
              <Bar 
                dataKey="amount" 
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

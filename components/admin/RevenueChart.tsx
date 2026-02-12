'use client';

import { useEffect, useState } from 'react';

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
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-primary/10 rounded-xl p-6">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/3 mb-8"></div>
        <div className="h-[300px] bg-gray-800/30 rounded animate-pulse"></div>
      </div>
    );
  }

  // Calculate max value for scaling
  const maxAmount = data.length > 0 ? Math.max(...data.map((d) => d.amount)) : 0;
  const chartHeight = 300;
  const chartWidth = 1000;

  // Generate SVG path
  const generatePath = () => {
    if (data.length === 0) return '';

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - (item.amount / maxAmount) * (chartHeight - 50);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    if (data.length === 0) return '';

    const path = generatePath();
    return `${path} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;
  };

  // Format date labels
  const getDateLabels = () => {
    if (data.length === 0) return [];
    
    const step = Math.ceil(data.length / 5);
    return data.filter((_, index) => index % step === 0 || index === data.length - 1);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

      <div className="h-[300px] w-full relative">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No revenue data available for this period
          </div>
        ) : (
          <>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#33f20d" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#33f20d" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path d={generateAreaPath()} fill="url(#chartGradient)" />

              {/* Line */}
              <path
                d={generatePath()}
                fill="none"
                stroke="#33f20d"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * chartWidth;
                const y = chartHeight - (item.amount / maxAmount) * (chartHeight - 50);
                return (
                  <circle key={index} cx={x} cy={y} r="4" fill="#33f20d">
                    <title>₹{item.amount.toFixed(2)}</title>
                  </circle>
                );
              })}
            </svg>

            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-500 w-full"></div>
              ))}
            </div>

            {/* Date labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-bold uppercase tracking-tighter text-gray-500">
              {getDateLabels().map((item, index) => (
                <span key={index}>{formatDate(item.date)}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

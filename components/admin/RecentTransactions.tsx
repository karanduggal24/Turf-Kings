'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

interface Transaction {
  id: string;
  turfName: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: string;
  status: string;
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/recent-transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <LoadingSpinner size="md" text="Loading transactions..." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
        <button className="text-xs font-bold text-primary hover:underline">View All</button>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title="No transactions yet"
          description="Transactions will appear here once bookings are made"
        />
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white/5 border border-primary/5 rounded-lg hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">event_available</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{transaction.turfName}</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    {formatDate(transaction.date)} • {formatTime(transaction.startTime)} -{' '}
                    {formatTime(transaction.endTime)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-primary">+₹{transaction.amount}</p>
                <p className="text-[10px] text-gray-400 font-bold tracking-wider italic capitalize">
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

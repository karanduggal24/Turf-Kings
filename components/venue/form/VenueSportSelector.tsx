'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface SportOption {
  value: string;
  label: string;
  icon: string;
}

interface VenueSportSelectorProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

export default function VenueSportSelector({ selectedSport, onSportChange }: VenueSportSelectorProps) {
  const [sports, setSports] = useState<SportOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportsTypes = async () => {
      try {
        const response = await fetch('/api/sports-types');
        const data = await response.json();
        
        if (data.allSports) {
          setSports(data.allSports);
        }
      } catch (error) {
        console.error('Error fetching sports types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsTypes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-bold text-gray-200">
          Sport Type <span className="text-primary">*</span>
        </label>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  if (sports.length === 0) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-bold text-gray-200">
          Sport Type <span className="text-primary">*</span>
        </label>
        <div className="text-center py-8 text-gray-400">
          No sports available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-200">
        Sport Type <span className="text-primary">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sports.map((sport) => (
          <button
            key={sport.value}
            type="button"
            onClick={() => onSportChange(sport.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              selectedSport === sport.value
                ? 'border-primary bg-primary/10'
                : 'border-surface-dark hover:border-primary/50'
            }`}
          >
            <span
              className={`material-symbols-outlined mb-2 text-2xl ${
                selectedSport === sport.value ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {sport.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-white">
              {sport.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

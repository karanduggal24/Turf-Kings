'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TurfData {
  id: string;
  name: string;
  sportType: string;
  pricePerHour: string;
}

interface TurfsListProps {
  turfs: TurfData[];
  onAddTurf: () => void;
  onRemoveTurf: (id: string) => void;
  onUpdateTurf: (id: string, field: keyof TurfData, value: string) => void;
  errors: Record<string, string>;
}

interface SportOption {
  value: string;
  label: string;
  icon: string;
}

const defaultSportsOptions: SportOption[] = [
  { value: 'football', label: 'Football', icon: 'sports_soccer' },
  { value: 'cricket', label: 'Cricket', icon: 'sports_cricket' },
  { value: 'badminton', label: 'Badminton', icon: 'sports_tennis' },
  { value: 'multi', label: 'Multi-Sport', icon: 'sports_kabaddi' },
];

export default function TurfsList({ 
  turfs, 
  onAddTurf, 
  onRemoveTurf, 
  onUpdateTurf, 
  errors 
}: TurfsListProps) {
  const [sportsOptions, setSportsOptions] = useState<SportOption[]>(defaultSportsOptions);

  useEffect(() => {
    const fetchSportsTypes = async () => {
      try {
        const response = await fetch('/api/sports-types');
        const data = await response.json();
        
        if (data.allSports && data.allSports.length > 0) {
          setSportsOptions(data.allSports);
        }
      } catch (error) {
        console.error('Error fetching sports types:', error);
      }
    };

    fetchSportsTypes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Add Turfs to Your Venue</h3>
          <p className="text-sm text-gray-400 mt-1">
            Add multiple turfs with different sports and pricing
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddTurf}
          icon="add"
          variant="secondary"
          size="sm"
        >
          Add Turf
        </Button>
      </div>

      {errors.turfs && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
          {errors.turfs}
        </div>
      )}

      <div className="space-y-4">
        {turfs.map((turf, index) => (
          <div 
            key={turf.id} 
            className="bg-surface-dark border border-surface-highlight rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">sports</span>
                Turf #{index + 1}
              </h4>
              {turfs.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveTurf(turf.id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>

            {/* Turf Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-200">
                Turf Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={turf.name}
                onChange={(e) => onUpdateTurf(turf.id, 'name', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
                  errors[`turf_${index}_name`] ? 'border-red-500' : 'border-primary/20'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
                placeholder="e.g., Turf 1, Court A, Field B"
              />
              {errors[`turf_${index}_name`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`turf_${index}_name`]}</p>
              )}
            </div>

            {/* Sport Type */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-200">
                Sport Type <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sportsOptions.map((sport) => (
                  <button
                    key={sport.value}
                    type="button"
                    onClick={() => onUpdateTurf(turf.id, 'sportType', sport.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      turf.sportType === sport.value
                        ? 'border-primary bg-primary/10'
                        : 'border-surface-dark hover:border-primary/50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${
                      turf.sportType === sport.value ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {sport.icon}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-white mt-1">
                      {sport.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Per Hour */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-200">
                Price Per Hour (₹) <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                value={turf.pricePerHour}
                onChange={(e) => onUpdateTurf(turf.id, 'pricePerHour', e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                min="1"
                max="100000"
                step="1"
                className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
                  errors[`turf_${index}_price`] ? 'border-red-500' : 'border-primary/20'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
                placeholder="e.g., 1500"
              />
              {errors[`turf_${index}_price`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`turf_${index}_price`]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {turfs.length < 10 && (
        <button
          type="button"
          onClick={onAddTurf}
          className="w-full py-4 border-2 border-dashed border-surface-highlight rounded-lg hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-primary"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-medium">Add Another Turf</span>
        </button>
      )}

      {turfs.length >= 10 && (
        <p className="text-center text-sm text-gray-400">
          Maximum 10 turfs per venue
        </p>
      )}
    </div>
  );
}

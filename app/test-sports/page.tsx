'use client';

import { useTurfs } from '@/hooks/useTurfs';
import { useState } from 'react';

export default function TestSports() {
  const [selectedSport, setSelectedSport] = useState('');
  const { turfs, loading, error } = useTurfs({
    sport: selectedSport || undefined,
    limit: 10
  });

  const sports = [
    { value: '', label: 'All Sports', icon: 'sports' },
    { value: 'cricket', label: 'Cricket', icon: 'sports_cricket' },
    { value: 'football', label: 'Football', icon: 'sports_soccer' },
    { value: 'badminton', label: 'Badminton', icon: 'sports_tennis' },
    { value: 'multi', label: 'Multi-Sport', icon: 'sports' }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">Sports Filter Test</h1>

        {/* Sport Filter Buttons */}
        <div className="flex gap-4 flex-wrap mb-8">
          {sports.map((sport) => (
            <button
              key={sport.value}
              onClick={() => setSelectedSport(sport.value)}
              className={`group flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                selectedSport === sport.value
                  ? 'bg-primary text-black border-primary'
                  : 'bg-surface-dark/80 hover:bg-primary hover:text-black border-surface-highlight hover:border-primary text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${
                selectedSport === sport.value 
                  ? 'text-black' 
                  : 'text-primary group-hover:text-black'
              }`}>
                {sport.icon}
              </span>
              <span className="font-medium text-sm">{sport.label}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="bg-surface-dark p-6 rounded-lg border border-surface-highlight">
          <h2 className="text-xl font-semibold mb-4">
            {selectedSport ? `${sports.find(s => s.value === selectedSport)?.label} Turfs` : 'All Turfs'}
          </h2>
          
          {loading ? (
            <p>Loading turfs...</p>
          ) : error ? (
            <p className="text-red-400">❌ Error: {error}</p>
          ) : (
            <div>
              <p className="mb-4 text-gray-300">Found {turfs.length} turfs</p>
              
              <div className="space-y-4">
                {turfs.map((turf) => (
                  <div key={turf.id} className="bg-surface-highlight p-4 rounded border-l-4 border-primary">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{turf.name}</h3>
                        <p className="text-gray-400 text-sm">{turf.location}, {turf.city}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="bg-primary text-black px-2 py-1 rounded text-sm font-medium">
                            {turf.sport_type}
                          </span>
                          <span className="text-yellow-400">⭐ {turf.rating}</span>
                          <span className="text-primary font-semibold">₹{turf.price_per_hour}/hour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-surface-highlight rounded border-l-4 border-primary">
          <h4 className="font-semibold mb-2">✅ Basketball → Badminton Update Complete!</h4>
          <p className="text-sm text-gray-300">
            The system now supports badminton instead of basketball. All types, hooks, and components have been updated.
          </p>
        </div>
      </div>
    </div>
  );
}
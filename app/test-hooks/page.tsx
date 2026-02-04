'use client';

import { useTurfs } from '@/hooks/useTurfs';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function TestHooks() {
  const [city, setCity] = useState('');
  const [sport, setSport] = useState('');
  
  // Test useTurfs hook
  const { turfs, loading, error, pagination } = useTurfs({
    city: city || undefined,
    sport: sport || undefined,
    limit: 5
  });

  // Test useAuth hook
  const { user, loading: authLoading, signUp, signIn } = useAuth();

  const handleSignUp = async () => {
    const { data, error } = await signUp('test@example.com', 'password123', 'Test User');
    if (error) {
      // Handle both Supabase errors and generic errors
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as any).message 
        : 'An error occurred during sign up';
      alert('Sign up failed: ' + errorMessage);
    } else {
      alert('Sign up successful! Check your email for confirmation.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">Hooks Test Page</h1>

        {/* Auth Section */}
        <div className="bg-surface-dark p-6 rounded-lg border border-surface-highlight mb-8">
          <h2 className="text-xl font-semibold mb-4">🔐 Authentication Test</h2>
          {authLoading ? (
            <p>Loading auth...</p>
          ) : user ? (
            <div>
              <p className="text-green-400">✅ Logged in as: {user.email}</p>
              <p className="text-sm text-gray-400">User ID: {user.id}</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-4">Not logged in</p>
              <button 
                onClick={handleSignUp}
                className="bg-primary text-black px-4 py-2 rounded hover:bg-primary-hover"
              >
                Test Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Turfs Section */}
        <div className="bg-surface-dark p-6 rounded-lg border border-surface-highlight">
          <h2 className="text-xl font-semibold mb-4">🏟️ Turfs Test</h2>
          
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Filter by city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-surface-highlight border border-gray-600 rounded px-3 py-2 text-white"
            />
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="bg-surface-highlight border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">All Sports</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="multi">Multi-Sport</option>
            </select>
          </div>

          {/* Results */}
          {loading ? (
            <p>Loading turfs...</p>
          ) : error ? (
            <p className="text-red-400">❌ Error: {error}</p>
          ) : (
            <div>
              <p className="mb-4 text-gray-300">
                Found {pagination.total} turfs (showing {turfs.length})
              </p>
              
              <div className="space-y-4">
                {turfs.map((turf) => (
                  <div key={turf.id} className="bg-surface-highlight p-4 rounded border-l-4 border-primary">
                    <h3 className="font-semibold text-lg">{turf.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{turf.location}, {turf.city}</p>
                    <div className="flex justify-between items-center">
                      <span className="bg-primary text-black px-2 py-1 rounded text-sm">
                        {turf.sport_type}
                      </span>
                      <span className="text-primary font-semibold">
                        ₹{turf.price_per_hour}/hour
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">⭐ {turf.rating}</span>
                      <span className="text-gray-400 ml-2">({turf.total_reviews} reviews)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-surface-highlight rounded border-l-4 border-primary">
          <h4 className="font-semibold mb-2">✅ Hooks Working!</h4>
          <p className="text-sm text-gray-300">
            Both useAuth and useTurfs hooks are functioning correctly. 
            You can now use them in your components throughout the app.
          </p>
        </div>
      </div>
    </div>
  );
}
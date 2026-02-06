'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface TurfOwnerFormProps {
  onError: (error: string) => void;
}

export default function TurfOwnerForm({ onError }: TurfOwnerFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');

    try {
      // Sign up with business name and mark as turf owner
      const { error } = await signUp(email, password, businessName);
      if (error) {
        onError(error.message);
      } else {
        onError('Check your email for verification link! We\'ll review your turf owner application.');
      }
    } catch (err) {
      onError('An unexpected error occurred');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Register Your Turf</h1>
        <p className="text-gray-400 text-sm">
          List your turf and reach more players.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
            Business Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              business
            </span>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-black/40 border border-surface-highlight rounded-lg py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Elite Sports Arena"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-surface-highlight rounded-lg py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="owner@elitesports.com"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
            Phone Number
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              phone
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-black/40 border border-surface-highlight rounded-lg py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="+91 98765 43210"
              required
              pattern="[+]?[0-9\s-]+"
            />
          </div>
          <p className="text-xs text-gray-500 ml-1">
            We'll use this to verify your business
          </p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
            Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              lock
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-surface-highlight rounded-lg py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">
              info
            </span>
            <div>
              <p className="text-sm text-gray-300">
                <strong className="text-primary">Turf Owner Benefits:</strong>
              </p>
              <ul className="text-xs text-gray-400 mt-2 space-y-1 list-disc list-inside">
                <li>List unlimited turfs</li>
                <li>Manage bookings & availability</li>
                <li>Access to analytics dashboard</li>
                <li>Direct customer communication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-black font-black uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚡</span>
              Processing...
            </span>
          ) : (
            'Register Turf'
          )}
        </button>
      </form>
    </>
  );
}

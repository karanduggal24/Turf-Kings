'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword, loading } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage('Password reset link sent! Check your email.');
        setTimeout(() => {
          onClose();
          setEmail('');
          setMessage('');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface-dark rounded-2xl shadow-2xl border border-surface-highlight overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 border-b border-primary/20 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Forgot Password?</h2>
            <p className="text-gray-400 text-sm mt-1">
              We'll send you a reset link
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {message && (
            <div className="bg-primary/10 border border-primary/50 rounded-lg p-4 mb-4">
              <p className="text-primary text-sm">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-black font-black uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

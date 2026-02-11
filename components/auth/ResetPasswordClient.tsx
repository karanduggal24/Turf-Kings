'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordClient() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if this is a valid password reset link
  useEffect(() => {
    const checkResetToken = async () => {
      // Get all URL parameters for debugging
      const type = searchParams.get('type');
      const tokenHash = searchParams.get('token_hash');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Check if there's an error from Supabase
      if (error) {
        setError(errorDescription || 'Invalid or expired reset link. Please request a new password reset.');
        setIsValidToken(false);
        setIsChecking(false);
        
        setTimeout(() => {
          router.push('/login');
        }, 3000);
        return;
      }

      // Get current user and session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      // Supabase automatically logs in the user when they click the reset link
      // So if we have a user session, it means the token was valid
      if (user && session) {
        setIsValidToken(true);
        setIsChecking(false);
        setMessage('Please enter your new password below.');
        return;
      }

      // No valid session found
      console.error('No valid session found for password reset');
      setError('Invalid or expired reset link. Please request a new password reset.');
      setIsValidToken(false);
      setIsChecking(false);
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    };

    checkResetToken();
  }, [searchParams, router]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        setError(updateError.message);
      } else {
        setMessage('Password updated successfully! Redirecting to login...');
        
        // Sign out the user so they can log in with new password
        await supabase.auth.signOut();
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Unexpected error during password update:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking token
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="animate-spin text-6xl">⚡</span>
            <p className="text-white text-lg">Verifying reset link...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error if invalid token
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-surface-dark rounded-2xl shadow-2xl border border-red-500/50 overflow-hidden">
            <div className="bg-red-500/10 border-b border-red-500/20 p-6">
              <h1 className="text-2xl font-bold text-center text-red-400">Invalid Reset Link</h1>
            </div>
            <div className="p-8">
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
              <p className="text-gray-400 text-sm text-center">
                Redirecting to login page...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>

        <div className="w-full max-w-md bg-surface-dark rounded-2xl shadow-2xl border border-surface-highlight overflow-hidden z-10">
          <div className="bg-primary/10 border-b border-primary/20 p-6">
            <h1 className="text-2xl font-bold text-center">Reset Password</h1>
            <p className="text-gray-400 text-sm text-center mt-2">
              Enter your new password
            </p>
          </div>

          <div className="p-8">
            {/* Success Message */}
            {message && (
              <div className="bg-primary/10 border border-primary/50 rounded-lg p-4 mb-6">
                <p className="text-primary text-sm">{message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/40 border border-surface-highlight rounded-lg py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-black font-black uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

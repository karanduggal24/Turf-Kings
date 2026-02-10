'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ErrorMessage from '@/components/auth/ErrorMessage';
import { useAuthStore } from '@/stores/authStore';

type AuthMode = 'login' | 'signup';

export default function LoginPageClient() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for URL params (error or message)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else if (messageParam) {
      setError(decodeURIComponent(messageParam));
    }
  }, [searchParams]);

  // Check auth immediately and redirect if logged in
  useEffect(() => {
    // If we have a user, redirect immediately
    if (user) {
      router.replace('/');
      return;
    }
    
    // If not loading and no user, show the form
    if (!loading) {
      setIsChecking(false);
    }
  }, [user, loading, router]);

  // Always show loading until we confirm user is not logged in
  if (isChecking || loading || user) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="animate-spin text-6xl">⚡</span>
            <p className="text-white text-lg">Loading...</p>
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
        {/* Background mesh pattern */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>

        {/* Auth Card */}
        <div className="w-full max-w-[480px] bg-surface-dark rounded-2xl shadow-2xl border border-surface-highlight overflow-hidden z-10">
          {/* Tab Navigation */}
          <div className="flex border-b border-surface-highlight">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-5 text-xs font-extrabold tracking-[0.2em] uppercase transition-all border-b-2 ${
                mode === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-5 text-xs font-extrabold tracking-[0.2em] uppercase transition-all border-b-2 ${
                mode === 'signup'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Signup
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error/Success Message */}
            <ErrorMessage message={error} />

            {/* Render appropriate form based on mode */}
            {mode === 'login' && <LoginForm onError={setError} />}
            {mode === 'signup' && <SignupForm onError={setError} />}
          </div>

          {/* Footer Terms */}
          <div className="bg-primary/5 p-4 text-center border-t border-surface-highlight">
            <p className="text-[11px] text-gray-500 font-medium">
              By entering, you agree to our{' '}
              <a href="#" className="text-white hover:underline">
                Terms of Play
              </a>{' '}
              and{' '}
              <a href="#" className="text-white hover:underline">
                Privacy Rules
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

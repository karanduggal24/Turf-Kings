'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import TurfOwnerForm from '@/components/auth/TurfOwnerForm';
// import SocialLogin from '@/components/auth/SocialLogin';
import ErrorMessage from '@/components/auth/ErrorMessage';

type AuthMode = 'login' | 'signup' | 'owner';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState('');

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
            <button
              onClick={() => {
                setMode('owner');
                setError('');
              }}
              className={`flex-1 py-5 text-xs font-extrabold tracking-[0.2em] uppercase transition-all border-b-2 ${
                mode === 'owner'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Turf Owner
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error/Success Message */}
            <ErrorMessage message={error} />

            {/* Render appropriate form based on mode */}
            {mode === 'login' && <LoginForm onError={setError} />}
            {mode === 'signup' && <SignupForm onError={setError} />}
            {mode === 'owner' && <TurfOwnerForm onError={setError} />}

            {/* Social Login */}
            {/* <SocialLogin /> */}
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


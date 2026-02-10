import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  console.log('Confirm route - params:', { token_hash: token_hash?.substring(0, 10) + '...', type });

  if (token_hash && type) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Cookie set error:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error('Cookie remove error:', error);
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error('Verification error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    if (data?.user) {
      console.log('Email verified successfully for:', data.user.email);
      // Redirect to home page with success message
      return NextResponse.redirect(new URL('/?verified=true', request.url));
    }
  }

  // Missing or invalid parameters
  console.log('Missing token_hash or type');
  return NextResponse.redirect(
    new URL('/login?error=Invalid verification link', request.url)
  );
}

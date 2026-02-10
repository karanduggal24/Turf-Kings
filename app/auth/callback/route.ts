import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  console.log('Auth callback params:', { token_hash, type, code });

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
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );

  // Handle PKCE flow (new method with code)
  if (code) {
    console.log('Processing PKCE flow with code');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('PKCE Error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }
    
    if (data?.session) {
      console.log('PKCE Success - User logged in:', data.user?.email);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Handle token hash flow (email verification)
  if (token_hash && type) {
    console.log('Processing token hash flow');
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (error) {
      console.error('Token Hash Error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    if (data?.session) {
      console.log('Email verified successfully - User logged in:', data.user?.email);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Email verified but no session - redirect to login
    console.log('Email verified but no session created');
    return NextResponse.redirect(
      new URL('/login?message=Email confirmed! Please log in.', request.url)
    );
  }

  // No valid params
  console.log('No valid auth params found');
  return NextResponse.redirect(
    new URL('/login?error=Invalid verification link', request.url)
  );
}

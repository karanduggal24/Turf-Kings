import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    // Validate input
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Phone and password are required' },
        { status: 400 }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    let email = identifier;

    // Check if identifier is a phone number (contains only digits, +, -, spaces)
    const isPhone = /^[\d\s\-+()]+$/.test(identifier.trim());

    if (isPhone) {
      
      // Look up email by phone number
      const { data: userData, error: lookupError } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('phone', identifier.trim())
        .single();

      if (lookupError || !userData) {
        console.error('Phone lookup error:', lookupError);
        return NextResponse.json(
          { error: 'Invalid phone number or password' },
          { status: 401 }
        );
      }

      email = userData.email;
    }

    // Sign in with email and password
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (sessionError) {
      console.error('Sign in error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: sessionData.user,
      session: sessionData.session
    });

  } catch (error: any) {
    console.error('Unexpected login error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

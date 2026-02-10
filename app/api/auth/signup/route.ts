import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone, location } = await request.json();

    console.log('Signup attempt for:', email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if service role key exists
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
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

    console.log('Creating user with admin client...');

    // Create auth user with email auto-confirmed
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || '',
        phone: phone || '',
        location: location || ''
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    console.log('User created successfully:', authData.user.id);

    // Try to create profile (don't fail if this doesn't work)
    try {
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName || '',
          phone: phone || '',
          location: location || '',
        });

      if (profileError) {
        console.error('Profile creation error (non-fatal):', profileError);
      } else {
        console.log('Profile created successfully');
      }
    } catch (profileErr) {
      console.error('Profile creation exception (non-fatal):', profileErr);
    }

    // Sign in to get session
    console.log('Signing in user...');
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { 
          user: authData.user,
          message: 'User created successfully. Please log in.'
        },
        { status: 201 }
      );
    }

    console.log('Signup complete!');

    return NextResponse.json({
      user: sessionData.user,
      session: sessionData.session
    });

  } catch (error: any) {
    console.error('Unexpected signup error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

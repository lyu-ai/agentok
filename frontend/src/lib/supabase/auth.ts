// @/lib/supabase/auth.ts
import { createClient } from './client';
import { AuthError, User } from '@supabase/supabase-js';

export async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  try {
    console.log('Auth: Starting sign in process...');
    const supabase = await createClient();
    
    console.log('Auth: Attempting to sign in with Supabase...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn('Auth: Sign in failed:', {
        error,
        errorMessage: error.message,
        errorStatus: error.status,
      });
      return { data, error };
    }

    console.log('Auth: Sign in successful:', { 
      user: data.user?.id,
      session: {
        accessToken: data.session?.access_token ? 'Present' : 'Missing',
        expiresAt: data.session?.expires_at,
      }
    });

    // Check if session was properly set
    const checkSession = await getSession();
    console.log('Auth: Session check after login:', {
      sessionExists: !!checkSession,
      sessionUser: checkSession?.user?.id
    });

    return { data, error };
  } catch (e) {
    console.error('Auth: Unexpected error during sign in:', {
      error: e,
      stack: (e as Error).stack
    });
    return { data: null, error: e as AuthError };
  }
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAuthenticated() {
  const session = await getSession();
  return session !== null;
}

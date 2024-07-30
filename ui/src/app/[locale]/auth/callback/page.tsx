'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/utils/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import Loading from '@/components/Loading';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN') {
          router.push('/'); // or wherever you want to redirect after sign in
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return <Loading />;
}

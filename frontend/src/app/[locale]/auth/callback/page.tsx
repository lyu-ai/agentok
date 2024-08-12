'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/utils/supabase/client';
import Loading from '@/components/Loading';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) console.error('Error:', error);

      // Get the intended redirect URL from the query parameters
      const redirectTo = searchParams.get('redirect') || '/';

      // Redirect to the intended page
      router.push(decodeURIComponent(redirectTo));
    };

    handleAuthCallback();
  }, [router, supabase.auth]);

  return <Loading />;
}

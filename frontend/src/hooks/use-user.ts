// useUser.ts
import { useEffect } from 'react';
import useUserStore from '@/store/user';

export function useUser() {
  const { user, loading, error, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user && !loading && !error) {
      fetchUser();
    }
  }, [user, loading, error, fetchUser]);

  return { user, userId: user?.id || null, loading, error };
}

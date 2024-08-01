// userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import supabase from '@/utils/supabase/client';

interface UserState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      fetchUser: async () => {
        try {
          set({ loading: true });
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          set({ user, error: null });
        } catch (error) {
          set({ error: error instanceof Error ? error : new Error('An unknown error occurred') });
        } finally {
          set({ loading: false });
        }
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'agentok-user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Set up the auth listener
supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
  useUserStore.getState().setUser(session?.user || null);
});

export default useUserStore;
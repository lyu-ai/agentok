import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import supabase from '@/utils/supabase/client';

interface UserState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

// Custom storage to handle SSR
const clientStorage = {
  getItem: (name: string) =>
    typeof window !== 'undefined' ? localStorage.getItem(name) : null,
  setItem: (name: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      fetchUser: async () => {
        try {
          set({ loading: true });
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error) throw error;
          set({ user, error: null });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error
                : new Error('An unknown error occurred'),
          });
        } finally {
          set({ loading: false });
        }
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'agentok-user-storage',
      storage: createJSONStorage(() => clientStorage),
    }
  )
);

// Set up the auth listener
supabase.auth.onAuthStateChange(
  (event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth event:', event);
    useUserStore.getState().setUser(session?.user || null);
  }
);

export default useUserStore;

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserState {
  user: any;
  streak: number;
  coins: number;
  loading: boolean;
  setUser: (user: any) => void;
  incrementStreak: () => void;
  addCoins: (amount: number) => void;
  loadUserData: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeUserStats: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  streak: 0,
  coins: 0,
  loading: true,
  setUser: (user) => set({ user }),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  loadUserData: async () => {
    set({ loading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Initialize user stats if they don't exist
      await get().initializeUserStats(user.id);
      
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      set({
        user,
        streak: data?.streak || 0,
        coins: data?.coins || 0,
        loading: false
      });
    } else {
      set({ user: null, streak: 0, coins: 0, loading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, streak: 0, coins: 0 });
  },
  initializeUserStats: async (userId: string) => {
    // Check if user stats already exist
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    // If no stats exist, create them
    if (!existingStats) {
      await supabase
        .from('user_stats')
        .insert([{
          user_id: userId,
          streak: 0,
          coins: 0
        }]);
    }
  }
}));
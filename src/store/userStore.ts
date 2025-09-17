import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserState {
  user: any;
  streak: number;
  coins: number;
  setUser: (user: any) => void;
  incrementStreak: () => void;
  addCoins: (amount: number) => void;
  loadUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  streak: 0,
  coins: 0,
  setUser: (user) => set({ user }),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  loadUserData: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      set({
        user,
        streak: data?.streak || 0,
        coins: data?.coins || 0
      });
    }
  }
}));
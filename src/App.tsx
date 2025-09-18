import React, { useEffect, useState } from 'react';
import { DailyWords } from './components/DailyWords';
import { Dictionary } from './components/Dictionary';
import { Navigation } from './components/Navigation';
import { AuthForm } from './components/AuthForm';
import { useUserStore } from './store/userStore';
import { supabase } from './lib/supabase';
import { GraduationCap, LogOut } from 'lucide-react';

function App() {
  const { loadUserData, user, streak, coins, loading, signOut } = useUserStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'dictionary'>('daily');

  useEffect(() => {
    loadUserData();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        loadUserData();
      } else if (event === 'SIGNED_OUT') {
        // User store will be updated by signOut function
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm onAuthSuccess={() => {
        // The auth state change listener will handle reloading user data
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">Vocabulary Master</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email?.split('@')[0]}!
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        streak={streak}
        coins={coins}
      />
      
      <main className="py-8">
        {activeTab === 'daily' ? <DailyWords /> : <Dictionary />}
      </main>
    </div>
  );
}

export default App;
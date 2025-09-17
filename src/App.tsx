import React, { useEffect, useState } from 'react';
import { DailyWords } from './components/DailyWords';
import { Dictionary } from './components/Dictionary';
import { Navigation } from './components/Navigation';
import { useUserStore } from './store/userStore';
import { GraduationCap } from 'lucide-react';

function App() {
  const { loadUserData, user, streak, coins } = useUserStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'dictionary'>('daily');

  useEffect(() => {
    loadUserData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Daily Vocabulary Challenge</h1>
          <p className="text-gray-600 mb-8">Build your vocabulary with daily words and challenges</p>
          {/* Add authentication UI here */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-4">
              Sign in to track your progress, earn coins, and maintain your learning streak!
            </p>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Sign In to Start Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">Vocabulary Master</h1>
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
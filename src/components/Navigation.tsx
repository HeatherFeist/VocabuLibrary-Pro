import React from 'react';
import { Book, Calendar, Trophy, Coins } from 'lucide-react';

interface NavigationProps {
  activeTab: 'daily' | 'dictionary';
  onTabChange: (tab: 'daily' | 'dictionary') => void;
  streak: number;
  coins: number;
}

export function Navigation({ activeTab, onTabChange, streak, coins }: NavigationProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onTabChange('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Daily Words
            </button>
            
            <button
              onClick={() => onTabChange('dictionary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'dictionary'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Book className="w-5 h-5" />
              Dictionary
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">{streak} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">{coins} coins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
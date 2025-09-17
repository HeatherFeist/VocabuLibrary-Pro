import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lightbulb, Quote, Brain, Target, RefreshCw } from 'lucide-react';

interface Tip {
  id: string;
  tip_text: string;
  tip_type: 'learning' | 'motivation' | 'fun_fact' | 'challenge_specific';
  category: string;
}

export function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyTip();
  }, []);

  const loadDailyTip = async () => {
    setLoading(true);
    
    // Get a pseudo-random tip based on the current date
    // This ensures the same tip shows for all users on the same day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    const { data: tips } = await supabase
      .from('daily_tips')
      .select('*')
      .eq('is_active', true);
    
    if (tips && tips.length > 0) {
      // Use day of year to select a consistent tip for today
      const tipIndex = dayOfYear % tips.length;
      setTip(tips[tipIndex]);
    }
    
    setLoading(false);
  };

  const getIcon = (tipType: string) => {
    switch (tipType) {
      case 'learning':
        return <Brain className="w-6 h-6 text-blue-500" />;
      case 'motivation':
        return <Quote className="w-6 h-6 text-purple-500" />;
      case 'fun_fact':
        return <Lightbulb className="w-6 h-6 text-yellow-500" />;
      case 'challenge_specific':
        return <Target className="w-6 h-6 text-green-500" />;
      default:
        return <Lightbulb className="w-6 h-6 text-blue-500" />;
    }
  };

  const getTypeLabel = (tipType: string) => {
    switch (tipType) {
      case 'learning':
        return 'Learning Tip';
      case 'motivation':
        return 'Daily Motivation';
      case 'fun_fact':
        return 'Fun Fact';
      case 'challenge_specific':
        return 'Challenge Tip';
      default:
        return 'Daily Tip';
    }
  };

  const getBackgroundColor = (tipType: string) => {
    switch (tipType) {
      case 'learning':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200';
      case 'motivation':
        return 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200';
      case 'fun_fact':
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 'challenge_specific':
        return 'bg-gradient-to-r from-green-50 to-green-100 border-green-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-6 w-6"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tip) {
    return null;
  }

  return (
    <div className={`rounded-lg shadow-lg p-6 mb-8 border-2 ${getBackgroundColor(tip.tip_type)}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {getIcon(tip.tip_type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">
              {getTypeLabel(tip.tip_type)}
            </h3>
            <button
              onClick={loadDailyTip}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Get another tip"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed text-base">
            {tip.tip_text}
          </p>
          {tip.category && (
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-white bg-opacity-60 rounded-full text-xs font-medium text-gray-600">
                {tip.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';
import { DailyTip } from './DailyTip';
import { Book, CheckCircle, Circle, Star } from 'lucide-react';
import { format } from 'date-fns';

interface Word {
  id: number;
  word: string;
  definition: string;
  challenges: string[];
  dictionary_id?: string;
}

export function DailyWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, addCoins, incrementStreak } = useUserStore();

  useEffect(() => {
    loadDailyWords();
    loadCompletedChallenges();
  }, []);

  const loadDailyWords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('daily_words')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2);
    
    if (data) {
      setWords(data);
    }
    setLoading(false);
  };

  const loadCompletedChallenges = async () => {
    if (!user) return;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('completed_challenges')
      .select('challenge_id')
      .eq('user_id', user.id)
      .gte('completed_at', today);
    
    if (data) {
      setCompletedChallenges(data.map(item => item.challenge_id));
    }
  };

  const completeChallenge = async (challengeId: string) => {
    if (!user || completedChallenges.includes(challengeId)) return;
    
    try {
      setCompletedChallenges([...completedChallenges, challengeId]);
      addCoins(10);
      
      const { error } = await supabase
        .from('completed_challenges')
        .insert([{ 
          user_id: user.id,
          challenge_id: challengeId 
        }]);

      if (error) {
        console.error('Error completing challenge:', error);
        // Revert optimistic update on error
        setCompletedChallenges(prev => prev.filter(id => id !== challengeId));
      } else {
        // Check if this is the user's first challenge today for streak
        const todaysChallenges = completedChallenges.filter(id => 
          id.startsWith(new Date().toISOString().split('T')[0])
        );
        if (todaysChallenges.length === 0) {
          incrementStreak();
        }
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <DailyTip />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">Today's Vocabulary Challenge</h1>
        </div>
        <p className="text-gray-600">
          Complete the challenges below to earn coins and maintain your learning streak!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {words.map((word) => (
          <div key={word.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">{word.word}</h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">{word.definition}</p>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Daily Challenges
              </h3>
              {word.challenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  {completedChallenges.includes(`${word.id}-${index}`) ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-700 mb-3">{challenge}</p>
                    <button
                      onClick={() => completeChallenge(`${word.id}-${index}`)}
                      disabled={completedChallenges.includes(`${word.id}-${index}`)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        completedChallenges.includes(`${word.id}-${index}`)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                      }`}
                    >
                      {completedChallenges.includes(`${word.id}-${index}`) ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed! +10 coins
                        </span>
                      ) : (
                        'Mark Complete'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {words.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No words available today</h3>
          <p className="text-gray-400">Check back tomorrow for new vocabulary challenges!</p>
        </div>
      )}

      {/* Progress Summary */}
      {words.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {words.length}
              </div>
              <div className="text-sm text-gray-600">Words to Learn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedChallenges.length}
              </div>
              <div className="text-sm text-gray-600">Challenges Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {completedChallenges.length * 10}
              </div>
              <div className="text-sm text-gray-600">Coins Earned Today</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
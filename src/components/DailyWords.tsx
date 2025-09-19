import React, { useEffect, useState } from 'react';

const THEMES: { label: string; words: string[] }[] = [
  { label: 'Travel', words: ['journey', 'destination', 'passport', 'adventure', 'explore', 'itinerary', 'voyage', 'excursion', 'tourist', 'landmark'] },
  { label: 'Emotions', words: ['joy', 'melancholy', 'anger', 'serenity', 'ecstasy', 'fear', 'hope', 'despair', 'gratitude', 'envy'] },
  { label: 'Business', words: ['entrepreneur', 'strategy', 'negotiation', 'profit', 'investment', 'leadership', 'innovation', 'marketing', 'revenue', 'merger'] },
  { label: 'Science', words: ['atom', 'gravity', 'photosynthesis', 'evolution', 'ecosystem', 'molecule', 'energy', 'theory', 'experiment', 'hypothesis'] },
];

function pronounceWord(word: string) {
  if ('speechSynthesis' in window) {
    const utterance = new window.SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
}
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
  const [selectedTheme, setSelectedTheme] = useState<string>(THEMES[0].label);
  const [apiWord, setApiWord] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, addCoins, incrementStreak } = useUserStore();

  useEffect(() => {
    loadDailyWords();
    loadCompletedChallenges();
  }, []);

  useEffect(() => {
    fetchThemeWord(selectedTheme);
    // eslint-disable-next-line
  }, [selectedTheme]);
  async function fetchThemeWord(theme: string) {
    setApiLoading(true);
    setApiError('');
    setApiWord(null);
    const themeObj = THEMES.find(t => t.label === theme);
    if (!themeObj) return;
    const randomWord = themeObj.words[Math.floor(Math.random() * themeObj.words.length)];
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(randomWord)}`);
      if (!res.ok) throw new Error('Word not found');
      const data = await res.json();
      const entry = data[0];
      setApiWord({
        word: entry.word,
        definition: entry.meanings?.[0]?.definitions?.[0]?.definition || 'No definition found.',
        part_of_speech: entry.meanings?.[0]?.partOfSpeech || '',
        pronunciation: entry.phonetics?.[0]?.text || '',
        example_sentence: entry.meanings?.[0]?.definitions?.[0]?.example || '',
      });
    } catch (err: any) {
      setApiError('No definition found for this word.');
    } finally {
      setApiLoading(false);
    }
  }

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

  if (loading || apiLoading) {
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
        <div className="mb-4">
          <label htmlFor="theme-select" className="font-medium text-gray-700 mr-2">Choose a theme:</label>
          <select
            id="theme-select"
            value={selectedTheme}
            onChange={e => setSelectedTheme(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {THEMES.map(theme => (
              <option key={theme.label} value={theme.label}>{theme.label}</option>
            ))}
          </select>
        </div>
        <p className="text-gray-600">
          Complete the challenges below to earn coins and maintain your learning streak!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {apiWord && (
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">{apiWord.word}</h2>
              <button
                onClick={() => pronounceWord(apiWord.word)}
                className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                title={`Listen to pronunciation of ${apiWord.word}`}
              >
                Listen
              </button>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">{apiWord.definition}</p>
            {apiWord.example_sentence && (
              <div className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r mb-4">
                <p className="text-sm text-gray-700 italic">"{apiWord.example_sentence}"</p>
              </div>
            )}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Daily Challenge
              </h3>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-700 mb-3">Use the word "{apiWord.word}" in a sentence related to the theme "{selectedTheme}".</p>
                  <button
                    className="px-4 py-2 rounded-full font-medium bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {apiError && (
          <div className="text-red-500">{apiError}</div>
        )}
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
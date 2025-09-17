import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Book, Volume2, Star } from 'lucide-react';

interface DictionaryEntry {
  id: string;
  word: string;
  definition: string;
  part_of_speech: string;
  pronunciation: string;
  example_sentence: string;
  difficulty_level: number;
}

export function Dictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<DictionaryEntry[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDictionary();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [searchTerm, selectedDifficulty, entries]);

  const loadDictionary = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dictionary')
      .select('*')
      .order('word');
    
    if (data && !error) {
      setEntries(data);
    }
    setLoading(false);
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(entry => entry.difficulty_level === selectedDifficulty);
    }

    setFilteredEntries(filtered);
  };

  const getDifficultyColor = (level: number) => {
    const colors = {
      1: 'text-green-600 bg-green-100',
      2: 'text-blue-600 bg-blue-100',
      3: 'text-yellow-600 bg-yellow-100',
      4: 'text-orange-600 bg-orange-100',
      5: 'text-red-600 bg-red-100'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getDifficultyLabel = (level: number) => {
    const labels = {
      1: 'Beginner',
      2: 'Elementary',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    };
    return labels[level as keyof typeof labels] || 'Unknown';
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Book className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">Dictionary</h1>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search words or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedDifficulty || ''}
            onChange={(e) => setSelectedDifficulty(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            <option value="1">Beginner</option>
            <option value="2">Elementary</option>
            <option value="3">Intermediate</option>
            <option value="4">Advanced</option>
            <option value="5">Expert</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredEntries.length} of {entries.length} words
        </div>
      </div>

      {/* Dictionary Entries */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{entry.word}</h3>
                {entry.part_of_speech && (
                  <span className="text-sm text-gray-500 italic">{entry.part_of_speech}</span>
                )}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(entry.difficulty_level)}`}>
                {getDifficultyLabel(entry.difficulty_level)}
              </div>
            </div>

            {entry.pronunciation && (
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 font-mono">{entry.pronunciation}</span>
              </div>
            )}

            <p className="text-gray-700 mb-4 leading-relaxed">{entry.definition}</p>

            {entry.example_sentence && (
              <div className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r">
                <p className="text-sm text-gray-700 italic">"{entry.example_sentence}"</p>
              </div>
            )}

            <div className="flex items-center mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < entry.difficulty_level
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs text-gray-500">
                Difficulty: {entry.difficulty_level}/5
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No words found</h3>
          <p className="text-gray-400">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
}
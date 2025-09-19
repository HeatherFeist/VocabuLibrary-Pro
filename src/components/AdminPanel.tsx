import React, { useState } from 'react';
import { populateDatabase } from '../scripts/populateDatabase';
import { Database, Plus, CheckCircle, AlertCircle, Home } from 'lucide-react';

export function AdminPanel({ setActiveTab }: { setActiveTab: (tab: 'daily' | 'dictionary' | 'admin') => void }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handlePopulateDatabase = async () => {
      setLoading(true);
      setStatus('idle');
      setMessage('');

      try {
        const result = await populateDatabase();
      
        if (result.success) {
          setStatus('success');
          setMessage('Database populated successfully with sample vocabulary words, dictionary entries, and daily tips!');
        } else {
          setStatus('error');
          setMessage('Failed to populate database. Check console for details.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while populating the database.');
        console.error('Population error:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Database Setup</h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Click the button below to populate your database with sample vocabulary words, 
              dictionary entries, and daily tips to get started with the app.
            </p>
          
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">This will add:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 15 daily vocabulary words with real-world challenges</li>
                <li>• 20 comprehensive dictionary entries with pronunciations</li>
                <li>• 10 additional daily tips and motivational quotes</li>
              </ul>
            </div>
            <button
              onClick={handlePopulateDatabase}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors flex items-center gap-2"
            >
              {loading ? <Plus className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Populate Database
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 mt-6 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 mt-6 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    );
}
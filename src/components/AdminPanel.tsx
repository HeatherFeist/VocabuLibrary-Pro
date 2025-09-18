import React, { useState } from 'react';
import { populateDatabase } from '../scripts/populateDatabase';
import { Database, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export function AdminPanel() {
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
        </div>

        <button
          onClick={handlePopulateDatabase}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Populating Database...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Populate Database with Sample Data
            </>
          )}
        </button>

        {status !== 'idle' && (
          <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            status === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${
              status === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {message}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Next steps:</strong> You can now use the app! Try signing up for an account 
              and exploring the daily words and dictionary features. The data will cycle through 
              different words and tips each day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
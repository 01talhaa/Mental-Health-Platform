'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AnonymousLoginForm = () => {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnonymousLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const storedSessions = JSON.parse(localStorage.getItem('anonymousSessions') || '{}');
      
      if (!sessionCode) {
        throw new Error('Please enter your session code');
      }

      if (!storedSessions[sessionCode]) {
        throw new Error('Invalid session code');
      }

      localStorage.setItem('currentAnonymousSession', sessionCode);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Anonymous Login</h2>
      
      <form onSubmit={handleAnonymousLogin} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Enter Session Code"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            required
          />
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Continue Anonymously'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Need a session code? {' '}
          <Link href="/anonymous-signup" className="text-indigo-600 hover:text-indigo-800">
            Create one here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AnonymousLoginForm;
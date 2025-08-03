'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const AnonymousLoginForm = () => {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState('');
  const [lastSession, setLastSession] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get the last used session code
    const sessions = JSON.parse(localStorage.getItem('anonymousSessions') || '{}');
    const sortedSessions = Object.entries(sessions).sort((a, b) => 
      new Date(b[1].lastAccessed) - new Date(a[1].lastAccessed)
    );
    
    if (sortedSessions.length > 0) {
      setLastSession(sortedSessions[0][0]);
    }
  }, []);

  const handleAnonymousLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!sessionCode) {
        throw new Error('Please enter your session code');
      }
      // Call the correct API endpoint for anonymous login
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('API base URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your .env file.');
      }
      const response = await fetch(`${baseUrl}/api/users/anonymous`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anonymous_id: sessionCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid session code');
      }
      // Store all response fields in localStorage for header use
      localStorage.setItem('user', JSON.stringify({
        user_id: data.user_id,
        anonymous_id: data.anonymous_id,
        user_type: data.user_type,
        token: data.token
      }));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const useLastSession = () => {
    setSessionCode(lastSession);
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
        
        {lastSession && sessionCode !== lastSession && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Last used session:</p>
            <div className="flex items-center justify-between mt-2">
              <code className="font-mono text-sm">{lastSession}</code>
              <button
                type="button"
                onClick={useLastSession}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Use this session
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Continue Anonymously'}
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Need a new session? {' '}
            <Link href="/anonymous" className="text-indigo-600 hover:text-indigo-800">
              Create one here
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Note: Anonymous sessions expire after 24 hours of inactivity.
          </p>
        </div>
      </form>
    </div>
  );
};

export default AnonymousLoginForm;
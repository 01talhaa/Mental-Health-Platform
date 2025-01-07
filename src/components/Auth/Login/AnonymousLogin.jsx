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
      const sessions = JSON.parse(localStorage.getItem('anonymousSessions') || '{}');
      const sessionData = sessions[sessionCode];
      
      if (!sessionCode) {
        throw new Error('Please enter your session code');
      }

      if (!sessionData) {
        throw new Error('Invalid session code');
      }

      // Check session expiration (24 hours)
      const lastAccessed = new Date(sessionData.lastAccessed);
      const now = new Date();
      const hoursSinceLastAccess = (now - lastAccessed) / (1000 * 60 * 60);
      
      if (hoursSinceLastAccess > 24) {
        throw new Error('Session has expired. Please create a new session.');
      }

      // Update last accessed time
      sessions[sessionCode].lastAccessed = now.toISOString();
      localStorage.setItem('anonymousSessions', JSON.stringify(sessions));

      // Sign in with the anonymous session
      const result = await signIn('credentials', {
        redirect: false,
        anonymousCode: sessionCode,
        userType: 'anonymous'
      });

      if (result?.error) {
        throw new Error('Invalid session code');
      }

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
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
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
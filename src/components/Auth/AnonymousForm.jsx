'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check } from 'lucide-react';
import { signIn } from 'next-auth/react';

const generateSessionCode = () => {
  return `${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}`;
};

const AnonymousForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [showSessionCode, setShowSessionCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnonymousAccess = async () => {
    setIsLoading(true);
    setError('');

    try {
      const newSessionCode = generateSessionCode();
      
      const response = await fetch('/api/auth/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anonymousCode: newSessionCode,
          userType: 'anonymous'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create anonymous session');
      }

      // Store session in localStorage
      const existingSessions = JSON.parse(localStorage.getItem('anonymousSessions') || '{}');
      existingSessions[newSessionCode] = {
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      localStorage.setItem('anonymousSessions', JSON.stringify(existingSessions));
      
      setSessionCode(newSessionCode);
      setShowSessionCode(true);

      // Sign in with the anonymous session
      const signInResult = await signIn('credentials', {
        redirect: false,
        anonymousCode: newSessionCode,
        userType: 'anonymous'
      });

      if (signInResult?.error) {
        throw new Error('Failed to authenticate session');
      }

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy code');
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Anonymous Access</h2>
      
      <div className="space-y-6">
        {showSessionCode ? (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center relative">
              <p className="text-sm text-gray-600 mb-2">Your Session Code:</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg font-mono font-bold">{sessionCode}</p>
                <button
                  onClick={handleCopyCode}
                  className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-1">Code copied!</p>
              )}
            </div>
            <div className="text-sm text-center space-y-2">
              <p className="text-gray-600">
                Save this code! You'll need it to access your session later.
              </p>
              <p className="text-gray-500">
                Note: Anonymous sessions expire after 24 hours of inactivity.
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600">
              Access without creating an account. A unique session code will be generated for you.
            </p>
            <button
              onClick={handleAnonymousAccess}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Creating Session...' : 'Create Anonymous Session'}
            </button>
          </>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymousForm;
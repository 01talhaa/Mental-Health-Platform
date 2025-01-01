import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const generateSessionCode = () => {
  return `${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}`;
};

const AnonymousForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [showSessionCode, setShowSessionCode] = useState(false);

  const handleAnonymousAccess = async () => {
    setIsLoading(true);
    try {
      const newSessionCode = generateSessionCode();
      setSessionCode(newSessionCode);
      setShowSessionCode(true);
      
      // Store in localStorage
      const storedSessions = JSON.parse(localStorage.getItem('anonymousSessions') || '{}');
      storedSessions[newSessionCode] = {
        createdAt: new Date().toISOString(),
        lastAccess: new Date().toISOString()
      };
      localStorage.setItem('anonymousSessions', JSON.stringify(storedSessions));
      localStorage.setItem('currentAnonymousSession', newSessionCode);
    } catch (err) {
      setError('Failed to create anonymous session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Anonymous Access</h2>
      
      <div className="space-y-6">
        {showSessionCode ? (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Your Session Code:</p>
              <p className="text-lg font-mono font-bold">{sessionCode}</p>
            </div>
            <p className="text-sm text-center text-gray-600">
              Save this code! You'll need it to access your session later.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
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
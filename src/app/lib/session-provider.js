// app/session-provider.js

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSession } from './getSession';
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadSession() {
      const currentSession = await getSession();
      setSession(currentSession);
    }
    loadSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.session;
}
// app/page.js

'use client';

import React from 'react';
import Home from '@/components/Homepage/Home';
import { SessionProvider } from './lib/session-provider';

function Page() {
  return (
      <Home />
  );
}

export default Page;
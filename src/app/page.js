import React from 'react';
import Home from '@/components/Homepage/Home';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Page() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error fetching session:', error);
  }

  return (
    <Home session={session} />
  );
}

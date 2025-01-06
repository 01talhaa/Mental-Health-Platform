// lib/getSession.js

import { unstable_getServerSession } from 'next-auth/next';

export async function getSession() {
  try {
    const session = await unstable_getServerSession(
      { req: {}, res: {} },
      { 
        // Your NextAuth options
        callbacks: {},
        events: {},
        jwt: {},
        pages: {},
        providers: [],
        secret: process.env.NEXTAUTH_SECRET,
        adapter: {}
      }
    );

    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}
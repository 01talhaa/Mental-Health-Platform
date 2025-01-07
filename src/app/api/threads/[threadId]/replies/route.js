// src/app/api/threads/[threadId]/replies/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { threadId } = params;

    if (!threadId) {
      throw new Error('Thread ID is required');
    }

    // Simulate creating a reply
    const reply = {
      content: 'Test reply',
      author: 'Test User',
      timestamp: Date.now()
    };

    // Instead of saving to MongoDB, just return the reply
    return NextResponse.json(reply);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
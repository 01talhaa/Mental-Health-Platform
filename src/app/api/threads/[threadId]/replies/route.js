import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Thread from '@/models/Thread';

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { content, isAnonymous } = await req.json();
    const { threadId } = params;

    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error('Thread not found');

    thread.replies.push({
      content,
      author: req.user.id,
      isAnonymous
    });

    await thread.save();
    return NextResponse.json({ reply: thread.replies[thread.replies.length - 1] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
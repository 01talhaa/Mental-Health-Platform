// app/api/auth/anonymous/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/moduls/User';

export async function POST(req) {
  try {
    await connectDB();
    const { anonymousCode } = await req.json();

    const user = await User.create({
      anonymousCode,
      userType: 'anonymous',
      createdAt: new Date()
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
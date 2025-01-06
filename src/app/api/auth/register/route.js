import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/moduls/User';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, userType, studentId, universityEmail } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData = {
      name,
      email,
      password: hashedPassword,
      userType
    };

    if (userType === 'student') {
      userData.studentId = studentId;
      userData.universityEmail = universityEmail;
    }

    const user = await User.create(userData);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
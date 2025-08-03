'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import LoginForm from './Login/Login';
import StudentLoginForm from './StudentVerification/StudentLoginForm';
import AnonymousLoginForm from './Login/AnonymousLogin';
import { SocialButtons } from '../ui/SocialButtons';
import Header from '../Homepage/Header';

const LoginPage = () => {
  const [loginType, setLoginType] = useState('regular');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Header />
      <div className="mb-8 flex gap-4 mt-20">
        <button
          onClick={() => setLoginType('regular')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            loginType === 'regular'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Regular Login
        </button>
        {/* <button
          onClick={() => setLoginType('student')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            loginType === 'student'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Student Login
        </button> */}
        <button
          onClick={() => setLoginType('anonymous')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            loginType === 'anonymous'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Anonymous Login
        </button>
      </div>

      {loginType === 'regular' && <LoginForm />}
      {/* {loginType === 'student' && <StudentLoginForm />} */}
      {loginType === 'anonymous' && <AnonymousLoginForm />}

      <div className="mt-8 mb-10 w-full max-w-md flex flex-col items-center">
        <p className="text-gray-600 mb-4">Or sign up with</p>
        <SocialButtons />
      </div>
    </div>
  );
};

export default LoginPage;

'use client'
import React, { useState } from 'react';
import LoginForm from './Login/Login';
import StudentLoginForm from './StudentVerification/StudentLoginForm';
import AnonymousForm from './AnonymousForm';

const LoginPage = () => {
  const [loginType, setLoginType] = useState('regular');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setLoginType('regular')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            loginType === 'regular'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Regular Login
        </button>
        <button
          onClick={() => setLoginType('student')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            loginType === 'student'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Student Login
        </button>
        <button
          onClick={() => setLoginType('anonymous')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            loginType === 'anonymous'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Anonymous Login
        </button>
      </div>

      {loginType === 'regular' && <LoginForm />}
      {loginType === 'student' && <StudentLoginForm />}
      {loginType === 'anonymous' && <AnonymousForm />}
    </div>
  );
};

export default LoginPage;
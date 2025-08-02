'use client'

import React, { useState } from 'react';
import SignupPage from './SignUp/Signup';
import StudentSignupForm from './StudentVerification/StudentVerification';
import AnonymousForm from './AnonymousForm';
import { SocialButtons } from '../ui/SocialButtons';

const AuthPage = () => {
  const [authType, setAuthType] = useState('regular');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setAuthType('regular')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            authType === 'regular'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
           Signup
        </button>
        {/* <button
          onClick={() => setAuthType('student')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            authType === 'student'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Student Signup
        </button> */}
        <button
          onClick={() => setAuthType('anonymous')}
          className={`px-6 py-2 rounded-full transition duration-200 ${
            authType === 'anonymous'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Anonymous Access
        </button>
      </div>

      <div className="w-full max-w-md">
        {authType === 'regular' && <SignupPage />}
        {/* {authType === 'student' && <StudentSignupForm />} */}
        {authType === 'anonymous' && <AnonymousForm />}
      </div>

      <div className="mt-8 mb-10 w-full max-w-md flex flex-col items-center">
        <p className="text-gray-600 mb-4">Or sign up with</p>
        <SocialButtons />
      </div>
    </div>
  );
};

export default AuthPage;

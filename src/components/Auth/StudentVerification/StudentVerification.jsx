'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AvatarGenerator from '../AvatarGenerator';

const StudentSignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    universityEmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('');

  // Update avatar seed when university email changes
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, universityEmail: newEmail });
    if (newEmail.length > 0) {
      setAvatarSeed(newEmail + Date.now());
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      if (!formData.universityEmail.endsWith('.edu')) {
        throw new Error('Please use your university email address');
      }

      // router.push('/dashboard');
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Student Verification</h2>
      
      <div className="mb-8">
        <AvatarGenerator 
          name={formData.name || formData.universityEmail}
          size={120}
        />
      </div>
      
      <form onSubmit={handleVerification} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Student ID"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.studentId}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="University Email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.universityEmail}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isVerifying}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
        >
          {isVerifying ? 'Verifying...' : 'Verify Student Status'}
        </button>
      </form>
    </div>
  );
};

export default StudentSignupForm;
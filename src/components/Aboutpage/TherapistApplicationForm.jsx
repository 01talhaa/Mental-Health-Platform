'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Homepage/Header';

const TherapistApplicationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    specialization: '',
    license_number: '',
    bio: '',
    years_of_experience: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Always get user_id directly from localStorage, fallback to _id if needed
      let user = {};
      try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
      } catch {
        user = {};
      }
      const user_id = user.user_id || user._id || '';
      if (!user_id) {
        // Try to get user_id from sessionStorage as a fallback
        const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (sessionUser.user_id || sessionUser._id) {
          user.user_id = sessionUser.user_id || sessionUser._id;
        }
      }
      const finalUserId = user.user_id || user._id || '';
      if (!finalUserId) {
        throw new Error('User ID not found. Please login first.');
      }
      // Build payload for therapist creation
      const payload = {
        user_id,
        specialization: formData.specialization,
        license_number: formData.license_number,
        bio: formData.bio,
        years_of_experience: Number(formData.years_of_experience)
      };
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('API base URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your .env file.');
      }
      // Use full URL for fetch
      const response = await fetch(`${baseUrl}/api/therapists/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('No response from server. Please check your network or API.');
      }
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to submit application');
      }
      setShowSuccessToast(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Success Toast component
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const SuccessToast = ({ message, onClose }) => (
    <div className="fixed top-8 right-8 z-[9999]">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
        <span className="font-semibold">{message}</span>
        <button className="ml-4 text-white hover:text-green-200 text-lg" onClick={onClose}>&times;</button>
      </div>
      <style>{`.animate-slide-in { animation: slide-in 0.4s cubic-bezier(.4,0,.2,1); } @keyframes slide-in { from { opacity:0; transform:translateY(-20px);} to { opacity:1; transform:translateY(0);} }`}</style>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white px-4">
      <Header/>
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full border border-indigo-100 relative mt-20">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center shadow-lg">
          <svg width="40" height="40" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <h2 className="text-4xl font-extrabold text-center mb-8 text-blue-700 drop-shadow">Apply as Therapist</h2>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <input
              type="text"
              placeholder="Specialization (e.g. Cognitive Behavioral Therapy)"
              className="w-full px-5 py-4 rounded-xl border-2 border-indigo-100 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-lg"
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="License Number"
              className="w-full px-5 py-4 rounded-xl border-2 border-indigo-100 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-lg"
              value={formData.license_number}
              onChange={(e) => setFormData({...formData, license_number: e.target.value})}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Bio (e.g. Experienced therapist helping with anxiety and depression.)"
              className="w-full px-5 py-4 rounded-xl border-2 border-indigo-100 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-lg"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              required
              rows={4}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Years of Experience"
              className="w-full px-5 py-4 rounded-xl border-2 border-indigo-100 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-lg"
              value={formData.years_of_experience}
              onChange={(e) => setFormData({...formData, years_of_experience: e.target.value})}
              required
            />
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl text-base font-semibold text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-blue-600 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
        {showSuccessToast && (
          <SuccessToast message="Application submitted successfully!" onClose={() => setShowSuccessToast(false)} />
        )}
      </div>
    </div>
  );
};

export default TherapistApplicationForm;
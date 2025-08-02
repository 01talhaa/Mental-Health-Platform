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
      // Get user_id from localStorage (assumes user is logged in)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const user_id = user.user_id;
      if (!user_id) {
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
      const response = await fetch(`${baseUrl}/api/therapists`, {
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
      router.push('/application-success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mt-20">
      <Header/>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Apply as Therapist</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Specialization (e.g. Cognitive Behavioral Therapy)"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.specialization}
            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="License Number"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.license_number}
            onChange={(e) => setFormData({...formData, license_number: e.target.value})}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Bio (e.g. Experienced therapist helping with anxiety and depression.)"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.years_of_experience}
            onChange={(e) => setFormData({...formData, years_of_experience: e.target.value})}
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
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default TherapistApplicationForm;
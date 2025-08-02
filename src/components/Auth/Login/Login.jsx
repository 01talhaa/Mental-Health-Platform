'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import AvatarGenerator from '../AvatarGenerator';

const LoginForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use custom API for login
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('API base URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your .env file.');
      }
      const response = await fetch(`${baseUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }
      // Store all user details in localStorage for header
      if (data) {
        // If response is like { user_id, full_name, email, user_type, token }
        localStorage.setItem('user', JSON.stringify({
          user_id: data.user_id,
          full_name: data.full_name,
          email: data.email,
          user_type: data.user_type,
          token: data.token
        }));
      }
      // Redirect to homepage
      router.replace('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render form if loading session or already logged in
  if (status === 'loading' || session) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>

      <div className="mb-8">
        <AvatarGenerator 
          name={formData.email} 
          size={120} 
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-800">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
import { useState } from 'react';

export const useThread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createThread = async (threadData) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(threadData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create thread');
      return data.thread;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getThreads = async (category) => {
    setIsLoading(true);
    setError('');
    try {
      const url = category ? `/api/threads?category=${category}` : '/api/threads';
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch threads');
      return data.threads;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addReply = async (threadId, replyData) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/threads/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add reply');
      return data.reply;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const likeThread = async (threadId) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/threads/${threadId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to like thread');
      return data.thread;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createThread,
    getThreads,
    addReply,
    likeThread
  };
};

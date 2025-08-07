'use client'

import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Flag, 
  Clock, 
  Search,
  Users,
  Plus,
  ChevronRight,
  Eye,
  EyeOff,
  MoreVertical,
  Shield,
  Bell,
  Home,
  Filter,
  ThumbsUp,
  AlertTriangle,
  Bookmark,
  RefreshCw
} from 'lucide-react';
import { useThread } from '@/hooks/useThread';
import { useAuth } from '@/hooks/useAuth';
import GroupSupportFooter from './GroupSupportFooter';

// Sample categories with meaningful mental health topics
const categories = [
  {
    id: 'support',
    name: 'Peer Support',
    description: 'Share experiences and support each other',
    icon: Heart,
    color: 'text-rose-600 bg-rose-50',
    threadCount: 1245
  },
  {
    id: 'coping',
    name: 'Coping Strategies',
    description: 'Discussion of helpful coping techniques',
    icon: Shield,
    color: 'text-blue-600 bg-blue-50',
    threadCount: 892
  },
  {
    id: 'progress',
    name: 'Recovery Progress',
    description: 'Share and celebrate recovery milestones',
    icon: RefreshCw,
    color: 'text-green-600 bg-green-50',
    threadCount: 756
  }
];

// Sample forum threads
const threads = [
  {
    id: 1,
    title: "Finding hope during difficult times",
    category: "support",
    author: {
      id: 1,
      name: "Anonymous User",
      isAnonymous: true,
      isModerator: false
    },
    content: "I've been struggling lately and could use some encouragement...",
    likes: 24,
    replies: 12,
    views: 156,
    isLocked: false,
    isPinned: true,
    timestamp: "2024-12-29T14:30:00",
    lastActivity: "2024-12-30T09:15:00"
  },
  {
    id: 2,
    title: "Weekly Gratitude Thread",
    category: "coping",
    author: {
      id: 2,
      name: "CommunityMod",
      isAnonymous: false,
      isModerator: true
    },
    content: "Share one thing you're grateful for this week...",
    likes: 45,
    replies: 32,
    views: 289,
    isLocked: false,
    isPinned: true,
    timestamp: "2024-12-28T10:00:00",
    lastActivity: "2024-12-30T10:30:00"
  }
];

// Sample thread responses
const responses = [
  {
    id: 1,
    threadId: 1,
    author: {
      id: 3,
      name: "SupportPeer",
      isAnonymous: false,
      isModerator: false
    },
    content: "You're not alone in this. I've been there too...",
    likes: 8,
    isHelpful: true,
    timestamp: "2024-12-29T15:00:00"
  }
];


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const CommunityForum = () => {
  const [activeView, setActiveView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({ title: '' });
  const [replyContent, setReplyContent] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [error, setError] = useState(null);
  // Support group state
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [groupForm, setGroupForm] = useState({ group_name: '', description: '', is_private: false });
  const [groups, setGroups] = useState([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState(null);
  const [groupSuccess, setGroupSuccess] = useState(null);

  const { isLoading, error: threadError, createThread, getThreads, addReply, likeThread } = useThread();
  const { isAuthenticated, user } = useAuth();

  // Fetch support groups on mount
  React.useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setGroupLoading(true);
    setGroupError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/support-groups/`);
      if (!res.ok) throw new Error('Failed to fetch groups');
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      setGroupError(err.message);
    } finally {
      setGroupLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setGroupError(null);
    setGroupSuccess(null);

    // Get user_id from localStorage (like TherapistApplicationForm)
    let userId = user?.user_id || user?.id || user?._id;
    if (!userId && typeof window !== 'undefined') {
      let userObj = {};
      try {
        userObj = JSON.parse(localStorage.getItem('user') || '{}');
      } catch {
        userObj = {};
      }
      userId = userObj.user_id || userObj._id || userObj.id || '';
      if (!userId) {
        // Try to get user_id from sessionStorage as a fallback
        try {
          const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');
          userId = sessionUser.user_id || sessionUser._id || sessionUser.id || '';
        } catch {}
      }
    }
    if (typeof window !== 'undefined') {
      console.log('[Groups.jsx] userId for group creation:', userId);
    }
    if (!userId) {
      setGroupError('Please log in to create a group');
      return;
    }
    if (!groupForm.group_name || !groupForm.description) {
      setGroupError('Group name and description are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/support-groups/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: groupForm.group_name,
          user_id: userId,
          description: groupForm.description,
          is_private: groupForm.is_private
        })
      });
      if (!res.ok) throw new Error('Failed to create group');
      const data = await res.json();
      setGroupSuccess('Group created successfully!');
      setShowNewGroupForm(false);
      setGroupForm({ group_name: '', description: '', is_private: false });
      fetchGroups();
    } catch (err) {
      setGroupError(err.message);
    }
  };

  // ...existing code...

  const handleAddReply = async () => {
    if (!isAuthenticated) {
      setError('Please log in to reply');
      return;
    }

    if (!replyContent.trim()) {
      setError('Please enter a response');
      return;
    }

    try {
      const reply = await addReply(selectedThread.id, {
        content: replyContent,
        isAnonymous
      });
      setReplyContent('');
      setSelectedThread(prev => ({
        ...prev,
        replies: [...prev.replies, reply]
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLike = async (threadId) => {
    if (!isAuthenticated) {
      setError('Please log in to like threads');
      return;
    }

    try {
      const updatedThread = await likeThread(threadId);
      if (selectedThread?.id === threadId) {
        setSelectedThread(updatedThread);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShare = async (threadId) => {
    try {
      const shareUrl = `${window.location.origin}/thread/${threadId}`;
      await navigator.clipboard.writeText(shareUrl);
      // Could add a toast notification here
    } catch (err) {
      setError('Failed to copy share link');
    }
  };

  const handleReport = async (threadId) => {
    if (!isAuthenticated) {
      setError('Please log in to report content');
      return;
    }
    // Implement report logic here
  };

  const handleBookmark = async (threadId) => {
    if (!isAuthenticated) {
      setError('Please log in to bookmark threads');
      return;
    }
    // Implement bookmark logic here
  };

  const CategoryCard = ({ category }) => (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
      onClick={() => {
        setSelectedCategory(category);
        setActiveView('threadList');
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${category.color}`}>
          <category.icon className="w-6 h-6" />
        </div>
        <span className="text-sm text-gray-500">
          {category.threadCount} threads
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
      <p className="text-gray-600">{category.description}</p>
    </div>
  );

  const ThreadCard = ({ thread }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 ${
        thread.isPinned ? 'border-l-4 border-blue-500' : ''
      }`}
      onClick={() => {
        setSelectedThread(thread);
        setActiveView('thread');
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {thread.isPinned && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                Pinned
              </span>
            )}
            {thread.isLocked && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                Locked
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{thread.title}</h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(thread.timestamp).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {thread.replies}
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {thread.views}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 line-clamp-2">{thread.content}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          {thread.author.isAnonymous ? (
            <EyeOff className="w-4 h-4 text-gray-400" />
          ) : (
            <div className="flex items-center">
              {thread.author.isModerator && (
                <Shield className="w-4 h-4 text-blue-500 mr-1" />
              )}
            </div>
          )}
          <span className="text-sm text-gray-600">
            {thread.author.name}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              handleShare(thread.id);
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              handleBookmark(thread.id);
            }}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const NewThreadForm = () => (
    <form onSubmit={handleCreateThread} className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Thread</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter thread title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            placeholder="Share your thoughts..."
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Post anonymously</span>
          </label>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setShowNewThreadForm(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Thread
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                onClick={() => setActiveView('categories')}
                className="hover:text-gray-700"
              >
                <Home className="w-5 h-5" />
              </button>
              <ChevronRight className="w-4 h-4" />
              {selectedCategory && (
                <>
                  <span>{selectedCategory.name}</span>
                  {selectedThread && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span className="truncate max-w-xs">
                        {selectedThread.title}
                      </span>
                    </>
                  )}
                </>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {/* Support Groups Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Support Groups</h2>
            <button
              onClick={() => setShowNewGroupForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Group
            </button>
          </div>
          {groupError && (
            <div className="bg-red-50 text-red-600 p-2 rounded mb-2">{groupError}</div>
          )}
          {groupSuccess && (
            <div className="bg-green-50 text-green-700 p-2 rounded mb-2">{groupSuccess}</div>
          )}
          {groupLoading ? (
            <div>Loading groups...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.length === 0 ? (
                <div className="col-span-full text-gray-500">No groups found.</div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.group_id || group.id}
                    className="bg-white rounded-xl shadow p-4 flex flex-col cursor-pointer hover:bg-blue-50 transition"
                    onClick={() => {
                      const id = group.group_id || group.id;
                      window.location.href = `/groups/${id}`;
                    }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{group.group_name}</h3>
                    <p className="text-gray-600 mb-2">{group.description}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>{group.is_private ? 'Private' : 'Public'}</span>
                      {group.created_at && (
                        <span className="ml-2">{new Date(group.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* New Group Form Modal */}
        {showNewGroupForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Support Group</h3>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter group name..."
                    value={groupForm.group_name}
                    onChange={e => setGroupForm(f => ({ ...f, group_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                    placeholder="Describe the group..."
                    value={groupForm.description}
                    onChange={e => setGroupForm(f => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={groupForm.is_private}
                    onChange={e => setGroupForm(f => ({ ...f, is_private: e.target.checked }))}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600">Private group</span>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewGroupForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ...existing code... */}
        {/* Search and Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNewThreadForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Thread
            </button>
          </div>
        </div>

        {/* ...existing code... */}
      </main>

      {/* Safety Notice */}
      <div>
        <GroupSupportFooter/>
      </div>
    </div>
  );
};

export default CommunityForum;
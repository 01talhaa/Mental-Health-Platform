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

const CommunityForum = () => {
  const [activeView, setActiveView] = useState('categories'); // categories, threadList, thread
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Rich text editor state
  const [editorContent, setEditorContent] = useState('');

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
          <button className="text-gray-400 hover:text-gray-600">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const NewThreadForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
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
            onClick={() => setShowNewThreadForm(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Thread
          </button>
        </div>
      </div>
    </div>
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

        {/* Content Views */}
        {activeView === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {activeView === 'threadList' && (
          <div className="space-y-6">
            {/* Category Header */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedCategory.name}
              </h2>
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>

            {/* Thread List */}
            <div className="space-y-4">
              {threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          </div>
        )}

        {activeView === 'thread' && selectedThread && (
          <div className="space-y-6">
            {/* Original Post */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedThread.title}
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {selectedThread.author.isAnonymous ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <>
                      {selectedThread.author.isModerator && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}
                    </>
                  )}
                  <span className="text-gray-600">
                    {selectedThread.author.name}
                  </span>
                </div>
                <span className="text-gray-500">
                  {new Date(selectedThread.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-6">{selectedThread.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{selectedThread.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                    <MessageSquare className="w-5 h-5" />
                    <span>{selectedThread.replies}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                    <Eye className="w-5 h-5" />
                    <span>{selectedThread.views}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Responses */}
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {response.author.isAnonymous ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <>
                          {response.author.isModerator && (
                            <Shield className="w-4 h-4 text-blue-500" />
                          )}
                        </>
                      )}
                      <span className="text-gray-600">{response.author.name}</span>
                      <span className="text-gray-500">
                        {new Date(response.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4">{response.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                        <ThumbsUp className="w-5 h-5" />
                        <span>{response.likes}</span>
                      </button>
                      {response.isHelpful && (
                        <span className="text-green-600 text-sm flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Helpful Response
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {!selectedThread.isLocked && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave a Response</h3>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] mb-4"
                  placeholder="Share your thoughts..."
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Post anonymously</span>
                  </label>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Post Response
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* New Thread Form Modal */}
        {showNewThreadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full">
              <NewThreadForm />
            </div>
          </div>
        )}
      </main>

      {/* Safety Notice */}
      <footer className="bg-blue-50 border-t border-blue-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Safety Notice</h4>
              <p className="text-sm text-blue-600">
                This is a peer support community. If you're experiencing a crisis or need immediate help, 
                please contact professional mental health services or emergency services.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityForum;
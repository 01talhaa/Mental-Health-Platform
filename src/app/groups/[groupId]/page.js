'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Homepage/Header';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const GroupPostsPage = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  // User map for user_id -> full_name
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    if (!groupId) return;
    // Fetch posts
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/support-groups/${groupId}/posts`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    // Fetch members
    const fetchMembers = async () => {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/support-groups/${groupId}/members`);
        if (!res.ok) throw new Error('Failed to fetch group members');
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        setMembersError(err.message);
      } finally {
        setMembersLoading(false);
      }
    };
    fetchMembers();
    // Fetch all users for user map
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users`);
        if (!res.ok) return;
        const users = await res.json();
        const map = {};
        users.forEach(u => { map[u.user_id] = u.full_name; });
        setUserMap(map);
      } catch {}
    };
    fetchUsers();
    // Check join status (simple: check localStorage for joinedGroups array)
    let joinedGroups = [];
    try {
      joinedGroups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
    } catch {}
    setJoined(joinedGroups.includes(Number(groupId)));
  }, [groupId]);

  // Like post handler (uses unified getUserInfo, never prompts for login if user is logged in)
  const handleLikePost = async (postId) => {
    const { userId, refreshToken } = getUserInfo();
    if (!userId || !refreshToken) {
      alert('Please log in to like posts.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error('Failed to like post');
      // Only increase the like count live, do not show the response message
      setSelectedPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev);
      setPosts(prevPosts => Array.isArray(prevPosts) ? prevPosts.map(p => p.post_id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p) : prevPosts);
    } catch (err) {
      // Optionally handle error, but do not show API message
    }
  };

  // Show post details modal and fetch comments from API, enriching with user names
  const handlePostClick = async (post) => {
    setShowPostModal(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${post.post_id}/comments`);
      let comments = [];
      if (res.ok) {
        comments = await res.json();
      }
      // Enrich comments with user name from userMap
      setSelectedPost(prev => {
        // Use latest userMap
        const map = typeof userMap === 'object' ? userMap : {};
        const enrichedComments = Array.isArray(comments)
          ? comments.map(c => ({ ...c, full_name: map[c.user_id] }))
          : [];
        return { ...post, comments: enrichedComments };
      });
    } catch {
      setSelectedPost({ ...post, comments: [] });
    }
  };

  const handleJoinGroup = async () => {
    setJoinLoading(true);
    setJoinError(null);
    setJoinSuccess(null);
    // Get token from localStorage user
    let token = '';
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      token = user.token || '';
    } catch {}
    if (!token) {
      setJoinError('You must be logged in to join a group.');
      setJoinLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/support-groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error('Failed to join group');
      const data = await res.json();
      setJoinSuccess(data.message || 'Successfully joined group');
      setJoined(true);
      // Store joined group in localStorage
      let joinedGroups = [];
      try {
        joinedGroups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
      } catch {}
      if (!joinedGroups.includes(Number(groupId))) {
        joinedGroups.push(Number(groupId));
        localStorage.setItem('joinedGroups', JSON.stringify(joinedGroups));
      }
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    setJoinLoading(true);
    setJoinError(null);
    setJoinSuccess(null);
    // Get token from localStorage user
    let token = '';
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      token = user.token || '';
    } catch {}
    if (!token) {
      setJoinError('You must be logged in to leave a group.');
      setJoinLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/support-groups/${groupId}/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error('Failed to leave group');
      const data = await res.json();
      setJoinSuccess(data.message || 'Successfully left group');
      setJoined(false);
      // Remove from localStorage
      let joinedGroups = [];
      try {
        joinedGroups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
      } catch {}
      joinedGroups = joinedGroups.filter(id => id !== Number(groupId));
      localStorage.setItem('joinedGroups', JSON.stringify(joinedGroups));
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setJoinLoading(false);
    }
  };

  // State for create post modal
  const [newPost, setNewPost] = useState({ title: '', content: '', post_anonymously: false });
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [createPostError, setCreatePostError] = useState(null);
  const [createPostSuccess, setCreatePostSuccess] = useState(null);

  // Add comment handler (uses unified getUserInfo, never prompts for login if user is logged in)
  const handleAddComment = async () => {
    setCommentError(null);
    setCommentLoading(true);
    const { userId, refreshToken } = getUserInfo();
    if (!userId || !refreshToken) {
      setCommentError('Please log in to comment.');
      setCommentLoading(false);
      return;
    }
    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty.');
      setCommentLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${selectedPost.post_id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ user_id: userId, content: commentContent })
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const data = await res.json();
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments ? [...prev.comments, data] : [data],
        comments_count: (prev.comments_count || 0) + 1
      } : prev);
      setCommentContent('');
    } catch (err) {
      setCommentError('Failed to add comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  // Helper to get user_id and refresh token from login info/localStorage
  const getUserInfo = () => {
    let userId = null;
    let refreshToken = null;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      userId = user.user_id || user._id || user.id || null;
      refreshToken = user.refreshToken || user.refresh_token || user.token || null;
    } catch {}
    return { userId, refreshToken };
  };

  // State for comment input in modal
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  // Create post handler (uses unified getUserInfo and refreshToken for Authorization)
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreatePostError(null);
    setCreatePostSuccess(null);
    setCreatePostLoading(true);
    const { userId, refreshToken } = getUserInfo();
    if (!userId || !refreshToken) {
      setCreatePostError('Please log in to create a post.');
      setCreatePostLoading(false);
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setCreatePostError('Title and content are required.');
      setCreatePostLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        body: JSON.stringify({
          title: newPost.title,
          user_id: userId,
          content: newPost.content,
          group_id: Number(groupId),
          post_anonymously: newPost.post_anonymously
        })
      });
      if (!res.ok) throw new Error('Failed to create post');
      setCreatePostSuccess('Post created successfully!');
      setShowCreatePostModal(false);
      setNewPost({ title: '', content: '', post_anonymously: false });
      // Refresh posts
      setLoading(true);
      const postsRes = await fetch(`${API_BASE_URL}/api/support-groups/${groupId}/posts`);
      const postsData = await postsRes.json();
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      setCreatePostError(err.message);
    } finally {
      setCreatePostLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Header />
      <div className="max-w-3xl mx-auto mt-24 px-4">
        <h1 className="text-2xl font-bold mb-6">Group Posts</h1>
        {/* Create New Post Modal */}
        {showCreatePostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowCreatePostModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">Create New Post</h2>
              {createPostError && <div className="text-red-600 mb-2">{createPostError}</div>}
              {createPostSuccess && <div className="text-green-700 mb-2">{createPostSuccess}</div>}
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter post title..."
                    value={newPost.title}
                    onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    placeholder="Write your post..."
                    value={newPost.content}
                    onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newPost.post_anonymously}
                    onChange={e => setNewPost(p => ({ ...p, post_anonymously: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Post anonymously</span>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreatePostModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={createPostLoading}
                  >
                    {createPostLoading ? 'Posting...' : 'Create Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {joinError && <div className="text-red-600 mb-2">{joinError}</div>}
            {joinSuccess && <div className="text-green-700 mb-2">{joinSuccess}</div>}
            {joined ? (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={handleLeaveGroup}
                disabled={joinLoading}
              >
                {joinLoading ? 'Leaving...' : 'Leave Group'}
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={handleJoinGroup}
                disabled={joinLoading}
              >
                {joinLoading ? 'Joining...' : 'Join Group'}
              </button>
            )}
          </div>
          <div className="flex justify-end items-center gap-4">
             <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors font-semibold"
              onClick={() => setShowCreatePostModal(true)}
            >
              + Create New Post
            </button>
            <button
              className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
              onClick={() => setShowMembersModal(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-5a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"/></svg>
              See Group Members
            </button>
          </div>
        </div>
        {loading && <div>Loading posts...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="space-y-4 mb-12">
          {(Array.isArray(posts) ? posts : []).map(post => (
            <div
              key={post.post_id}
              className="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-blue-50 transition"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{post.author_name}</span>
                <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-gray-700">{post.content}</div>
            </div>
          ))}
          {(!loading && (!Array.isArray(posts) || posts.length === 0)) && <div className="text-gray-500">No posts found.</div>}
        </div>


        {/* Post Details Modal */}
        {showPostModal && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowPostModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700 mr-4">
                  {selectedPost.author_name?.split(' ').map(n => n[0]).join('').substring(0,2)}
                </div>
                <div>
                  <div className="font-semibold text-blue-900">{selectedPost.author_name}</div>
                  <div className="text-xs text-gray-500">{selectedPost.author_email || ''}</div>
                  <div className="text-xs text-gray-400 mt-1">Posted: {new Date(selectedPost.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-lg font-semibold mb-2">Post</div>
                <div className="text-gray-700 whitespace-pre-line">{selectedPost.content}</div>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-1">
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => handleLikePost(selectedPost.post_id)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-6 0v4a3 3 0 0 0 6 0z"/><path d="M5 15v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/></svg>
                  </button>
                  <span>{selectedPost.likes || 0} Likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2"/><path d="M15 3h-6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>
                  <span>{selectedPost.comments_count || (selectedPost.comments ? selectedPost.comments.length : 0)} Comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/></svg>
                  <span>{selectedPost.replies_count || 0} Replies</span>
                </div>
              </div>
              {/* Comments and replies can be shown here if available */}
              <div className="mt-4">
                <div className="text-md font-semibold mb-2">Comments</div>
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedPost.comments.map((comment, idx) => (
                      <div key={idx} className="bg-gray-100 rounded p-2">
                        <div className="font-semibold text-gray-800">
                          {comment.full_name
                            ? `${comment.full_name} (ID: ${comment.user_id})`
                            : `User ${comment.user_id}`}
                        </div>
                        <div className="text-gray-700">{comment.content}</div>
                        <div className="text-xs text-gray-400">{comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}</div>
                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-4 mt-2">
                            <div className="text-xs font-semibold text-gray-600 mb-1">Replies</div>
                            {comment.replies.map((reply, ridx) => (
                              <div key={ridx} className="bg-gray-50 rounded p-2 mb-1">
                                <div className="font-semibold text-gray-700">{reply.author_name || reply.user_id}</div>
                                <div className="text-gray-700">{reply.content}</div>
                                <div className="text-xs text-gray-400">{reply.created_at ? new Date(reply.created_at).toLocaleString() : ''}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No comments yet.</div>
                )}
                {/* Add comment form */}
                <div className="mt-4">
                  <form onSubmit={e => { e.preventDefault(); handleAddComment(); }} className="flex gap-2 items-start">
                    <textarea
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]"
                      placeholder="Add a comment..."
                      value={commentContent}
                      onChange={e => setCommentContent(e.target.value)}
                      disabled={commentLoading}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={commentLoading}
                    >
                      {commentLoading ? 'Posting...' : 'Post'}
                    </button>
                  </form>
                  {commentError && <div className="text-red-600 mt-1">{commentError}</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Members Modal */}
        {showMembersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowMembersModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-5a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"/></svg>
                Group Members
              </h2>
              {membersLoading ? (
                <div>Loading members...</div>
              ) : membersError ? (
                <div className="text-red-600">{membersError}</div>
              ) : (
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {members.length === 0 ? (
                    <div className="text-gray-500">No members found.</div>
                  ) : (
                    members.map(member => (
                      <div key={member.user_id} className="flex items-center bg-blue-50 rounded-lg p-4 shadow-sm mb-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700 mr-4">
                          {member.full_name?.split(' ').map(n => n[0]).join('').substring(0,2)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-blue-900">{member.full_name}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                          <div className="text-xs text-gray-400 mt-1">Joined: {new Date(member.join_date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default GroupPostsPage;
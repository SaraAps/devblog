import { useState, useEffect } from 'react';
import { PlusCircle, MessageCircle, Tag, Calendar, User, Send, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: (string | BlogTag)[];
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface BlogTag {
  _id: string;
  name: string;
}

const BlogApp = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from:', `${API_BASE_URL}/posts`);
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Posts received:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Make sure your backend is running on port 5000.');
    }
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      console.log('Fetching tags from:', `${API_BASE_URL}/tags`);
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Tags received:', data);
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags. Make sure your backend is running on port 5000.');
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    }
  };

  // Create new post
  const createPost = async () => {
    try {
      const tagsArray = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // First, create/find tags
      const tagPromises = tagsArray.map(async (tagName) => {
        // Check if tag already exists
        const existingTag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
        if (existingTag) {
          return existingTag._id;
        }
        
        // Create new tag
        const response = await fetch(`${API_BASE_URL}/tags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: tagName })
        });
        if (!response.ok) throw new Error('Failed to create tag');
        const newTag = await response.json();
        return newTag._id;
      });
      
      const tagIds = await Promise.all(tagPromises);
      
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          tags: tagIds
        })
      });
      if (!response.ok) throw new Error('Failed to create post');
      setNewPost({ title: '', content: '', tags: '' });
      setShowCreatePost(false);
      await fetchPosts();
      await fetchTags(); // Refresh tags in case new ones were created
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
    }
  };

  // Add comment
  const addComment = async () => {
    if (!selectedPost || !newComment.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${selectedPost._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      setNewComment('');
      fetchComments(selectedPost._id);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  // Create tag
  const createTag = async () => {
    if (!newTag.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag })
      });
      if (!response.ok) throw new Error('Failed to create tag');
      setNewTag('');
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      setError('Failed to create tag');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPosts(), fetchTags()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost._id);
    }
  }, [selectedPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-800">DevOps Blog</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusCircle size={20} />
              New Post
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Latest Posts</h2>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>No posts yet. Create your first post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{post.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={16} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                        >
                          {typeof tag === 'string' ? tag : tag.name || 'Unknown'}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Tag size={20} />
                Tags
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add new tag"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && createTag()}
                  />
                  <button
                    onClick={createTag}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Posts</span>
                  <span className="font-semibold text-slate-800">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Tags</span>
                  <span className="font-semibold text-slate-800">{tags.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedPost.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {typeof tag === 'string' ? tag : tag.name || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none mb-8">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageCircle size={20} />
                  Comments ({comments.length})
                </h3>
                
                {/* Add Comment */}
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addComment()}
                  />
                  <button
                    onClick={addComment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User size={14} />
                        <span>{comment.author}</span>
                        <span>•</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-slate-500 text-center py-8">No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Create New Post</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your post content..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={createPost}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Post
                </button>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogApp;
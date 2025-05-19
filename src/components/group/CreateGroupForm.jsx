import { useState } from 'react';

export default function CreateGroupForm({ availablePosts, onCreateGroup }) {
  const [groupName, setGroupName] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostSelect = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedPosts.length === 0) return;
    
    setIsSubmitting(true);
    try {
      onCreateGroup({
        name: groupName,
        postIds: selectedPosts
      });
      setGroupName('');
      setSelectedPosts([]);
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Create New Group</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter group name"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Collections ({selectedPosts.length} selected)
          </label>
          <div className="space-y-3 max-h-60 overflow-y-auto p-3 border border-gray-300 rounded-lg">
            {availablePosts.length > 0 ? (
              availablePosts.map(post => (
                <div key={post.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id={`post-${post.id}`}
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handlePostSelect(post.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`post-${post.id}`} className="font-medium text-gray-700">
                      {post.username}
                    </label>
                    <p className="text-gray-500 line-clamp-2">{post.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No collections available</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !groupName.trim() || selectedPosts.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Creating...</span>
            </>
          ) : (
            'Create Group'
          )}
        </button>
      </form>
    </div>
  );
}
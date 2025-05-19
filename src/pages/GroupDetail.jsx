import { useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function GroupDetail() {
  const { groupId } = useParams();
  const location = useLocation();
  const [groupData, setGroupData] = useState(location.state?.groupData || null);
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");

  const toggleComments = (collectionId) => {
    setActiveComment(activeComment === collectionId ? null : collectionId);
  };

  const addComment = (collectionId) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      username: "You",
      handle: "@you",
      avatar: "https://i.pravatar.cc/150?img=10",
      content: commentText,
      date: "Just now"
    };

    setGroupData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === collectionId 
          ? { 
              ...item, 
              comments: [...item.comments, newComment],
              stats: {
                ...item.stats,
                comments: item.stats.comments + 1
              }
            } 
          : item
      )
    }));

    setCommentText("");
  };

  if (!groupData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Group Not Found</h2>
          <p className="text-gray-500">The group you're looking for doesn't exist or couldn't be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{groupData.name}</h1>
          <p className="text-gray-500 mt-2">
            {groupData.items.length} {groupData.items.length === 1 ? 'collection' : 'collections'}
          </p>
        </div>

        <div className="space-y-6">
          {groupData.items.length > 0 ? (
            groupData.items.map((collection) => (
              <div key={collection.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-start gap-3">
                  <img
                    src={collection.avatar}
                    alt={collection.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold">{collection.username}</h3>
                      <span className="text-gray-500">{collection.handle}</span>
                      <span className="text-gray-400">· {collection.date}</span>
                    </div>

                    <p className="mt-2 whitespace-pre-line">{collection.content}</p>

                    {collection.media && (
                      <div className="mt-4 rounded-lg overflow-hidden border">
                        <img
                          src={collection.media}
                          alt="Collection media"
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    )}

                    <div className="mt-4 flex gap-4 text-gray-500">
                      <button className="flex items-center gap-1 hover:text-red-500">
                        ❤️ {collection.stats.likes}
                      </button>

                      <button
                        className="flex items-center gap-1 hover:text-blue-500"
                        onClick={() => toggleComments(collection.id)}
                      >
                        💬 {collection.stats.comments}
                      </button>
                    </div>

                    {activeComment === collection.id && (
                      <div className="mt-4 border-t pt-4">
                        <div className="space-y-3 mb-4">
                          {collection.comments.length > 0 ? (
                            collection.comments.map(comment => (
                              <div key={comment.id} className="flex gap-2">
                                <img
                                  src={comment.avatar}
                                  alt={comment.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1 bg-gray-50 p-2 rounded-lg">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-sm">{comment.username}</span>
                                    <span className="text-gray-400 text-xs">{comment.date}</span>
                                  </div>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-center py-2">No comments yet</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => addComment(collection.id)}
                            className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 transition"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-gray-500">This group doesn't have any collections yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
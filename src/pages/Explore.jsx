import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useOpenAction } from '@lens-protocol/react-web';

const dummyCollections = [
  {
    id: 1,
    username: "panda",
    handle: "@Panda",
    publicationId: "0x01-0x0a",
    avatar: "https://i.pinimg.com/736x/56/18/ca/5618ca10625a248f2eb039acd4d98367.jpg",
    content: "happy weekend!!",
    date: "May 8",
    stats: {
      likes: 4,
      comments: 7
    },
    media: "https://i.pinimg.com/736x/41/06/b3/4106b37e6f8483a756ab76fc1531af16.jpg",
    isCollected: true,
    comments: []
  },
  {
    id: 2,
    username: "TextCollector",
    handle: "@textonly",
    publicationId: null,
    avatar: "https://i.pinimg.com/736x/1c/c8/6c/1cc86c82cf79793919fd8ed895f77ee5.jpg",
    content: "This is a text-only collection that can still be collected",
    date: "May 9",
    stats: {
      likes: 23,
      comments: 3
    },
    isCollected: true,
    comments: []
  },
  {
    id: 3,
    username: "mr.text",
    handle: "@thetext",
    publicationId: null,
    avatar: "https://i.pinimg.com/736x/6c/62/c4/6c62c44441264a81f842dd915ccd6e69.jpg",
    content: "good morning",
    date: "May 19",
    stats: {
      likes: 25,
      comments: 0
    },
    isCollected: false,
    comments: []
  }

];

export default function Explore() {
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { openAction } = useOpenAction();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCollections(dummyCollections);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCollect = async (collectionId, publicationId) => {
    if (!publicationId) {
      alert("No Lens publication ID provided.");
      return;
    }

    try {
      setIsPending(true);
      const result = await openAction({
        collect: {
          publicationId: publicationId,
        },
      });

      if (result?.isFailure?.()) {
        alert("Collect failed: " + result.error.message);
        return;
      }

      setCollections(prev =>
        prev.map(c =>
          c.id === collectionId ? { ...c, isCollected: true } : c
        )
      );
    } catch (err) {
      console.error("Collect error:", err);
    } finally {
      setIsPending(false);
    }
  };

  const toggleComments = (collectionId) => {
    setActiveComment(activeComment === collectionId ? null : collectionId);
  };

  const addComment = (collectionId) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      username: "currentUser",
      handle: "@you",
      avatar: "https://i.pinimg.com/736x/49/b8/8d/49b88dc2636474b9fabcd9d633749b0a.jpg",
      content: commentText,
      date: "Just now"
    };

    setCollections(collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          comments: [...collection.comments, newComment],
          stats: {
            ...collection.stats,
            comments: collection.stats.comments + 1
          }
        };
      }
      return collection;
    }));

    setCommentText("");
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
        <div className="text-center p-8 bg-white rounded-lg shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">🔌 Connect Wallet</h2>
          <p className="text-lg">Please connect your wallet to view collections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center py-4 text-gray-800 sticky top-0 bg-gray-50 z-10 border-b">
        Collections
      </h1>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="max-w-2xl mx-auto space-y-4 pb-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            collections.map((collection) => (
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

                      <div className="ml-auto">
                        {collection.isCollected ? (
                          <span className="flex items-center gap-1 text-blue-500">
                             Collected
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCollect(collection.id, collection.publicationId)}
                            disabled={isPending}
                            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
                          >
                            {isPending ? "Collecting..." : "Collect"}
                          </button>
                        )}
                      </div>
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
          )}
        </div>
      </div>
    </div>
  );
}

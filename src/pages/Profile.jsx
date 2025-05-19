import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { CopyIcon, SingleCollectionIcon, GroupCollectionIcon } from '../components/ui/icons';
import { getNFTsForOwner } from '../lib/nftService';
import CreateGroupForm from '../components/group/CreateGroupForm';
import { useOpenAction } from '@lens-protocol/react-web';
import { Link } from 'react-router-dom';

const dummyCollections = [
  {
    id: 1,
    username: "panda",
    handle: "@Panda",
    publicationId: "0x01-0x0a",
    avatar: "https://i.pinimg.com/736x/56/18/ca/5618ca10625a248f2eb039acd4d98367.jpg",
    content: "happy weekend!!",
    date: "May 8",
    stats: { likes: 4, comments: 7 },
    media: "https://i.pinimg.com/736x/41/06/b3/4106b37e6f8483a756ab76fc1531af16.jpg",
    isCollected: false,
    comments: []
  },
  {
    id: 2,
    username: "TextCollector",
    handle: "@textonly",
    publicationId: "0x01-0x0b",
    avatar: "https://i.pinimg.com/736x/1c/c8/6c/1cc86c82cf79793919fd8ed895f77ee5.jpg",
    content: "This is a text-only collection that can still be collected",
    date: "May 9",
    stats: { likes: 23, comments: 3 },
    isCollected: false,
    comments: []
  }
];

function FallbackProfile({ 
  address, 
  collections, 
  loadingCollections, 
  handleCollect, 
  isPending
}) {
  const [activeTab, setActiveTab] = useState('single');
  const [isCopied, setIsCopied] = useState(false);
  const [groups, setGroups] = useState({});
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const addressColor = `#${address.slice(2, 8)}`;

  const handleCreateGroup = (groupData) => {
    const { name, postIds } = groupData;
    const groupItems = collections.filter(collection => postIds.includes(collection.id));
    setGroups(prev => ({ 
      ...prev, 
      [name]: {
        name,
        items: groupItems
      } 
    }));
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
      avatar: "https://i.pravatar.cc/150?img=10",
      content: commentText,
      date: "Just now"
    };

    // This needs to be handled by parent component
    handleCollect(collectionId, newComment);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100">
 
      {/* Profile Content */}
      <div className="flex-1 relative -mt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-t-3xl shadow-xl min-h-[calc(100vh-10rem)] p-8 pt-32">

            {/* Profile Info */}
            <div className="mt-16">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {shortAddress}
                  </h1>
                  <button 
                    onClick={copyAddress}
                    className="text-gray-500 hover:text-blue-500 transition-colors p-1"
                    title="Copy address"
                  >
                    <CopyIcon className="w-8 h-8" />
                  </button>
                  {isCopied && (
                    <span className="text-lg text-green-500">Copied!</span>
                  )}
                </div>

                {/* Tabs */}
                <div className="w-full max-w-2xl border-b-2 mt-8">
                  <div className="flex">
                    <button
                      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-bold text-xl ${
                        activeTab === 'single' 
                          ? 'text-blue-500 border-b-4 border-blue-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('single')}
                    >
                      <SingleCollectionIcon className="w-6 h-6" />
                      Single
                    </button>
                    <button
                      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-bold text-xl ${
                        activeTab === 'group' 
                          ? 'text-blue-500 border-b-4 border-blue-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('group')}
                    >
                      <GroupCollectionIcon className="w-6 h-6" />
                      Group
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="w-full max-w-4xl mt-8 min-h-[500px]">
                  {activeTab === 'single' ? (
                    <div className="space-y-4">
                      {loadingCollections ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : collections.length > 0 ? (
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
                                        ✅ Collected
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
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-xl text-gray-500">No collections found</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full p-8">
                      <h2 className="text-2xl font-bold mb-6">Your Groups</h2>
                      
                      <CreateGroupForm 
                        availablePosts={collections}
                        onCreateGroup={handleCreateGroup}
                      />
                      
                      {Object.keys(groups).length > 0 ? (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(groups).map(([groupName, groupData]) => (
                            <Link 
                              to={`/group/${encodeURIComponent(groupName)}`}
                              state={{ groupData }}
                              key={groupName} 
                              className="group-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              <div className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">{groupName}</h3>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">
                                    {groupData.items.length} {groupData.items.length === 1 ? 'item' : 'items'}
                                  </span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                  {groupData.items.slice(0, 4).map((item, index) => (
                                    <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                                      {item.media ? (
                                        <img
                                          src={item.media}
                                          alt={item.content}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                          No media
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No groups created yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [groups, setGroups] = useState({});
  const { openAction } = useOpenAction();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const { useProfiles } = await import('@lens-protocol/react-web');
        const { data: profiles } = useProfiles({ 
          where: { ownedBy: [address] },
          skip: !address
        });

        if (profiles?.[0]) {
          setProfileData({
            type: 'lens',
            profile: profiles[0]
          });
        } else {
          setProfileData({
            type: 'wallet',
            address
          });
        }
      } catch (error) {
        console.warn('Lens not available, falling back to wallet:', error);
        setProfileData({
          type: 'wallet', 
          address
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [address, isConnected]);

  useEffect(() => {
    if (!address) return;

    const loadCollections = async () => {
      setLoadingCollections(true);
      try {
        const nftResponse = await getNFTsForOwner(address);
        
        if (nftResponse.success && nftResponse.data.length > 0) {
          const formattedCollections = nftResponse.data.map((nft, index) => ({
            id: index + 1,
            username: nft.collectionName || "NFT Collector",
            handle: `@${nft.collectionName?.toLowerCase().replace(/\s/g, '') || 'nftcollector'}`,
            publicationId: nft.tokenId,
            avatar: nft.media || 'https://i.pravatar.cc/150?img=3',
            content: nft.description || `NFT from ${nft.collectionName}`,
            date: new Date().toLocaleDateString(),
            stats: {
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 50)
            },
            media: nft.media,
            isCollected: true,
            comments: []
          }));
          
          setCollections(formattedCollections);
        } else {
          console.log("Using dummy data as fallback");
          setCollections([...dummyCollections]);
        }
      } catch (error) {
        console.error("Error loading collections:", error);
        setCollections([...dummyCollections]);
      } finally {
        setLoadingCollections(false);
      }
    };

    loadCollections();
  }, [address]);

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

  const handleCreateGroup = (groupData) => {
    const { name, postIds } = groupData;
    const groupItems = collections.filter(collection => postIds.includes(collection.id));
    setGroups(prev => ({ 
      ...prev, 
      [name]: {
        name,
        items: groupItems
      } 
    }));
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
        <div className="text-center p-8 bg-white rounded-lg shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">🔌 Connect Wallet</h2>
          <p className="text-lg">Please connect your wallet to view profile</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <FallbackProfile 
      address={address} 
      collections={collections} 
      loadingCollections={loadingCollections}
      handleCollect={handleCollect}
      isPending={isPending}
    />
  );
}
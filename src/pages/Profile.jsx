import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { CopyIcon, SingleCollectionIcon, GroupCollectionIcon } from '../components/ui/icons';
import { getNFTsForOwner } from '../lib/nftService';

function FallbackProfile({ address, nfts, loadingNFTs }) {
  const [activeTab, setActiveTab] = useState('single');
  const [isCopied, setIsCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const addressColor = `#${address.slice(2, 8)}`;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Header */}
      <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 w-full shadow-lg"></div>
      
      {/* Profile Content */}
      <div className="flex-1 relative -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-t-3xl shadow-xl min-h-[calc(100vh-10rem)] p-8 pt-32">
            
            {/* Profile Picture */}
            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
              <div 
                className="w-40 h-40 rounded-full border-8 border-white shadow-xl flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: addressColor }}
              >
                {shortAddress}
              </div>
            </div>

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
                    <div className="h-full p-8">
                      <h2 className="text-2xl font-bold mb-6">Your NFT Collection</h2>
                      
                      {loadingNFTs ? (
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : nfts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {nfts.map((nft, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                              <div className="aspect-square bg-gray-100 relative">
                                {nft.media ? (
                                  <img 
                                    src={nft.media} 
                                    alt={nft.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null; 
                                      e.target.src = '/placeholder-nft.png';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-500">No media</span>
                                  </div>
                                )}
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold truncate">{nft.title || `#${nft.tokenId}`}</h3>
                                <p className="text-sm text-gray-500 truncate">{nft.collectionName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-xl text-gray-500">No NFTs found in your wallet</p>
                          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
                            Refresh Collection
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                      <p className="text-2xl text-gray-500 mb-8">
                        Your groups will appear here
                      </p>
                      <button className="px-10 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xl font-bold shadow-lg transition-all">
                        Create Group
                      </button>
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
  const [nfts, setNfts] = useState([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  // Load profile data
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

    const loadNFTs = async () => {
      setLoadingNFTs(true);
      try {
        const result = await getNFTsForOwner(address);
        if (result.success) {
          setNfts(result.data);
        }
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoadingNFTs(false);
      }
    };

    loadNFTs();
  }, [address]);

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

  if (profileData?.type === 'lens') {
    const { profile } = profileData;
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
        {/* Lens Profile Header */}
        <div 
          className="h-64 w-full bg-cover bg-center"
          style={{ 
            backgroundImage: profile.metadata?.coverPicture 
              ? `url(${profile.metadata.coverPicture.original.url})`
              : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
          }}
        >
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Lens Profile
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 relative -mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-t-3xl shadow-xl min-h-[calc(100vh-10rem)] p-8 pt-32">
              
              {/* Profile Picture */}
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                {profile.metadata?.picture?.__typename === 'ImageSet' ? (
                  <img
                    src={profile.metadata.picture.original.url}
                    alt={profile.handle?.fullHandle}
                    className="w-40 h-40 rounded-full border-8 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div 
                    className="w-40 h-40 rounded-full border-8 border-white shadow-xl flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: `#${address.slice(2, 8)}` }}
                  >
                    {profile.handle?.fullHandle || shortAddress}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="mt-16">
                <div className="flex flex-col items-center gap-4">
                  <h1 className="text-3xl font-bold text-gray-800">
                    @{profile.handle?.fullHandle || shortAddress}
                  </h1>
                  
                  {profile.metadata?.bio && (
                    <p className="text-lg text-gray-600 max-w-2xl text-center">
                      {profile.metadata.bio}
                    </p>
                  )}

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
                      <div className="h-full p-8">
                        <h2 className="text-2xl font-bold mb-6">Your NFT Collection</h2>
                        
                        {loadingNFTs ? (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        ) : nfts.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {nfts.map((nft, index) => (
                              <div key={index} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <div className="aspect-square bg-gray-100 relative">
                                  {nft.media ? (
                                    <img 
                                      src={nft.media} 
                                      alt={nft.title} 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = '/placeholder-nft.png';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                      <span className="text-gray-500">No media</span>
                                    </div>
                                  )}
                                </div>
                                <div className="p-4">
                                  <h3 className="font-semibold truncate">{nft.title || `#${nft.tokenId}`}</h3>
                                  <p className="text-sm text-gray-500 truncate">{nft.collectionName}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-xl text-gray-500">No NFTs found in your wallet</p>
                            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
                              Refresh Collection
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8">
                        <p className="text-2xl text-gray-500 mb-8">
                          Your groups will appear here
                        </p>
                        <button className="px-10 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xl font-bold shadow-lg transition-all">
                          Create Group
                        </button>
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

  return <FallbackProfile address={address} nfts={nfts} loadingNFTs={loadingNFTs} />;
}
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "demo",
  network: Network.MATIC_AMOY,
};

const alchemy = new Alchemy(settings);

export const dummyCollections = {
  single: [
    {
      tokenId: "1",
      title: "Introduction to Lens Protocol",
      description: "Learn how to build on Lens Protocol",
      media: "https://i.imgur.com/abc123.jpg",
      collectionName: "Lens Tutorials",
      publicationId: "0x01-0x01"
    },
    {
      tokenId: "2",
      title: "Web3 Design Patterns",
      description: "Common patterns in Web3 development",
      media: "https://i.imgur.com/def456.jpg",
      collectionName: "Web3 Guides",
      publicationId: "0x01-0x02"
    },
    {
      tokenId: "3",
      title: "Smart Contract Security",
      description: "Best practices for secure contracts",
      media: "https://i.imgur.com/ghi789.jpg",
      collectionName: "Security",
      publicationId: "0x01-0x03"
    }
  ],
  groups: {
    "Web3 Tutorials": [
      {
        tokenId: "1",
        title: "Introduction to Lens Protocol",
        media: "https://i.imgur.com/abc123.jpg",
        collectionName: "Lens Tutorials",
        publicationId: "0x01-0x01"
      }
    ],
    "Security Guides": [
      {
        tokenId: "3",
        title: "Smart Contract Security",
        media: "https://i.imgur.com/ghi789.jpg",
        collectionName: "Security",
        publicationId: "0x01-0x03"
      }
    ]
  }
};

export function setupDummyData() {
  if (!localStorage.getItem('lenscollective-groups')) {
    localStorage.setItem('lenscollective-groups', JSON.stringify(dummyCollections.groups));
  }
}

export async function getNFTsForOwner(address) {
  try {
    // For demo purposes, return dummy data if no Alchemy API key
    if (!import.meta.env.VITE_ALCHEMY_API_KEY) {
      return {
        success: true,
        data: dummyCollections.single
      };
    }

    const response = await alchemy.nft.getNftsForOwner(address);
    const nfts = response.ownedNfts.filter(nft =>
      nft.tokenType === "ERC721" || nft.tokenType === "ERC1155"
    );

    return {
      success: true,
      data: nfts.map(nft => ({
        tokenId: nft.tokenId,
        title: nft.title,
        description: nft.description,
        media: nft.media?.[0]?.gateway || '',
        collectionName: nft.contract.openSea?.collectionName || 'Unknown',
        publicationId: nft.tokenId // Using tokenId as dummy publicationId
      }))
    };
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return {
      success: false,
      error: "Failed to fetch NFTs",
      data: dummyCollections.single // Fallback to dummy data
    };
  }
}
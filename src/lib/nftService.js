import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "demo",
  network: Network.MATIC_AMOY,
};

const alchemy = new Alchemy(settings);

export async function getNFTsForOwner(address) {
  try {
    if (!address) {
      throw new Error("No address provided");
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
        publicationId: nft.tokenId 
      }))
    };
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return {
      success: false,
      error: "Failed to fetch NFTs",
      data: []
    };
  }
}

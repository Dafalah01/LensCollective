import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "demo", 
  network: Network.MATIC_AMOY, 
};

const alchemy = new Alchemy(settings);


export async function getNFTsForOwner(address) {
  try {
    const response = await alchemy.nft.getNftsForOwner(address);

    const nfts = response.ownedNfts.filter(nft =>
      nft.tokenType === "ERC721" || nft.tokenType === "ERC1155"
    );

    return {
      success: true,
      data: nfts.map(nft => ({
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        title: nft.title,
        description: nft.description,
        media: nft.media?.[0]?.gateway || '',
        collectionName: nft.contract.openSea?.collectionName || 'Unknown',
        tokenType: nft.tokenType,
      })),
    };
  } catch (error) {
    console.error("Error fetching NFTs for owner:", error);
    return {
      success: false,
      error: "Failed to fetch NFTs for owner",
    };
  }
}


export async function getNFTsForCollection(contractAddress, limit = 10) {
  try {
    const response = await alchemy.nft.getNftsForContract(contractAddress, {
      pageSize: limit,
    });

    return {
      success: true,
      data: response.nfts.map(nft => ({
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        title: nft.title,
        media: nft.media?.[0]?.gateway || '',
      })),
    };
  } catch (error) {
    console.error("Error fetching NFTs for collection:", error);
    return {
      success: false,
      error: "Failed to fetch NFTs for collection",
    };
  }
}

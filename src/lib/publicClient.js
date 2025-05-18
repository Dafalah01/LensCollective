import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'wagmi/chains'; 


export const publicClient = createPublicClient({
  chain: polygonAmoy, 
  transport: http('https://polygon-amoy.g.alchemy.com/v2/jST9wrgk-7GjCV0s0qIirZp2G5CunVzZ')
});
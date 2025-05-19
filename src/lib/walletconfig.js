import { getDefaultConfig } from 'connectkit';
import { createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';

export const config = createConfig(
  getDefaultConfig({
    appName: 'LensCollective',
    chains: [polygonAmoy],
    walletConnectProjectId: '3605b02c437ef6bac0a708db1792c4ab',
    autoConnect: true,
    ssr: false,
    walletConnectOptions: {
      projectId: '3605b02c437ef6bac0a708db1792c4ab',
      metadata: {
        name: 'LensCollective',
        description: 'Lens Protocol Application',
        url: window.location.origin,
        icons: ['https://example.com/icon.png']
      }
    }
  })
);
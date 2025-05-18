import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/walletconfig';
import { LensProvider, production } from '@lens-protocol/react-web';
import { bindings } from '@lens-protocol/wagmi';

const queryClient = new QueryClient();

const lensConfig = {
  bindings: bindings(),
  environment: production, 
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LensProvider config={lensConfig}>
          <ConnectKitProvider>
            <App />
          </ConnectKitProvider>
        </LensProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
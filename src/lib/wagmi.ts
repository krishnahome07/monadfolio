import { http, createConfig } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';

// Define Monad testnet chain (since Monad mainnet isn't available yet)
export const monadTestnet = {
  id: 41454,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet1.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.testnet1.monad.xyz' },
  },
  testnet: true,
} as const;

export const config = createConfig({
  chains: [base, mainnet, monadTestnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [monadTestnet.id]: http(),
  },
  connectors: [
    miniAppConnector()
  ],
});
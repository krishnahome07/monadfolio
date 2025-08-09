import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'

// Monad Testnet configuration
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet1.monad.xyz'],
    },
    public: {
      http: ['https://testnet1.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
} as const

export const config = createConfig({
  chains: [monadTestnet, base, mainnet],
  transports: {
    [monadTestnet.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    miniAppConnector()
  ]
})
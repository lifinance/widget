import { mainnet } from 'viem/chains'
import { http, createConfig } from 'wagmi'
import { thirdwebWagmiConnector } from './thirdweb'

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [thirdwebWagmiConnector],
  transports: {
    [mainnet.id]: http(),
  },
})

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'viem/chains'

export const config = getDefaultConfig({
  appName: 'LI.FI Widget RainbowKit',
  projectId: import.meta.env.VITE_WALLET_CONNECT,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
})

import { createConfig } from '@privy-io/wagmi'
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config } from 'wagmi'

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
}) as Config

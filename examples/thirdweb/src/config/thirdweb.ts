import { inAppWalletConnector } from '@thirdweb-dev/wagmi-adapter'
import { createThirdwebClient, defineChain as thirdwebChain } from 'thirdweb'
import { mainnet } from 'viem/chains'

export const THIRDWEB_CLIENT_ID: string = import.meta.env
  .VITE_THIRDWEB_CLIENT_ID

export const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
})

export const thirdwebWagmiConnector = inAppWalletConnector({
  client,
  // optional: turn on smart accounts!
  smartAccount: {
    sponsorGas: true,
    chain: thirdwebChain(mainnet),
  },
})

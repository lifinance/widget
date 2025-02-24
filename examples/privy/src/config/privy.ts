import type { PrivyClientConfig } from '@privy-io/react-auth'

import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
})

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ['wallet', 'email', 'sms'],
  appearance: {
    walletChainType: 'ethereum-and-solana',
    showWalletLoginFirst: true,
    logo: 'https://avatars.githubusercontent.com/u/85288935', // your company logo here
  },
  externalWallets: {
    solana: {
      connectors: solanaConnectors,
    },
  },
  solanaClusters: [
    {
      name: 'mainnet-beta',
      // replace this with your rpc url
      rpcUrl: 'https://chaotic-restless-putty.solana-mainnet.quiknode.pro/',
    },
  ],
}

export const PRIVY_APP_ID: string = import.meta.env.VITE_PRIVY_APP_ID

export const PRIVY_CLIENT_ID: string = import.meta.env.VITE_PRIVY_CLIENT_ID

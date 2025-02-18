import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { createAppKit } from '@reown/appkit/react'

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import type React from 'react'

import { type AppKitNetwork, base } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'

const projectId = import.meta.env.VITE_REOWN_APP_ID

const metadata = {
  name: 'LiFi Widget',
  description: 'Li.Fi Widget AppKit Example',
  url: 'https://li.fi',
  icons: [
    'https://cdn.brandfetch.io/li.finance/w/512/h/195/logo?c=1id_Z_xJnoSm1uCNb-X',
  ],
}

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [base]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
})

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
})

const bitcoinAdapter = new BitcoinAdapter({
  projectId,
})

createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
  networks,
  projectId,
  metadata,
})

export function BasicWalletProvider({
  children,
}: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}

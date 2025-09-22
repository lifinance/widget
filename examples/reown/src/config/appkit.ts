import { bitcoin, solana } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet } from 'wagmi/chains'

export const projectId = import.meta.env.VITE_REOWN_APP_ID

export const metadata = {
  name: 'LIFI Widget',
  description: 'LI.FI Widget AppKit Example',
  url: 'https://li.fi',
  icons: ['https://avatars.githubusercontent.com/u/85288935'],
}

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet],
  projectId,
  ssr: true,
})

export const solanaWeb3JsAdapter = new SolanaAdapter()

export const bitcoinAdapter = new BitcoinAdapter({
  projectId,
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
  networks: [solana, bitcoin, mainnet],
  projectId,
  metadata,
  themeMode: 'light',
  defaultNetwork: mainnet,
})

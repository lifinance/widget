import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'

import {
  type AppKitNetwork,
  defineChain,
  mainnet,
} from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { ChainNamespace } from '@reown/appkit-common'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import type React from 'react'
import { useRef } from 'react'
import { type Config, type CreateConnectorFn, WagmiProvider } from 'wagmi'

const projectId = import.meta.env.VITE_REOWN_APP_ID

const metadata = {
  name: 'LiFi Widget',
  description: 'Li.Fi Widget AppKit Example',
  url: 'https://li.fi',
  icons: [
    'https://cdn.brandfetch.io/li.finance/w/512/h/195/logo?c=1id_Z_xJnoSm1uCNb-X',
  ],
}

const defaultChain = mainnet
const connectors: CreateConnectorFn[] = []

export function WalletProvider({
  children,
  chains,
}: { children: React.ReactNode; chains: ExtendedChain[] }) {
  const wagmi = useRef<Config | undefined>(undefined)

  if (!wagmi.current) {
    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
      defaultChain,
      ...chainToAppKitNetworks(chains),
    ]

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

    wagmi.current = wagmiAdapter.wagmiConfig
  }

  useSyncWagmiConfig(
    wagmi.current,
    connectors,
    chains?.filter((chain) => chain.chainType === ChainType.EVM)
  )

  return (
    <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}

export function WalletProviderWithLiFiChains({
  children,
}: { children: React.ReactNode }) {
  const { chains, isLoading } = useAvailableChains()

  if (isLoading) {
    return 'Loading Li.Fi chains'
  }

  return chains && <WalletProvider chains={chains}>{children}</WalletProvider>
}

type AppkitsupportedChainTypes = Exclude<ChainType, ChainType.MVM>

const ChainTypeSpaceMap: Record<AppkitsupportedChainTypes, ChainNamespace> = {
  [ChainType.EVM]: 'eip155',
  [ChainType.UTXO]: 'bip122',
  [ChainType.SVM]: 'solana',
}

const chainToAppKitNetworks = (chains: ExtendedChain[]): AppKitNetwork[] =>
  chains
    .filter((chain) => chain.chainType === ChainType.EVM)
    .map((chain) =>
      defineChain({
        id: chain.id,
        blockExplorers: {
          default: {
            name: `${chain.name} explorer`,
            url: chain.metamask.blockExplorerUrls[0],
          },
        },
        name: chain.metamask.chainName,
        rpcUrls: {
          default: {
            http: [chain.metamask.rpcUrls[0]],
          },
        },
        nativeCurrency: chain.metamask.nativeCurrency,
        chainNamespace:
          ChainTypeSpaceMap[chain.chainType as AppkitsupportedChainTypes],
        caipNetworkId: `${ChainTypeSpaceMap[chain.chainType as AppkitsupportedChainTypes]}:${chain.id}`,
        assets: {
          imageId: chain.id.toString(),
          imageUrl: chain.logoURI!,
        },
      })
    )

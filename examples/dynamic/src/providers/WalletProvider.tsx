import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import {
  convertExtendedChain,
  isExtendedChain,
  useSyncWagmiConfig,
} from '@lifi/wallet-management'
import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { type Chain, mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { DynamicUTXOProvider } from './DynamicUTXOProvider.js'
import { SolanaProvider } from './SolanaProvider.js'

// All connectors are supplied by Dynamic so we can leave this empty
const connectors: CreateConnectorFn[] = []

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  const wagmi = useRef<Config>(null)

  const evmChains = chains?.filter((chain) => chain.chainType === ChainType.EVM)

  const wagmiChains =
    (evmChains?.map((chain) =>
      isExtendedChain(chain) ? convertExtendedChain(chain) : chain
    ) as [Chain, ...Chain[]]) || []

  if (!wagmi.current) {
    wagmi.current = createConfig({
      chains: [
        mainnet,
        ...wagmiChains.filter((chain) => chain.id !== mainnet.id),
      ],
      multiInjectedProviderDiscovery: false,
      transports: {
        [mainnet.id]: http(),
      },
      ssr: true,
    })
  }

  useSyncWagmiConfig(wagmi.current, connectors, evmChains)

  return (
    <DynamicContextProvider
      settings={{
        // replace with your environment id from https://app.dynamic.xyz/dashboard/developer
        environmentId: '11abe661-8ca5-41b7-a575-83fb45b49049',
        walletConnectors: [
          EthereumWalletConnectors,
          SolanaWalletConnectors,
          ZeroDevSmartWalletConnectors,
          BitcoinWalletConnectors,
        ],
        overrides: {
          // Please ignore these network settings if you specify chains yourself
          evmNetworks: evmChains
            ? convertToDynamicNetworks(evmChains)
            : undefined,
        },
      }}
    >
      <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
        <DynamicWagmiConnector>
          <SolanaProvider>
            <DynamicUTXOProvider>{children}</DynamicUTXOProvider>
          </SolanaProvider>
        </DynamicWagmiConnector>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}

const convertToDynamicNetworks = (chains: ExtendedChain[]) =>
  chains.map((chain) => ({
    blockExplorerUrls: chain.metamask.blockExplorerUrls,
    chainId: chain.id,
    chainName: chain.metamask.chainName,
    iconUrls: [chain.logoURI!],
    name: chain.name,
    nativeCurrency: chain.metamask.nativeCurrency,
    networkId: chain.id,
    rpcUrls: chain.metamask.rpcUrls,
    vanityName: chain.metamask.chainName,
  }))

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { WagmiProvider, createConfig } from 'wagmi'
import { SolanaProvider, emitter } from './SolanaProvider'

// All connectors are supplied by Dynamic so we can leave this empty
const connectors: CreateConnectorFn[] = []

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  const wagmi = useRef<Config>()

  if (!wagmi.current) {
    wagmi.current = createConfig({
      chains: [mainnet],
      multiInjectedProviderDiscovery: false,
      transports: {
        [mainnet.id]: http(),
      },
      ssr: true,
    })
  }

  useSyncWagmiConfig(
    wagmi.current,
    connectors,
    chains?.filter((chain) => chain.chainType === ChainType.EVM)
  )

  return (
    <DynamicContextProvider
      settings={{
        // replace with your environment id from https://app.dynamic.xyz/dashboard/developer
        environmentId: '11abe661-8ca5-41b7-a575-83fb45b49049',
        walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
        overrides: {
          // Please ignore these network settings if you specify chains yourself
          evmNetworks: chains ? convertToDynamicNetworks(chains) : [],
        },
        events: {
          onAuthInit: (args) => {
            if (args.type === 'wallet') {
              emitter.emit('connect', args.connectorName)
            }
          },
          onLogout: () => {
            emitter.emit('disconnect')
          },
        },
        handlers: {
          handleConnectedWallet: async (args) => {
            if (args.chain === 'SOL' && args.connector) {
              emitter.emit('connect', args.connector.name)
            }
            return true
          },
        },
      }}
    >
      <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
        <DynamicWagmiConnector>
          <SolanaProvider>{children}</SolanaProvider>
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

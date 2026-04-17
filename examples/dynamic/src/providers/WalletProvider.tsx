import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import type { ExtendedChain } from '@lifi/sdk'
import { useSyncWagmiConfig } from '@lifi/widget-provider-ethereum'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { useChains } from '../hooks/useChains'
import { DynamicUTXOProvider } from './DynamicUTXOProvider'
import { SolanaProvider } from './SolanaProvider'

// All connectors are supplied by Dynamic so we can leave this empty
const connectors: CreateConnectorFn[] = []

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { evmChains, evmExtendedChains } = useChains()

  const wagmi = useRef<Config>(null)

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
          evmNetworks: evmExtendedChains
            ? convertToDynamicNetworks(evmExtendedChains)
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

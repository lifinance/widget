import { isWalletInstalled } from '@lifi/widget-provider'
import { createClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { createConfig } from 'wagmi'
import type {
  BaseAccountParameters,
  CoinbaseWalletParameters,
  MetaMaskParameters,
  PortoParameters,
  WalletConnectParameters,
} from 'wagmi/connectors'
import { createBaseAccountConnector } from '../connectors/baseAccount.js'
import { createCoinbaseConnector } from '../connectors/coinbase.js'
import { createMetaMaskConnector } from '../connectors/metaMask.js'
import { createPortoConnector } from '../connectors/porto.js'
import { createWalletConnectConnector } from '../connectors/walletConnect.js'

export interface DefaultWagmiConfigProps {
  walletConnect?: WalletConnectParameters
  coinbase?: CoinbaseWalletParameters
  metaMask?: MetaMaskParameters
  baseAccount?: BaseAccountParameters
  porto?: Partial<PortoParameters>
  wagmiConfig?: {
    ssr?: boolean
    multiInjectedProviderDiscovery?: boolean
  }
  connectors?: CreateConnectorFn[]
  /**
   * Load Wallet SDKs only if the wallet is the most recently connected wallet
   */
  lazy?: boolean
}

export interface DefaultWagmiConfigResult {
  config: Config
  connectors: CreateConnectorFn[]
}

/**
 * Creates default Wagmi config that can be later synced (via useSyncWagmiConfig) with chains fetched from LI.FI API.
 * Connectors are loaded dynamically to reduce bundle size - only requested connectors are included.
 * @param props Properties to setup connectors. {@link DefaultWagmiConfigProps}
 * @returns Promise resolving to Wagmi config and connectors. {@link DefaultWagmiConfigResult}
 * @example
 *  const { config, connectors } = await createDefaultWagmiConfig({
 *    walletConnect: {
 *      projectId: import.meta.env.VITE_WALLET_CONNECT,
 *    },
 *    coinbase: { appName: 'LI.FI Demo' },
 *  });
 *  export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
 *    const { chains } = useAvailableChains();
 *    useSyncWagmiConfig(config, connectors, chains);
 *    return (
 *      <WagmiProvider config={wagmi.config} reconnectOnMount={false}>
 *        {children}
 *      </WagmiProvider>
 *    );
 *  };
 */
export async function createDefaultWagmiConfig(
  props?: DefaultWagmiConfigProps
): Promise<DefaultWagmiConfigResult> {
  const connectors: CreateConnectorFn[] = [...(props?.connectors ?? [])]

  const anyWindow = typeof window !== 'undefined' ? (window as any) : undefined
  const localStorage = anyWindow?.localStorage
  // in Multisig env, window.parent is not equal to window
  const isIframeEnvironment = anyWindow && anyWindow.parent !== anyWindow

  const multiInjectedProviderDiscovery = isIframeEnvironment
    ? false
    : (props?.wagmiConfig?.multiInjectedProviderDiscovery ?? true)

  const config = createConfig({
    chains: [mainnet],
    client({ chain }) {
      return createClient({ chain, transport: http() })
    },
    ...props?.wagmiConfig,
    multiInjectedProviderDiscovery,
  })

  if (isIframeEnvironment) {
    const { safe } = await import('wagmi/connectors')
    connectors.unshift(safe())
  }

  // Retrieve the ID of the most recently connected wallet connector from storage
  const recentConnectorId = localStorage?.getItem(
    `${config.storage?.key}.recentConnectorId`
  )

  // Build connector promises - only for connectors that are requested
  const connectorPromises: Promise<CreateConnectorFn>[] = []

  // Check if WalletConnect properties exist in the props
  if (props?.walletConnect) {
    if (recentConnectorId?.includes?.('walletConnect') || !props.lazy) {
      connectorPromises.push(createWalletConnectConnector(props.walletConnect))
    }
  }

  if (props?.coinbase && !isWalletInstalled('coinbase')) {
    if (recentConnectorId?.includes?.('coinbaseWalletSDK') || !props.lazy) {
      connectorPromises.push(createCoinbaseConnector(props.coinbase))
    }
  }

  if (props?.metaMask && !isWalletInstalled('metaMask')) {
    if (recentConnectorId?.includes?.('metaMaskSDK') || !props.lazy) {
      connectorPromises.push(createMetaMaskConnector(props.metaMask))
    }
  }

  if (props?.baseAccount) {
    if (recentConnectorId?.includes?.('baseAccount') || !props.lazy) {
      connectorPromises.push(createBaseAccountConnector(props.baseAccount))
    }
  }

  if (props?.porto) {
    if (recentConnectorId?.includes?.('porto') || !props.lazy) {
      connectorPromises.push(createPortoConnector(props.porto))
    }
  }

  // Load all requested connectors in parallel
  const loadedConnectors = await Promise.all(connectorPromises)
  connectors.unshift(...loadedConnectors)

  return {
    config,
    connectors,
  }
}

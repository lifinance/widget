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
import { safe } from 'wagmi/connectors'
import { createBaseAccountConnector } from '../connectors/baseAccount.js'
import { createCoinbaseConnector } from '../connectors/coinbase.js'
import { createMetaMaskConnector } from '../connectors/metaMask.js'
import { createPortoConnector } from '../connectors/porto.js'
import { createWalletConnectConnector } from '../connectors/walletConnect.js'
import { isWalletInstalled } from './isWalletInstalled.js'

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
 * @param props Properties to setup connectors. {@link DefaultWagmiConfigProps}
 * @returns Wagmi config and connectors. {@link DefaultWagmiConfigResult}
 * @example
 *  const { config, connectors } = createDefaultWagmiConfig({
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
export function createDefaultWagmiConfig(
  props?: DefaultWagmiConfigProps
): DefaultWagmiConfigResult {
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
    connectors.unshift(safe())
  }

  // Retrieve the ID of the most recently connected wallet connector from storage
  const recentConnectorId = localStorage?.getItem(
    `${config.storage?.key}.recentConnectorId`
  )

  // Check if WalletConnect properties exist in the props
  if (props?.walletConnect) {
    // If WalletConnect is the most recently connected wallet or lazy loading is disabled,
    // add the WalletConnect connector to the beginning of the connectors list
    if (recentConnectorId?.includes?.('walletConnect') || !props.lazy) {
      connectors.unshift(createWalletConnectConnector(props.walletConnect))
    }
  }

  if (props?.coinbase && !isWalletInstalled('coinbase')) {
    if (recentConnectorId?.includes?.('coinbaseWalletSDK') || !props.lazy) {
      connectors.unshift(createCoinbaseConnector(props.coinbase))
    }
  }

  if (props?.metaMask && !isWalletInstalled('metaMask')) {
    if (recentConnectorId?.includes?.('metaMaskSDK') || !props.lazy) {
      connectors.unshift(createMetaMaskConnector(props.metaMask))
    }
  }

  if (props?.baseAccount) {
    if (recentConnectorId?.includes?.('baseAccount') || !props.lazy) {
      connectors.unshift(createBaseAccountConnector(props.baseAccount))
    }
  }

  if (recentConnectorId?.includes?.('porto') || !props?.lazy) {
    connectors.unshift(createPortoConnector(props?.porto))
  }

  return {
    config,
    connectors,
  }
}

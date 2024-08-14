import type {
  CoinbaseWalletParameters,
  MetaMaskParameters,
  WalletConnectParameters,
} from '@wagmi/connectors';
import type { Chain, Transport } from 'viem';
import { createClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import type { Config, CreateConnectorFn } from 'wagmi';
import { createConfig } from 'wagmi';
import { createCoinbaseConnector } from './connectors/coinbase.js';
import {
  alpha,
  binance,
  bitget,
  bitpie,
  block,
  brave,
  dcent,
  exodus,
  frame,
  frontier,
  gate,
  hyperpay,
  imtoken,
  liquality,
  okx,
  oneinch,
  ownbit,
  safepal,
  status,
  taho,
  tokenary,
  tokenpocket,
  trust,
  xdefi,
} from './connectors/connectors.js';
import { createMetaMaskConnector } from './connectors/metaMask.js';
import { createWalletConnectConnector } from './connectors/walletConnect.js';
import { isWalletInstalled } from './utils/isWalletInstalled.js';

export type _chains = readonly [Chain, ...Chain[]];
export type _transports = Record<_chains[number]['id'], Transport>;

export interface DefaultWagmiConfigProps {
  walletConnect?: WalletConnectParameters;
  coinbase?: CoinbaseWalletParameters;
  metaMask?: MetaMaskParameters;
  wagmiConfig?: {
    ssr?: boolean;
  };
  connectors?: CreateConnectorFn[];
  /**
   * Load Wallet SDKs only if the wallet is the most recently connected wallet
   */
  lazy?: boolean;
}

export interface DefaultWagmiConfigResult {
  config: Config;
  connectors: CreateConnectorFn[];
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
  props?: DefaultWagmiConfigProps,
): DefaultWagmiConfigResult {
  const connectors: CreateConnectorFn[] = [
    bitget,
    gate,
    exodus,
    taho,
    binance,
    frontier,
    okx,
    trust,
    status,
    alpha,
    block,
    bitpie,
    brave,
    dcent,
    frame,
    hyperpay,
    imtoken,
    liquality,
    ownbit,
    tokenpocket,
    xdefi,
    oneinch,
    tokenary,
    safepal,
    ...(props?.connectors ?? []),
  ];

  const config = createConfig({
    chains: [mainnet],
    client({ chain }) {
      return createClient({ chain, transport: http() });
    },
    ...props?.wagmiConfig,
  });

  const localStorage =
    typeof window !== 'undefined' ? window.localStorage : undefined;

  // Check if WalletConnect properties exist in the props
  if (props?.walletConnect) {
    // Retrieve the ID of the most recently connected wallet connector from storage
    const recentConnectorId = localStorage?.getItem(
      `${config.storage?.key}.recentConnectorId`,
    );
    // If WalletConnect is the most recently connected wallet or lazy loading is disabled,
    // add the WalletConnect connector to the beginning of the connectors list
    if (recentConnectorId?.includes?.('walletConnect') || !props.lazy) {
      connectors.unshift(createWalletConnectConnector(props.walletConnect));
    }
  }

  if (!props?.lazy && props?.coinbase && !isWalletInstalled('coinbase')) {
    const recentConnectorId = localStorage?.getItem(
      `${config.storage?.key}.recentConnectorId`,
    );
    if (recentConnectorId?.includes?.('coinbaseWalletSDK') || !props.lazy) {
      connectors.unshift(createCoinbaseConnector(props.coinbase));
    }
  }

  if (props?.metaMask && !isWalletInstalled('metaMask')) {
    const recentConnectorId = localStorage?.getItem(
      `${config.storage?.key}.recentConnectorId`,
    );
    if (recentConnectorId?.includes?.('metaMaskSDK') || !props.lazy) {
      connectors.unshift(createMetaMaskConnector(props.metaMask));
    }
  }

  return {
    config,
    connectors,
  };
}

import type { Config, CreateConnectorFn } from '@bigmi/client'
import {
  binance,
  bitget,
  createConfig,
  ctrl,
  leather,
  magicEden,
  okx,
  onekey,
  oyl,
  phantom,
  unisat,
  xverse,
} from '@bigmi/client'
import { bitcoin, createClient, http } from '@bigmi/core'
import { ChainId } from '@lifi/sdk'

export interface DefaultBigmiConfigProps {
  bigmiConfig?: {
    ssr?: boolean
    multiInjectedProviderDiscovery?: boolean
  }
  connectors?: CreateConnectorFn[]
  /**
   * Load Wallet SDKs only if the wallet is the most recently connected wallet
   */
  lazy?: boolean
}

export interface DefaultBigmiConfigResult {
  config: Config
  connectors: CreateConnectorFn[]
}

/**
 * Creates default Bigmi config that can be later synced (via useSyncBigmiConfig) with chains fetched from LI.FI API.
 * @param props Properties to setup connectors. {@link DefaultBigmiConfigProps}
 * @returns Bigmi config and connectors. {@link DefaultBigmiConfigResult}
 * @example
 *  const { config, connectors } = createDefaultBigmiConfig();
 *  export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
 *    const { chains } = useAvailableChains();
 *    useSyncBigmiConfig(config, connectors, chains);
 *    return (
 *      <BigmiProvider config={wagmi.config} reconnectOnMount={false}>
 *        {children}
 *      </BigmiProvider>
 *    );
 *  };
 */
export function createDefaultBigmiConfig(
  props: DefaultBigmiConfigProps = {
    bigmiConfig: { multiInjectedProviderDiscovery: false },
  }
): DefaultBigmiConfigResult {
  const connectors: CreateConnectorFn[] = [
    phantom({ chainId: ChainId.BTC }),
    xverse({ chainId: ChainId.BTC }),
    unisat({ chainId: ChainId.BTC }),
    ctrl({ chainId: ChainId.BTC }),
    okx({ chainId: ChainId.BTC }),
    leather({ chainId: ChainId.BTC }),
    onekey({ chainId: ChainId.BTC }),
    binance({ chainId: ChainId.BTC }),
    bitget({ chainId: ChainId.BTC }),
    oyl({ chainId: ChainId.BTC }),
    magicEden({ chainId: ChainId.BTC }),
    ...(props?.connectors ?? []),
  ]

  const config = createConfig({
    chains: [bitcoin],
    connectors,
    client({ chain }) {
      return createClient({ chain, transport: http() })
    },
    ...props?.bigmiConfig,
  })

  return {
    config,
    connectors,
  }
}

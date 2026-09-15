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
  unhosted,
  unisat,
  xverse,
} from '@bigmi/client'
import { bitcoin, createClient, http } from '@bigmi/core'

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
 * Creates the default Bigmi config. Bitcoin is a single chain, so unlike the
 * Ethereum provider there is nothing to sync against the chains returned by the
 * LI.FI API.
 * @param props Properties to setup connectors. {@link DefaultBigmiConfigProps}
 * @returns Bigmi config and connectors. {@link DefaultBigmiConfigResult}
 * @example
 *  const { config } = createDefaultBigmiConfig();
 *  export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
 *    useReconnect(config);
 *    return (
 *      <BigmiProvider config={config} reconnectOnMount={false}>
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
    xverse(),
    unisat(),
    ctrl(),
    okx(),
    leather(),
    onekey(),
    binance(),
    bitget(),
    oyl(),
    magicEden(),
    unhosted(),
    ...(props?.connectors ?? []),
  ]

  const config = createConfig({
    chains: [bitcoin],
    connectors,
    client({ chain }) {
      return createClient({ chain, transport: http() })
    },
    ...props?.bigmiConfig,
  }) as Config

  return {
    config,
    connectors,
  }
}

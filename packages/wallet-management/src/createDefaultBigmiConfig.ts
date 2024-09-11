import { createClient, http } from 'viem';
import type { Config, CreateConnectorFn } from 'wagmi';
import { bitcoin } from './utxo/chains/bitcoin.js';
import { ctrl } from './utxo/connectors/ctrl.js';
import { phantom } from './utxo/connectors/phantom.js';
import { unisat } from './utxo/connectors/unisat.js';
import { xverse } from './utxo/connectors/xverse.js';
import { createConfig } from './utxo/createConfig.js';

export interface DefaultBigmiConfigProps {
  bigmiConfig?: {
    ssr?: boolean;
    multiInjectedProviderDiscovery?: boolean;
  };
  connectors?: CreateConnectorFn[];
  /**
   * Load Wallet SDKs only if the wallet is the most recently connected wallet
   */
  lazy?: boolean;
}

export interface DefaultBigmiConfigResult {
  config: Config;
  connectors: CreateConnectorFn[];
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
  },
): DefaultBigmiConfigResult {
  const connectors: CreateConnectorFn[] = [
    phantom(),
    xverse(),
    unisat(),
    ctrl(),
    ...(props?.connectors ?? []),
  ];

  const config = createConfig({
    chains: [bitcoin],
    connectors,
    client({ chain }) {
      return createClient({ chain, transport: http() });
    },
    ...props?.bigmiConfig,
  });

  return {
    config,
    connectors,
  };
}

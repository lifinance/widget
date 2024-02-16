import {
  alpha,
  binance,
  bitget,
  bitpie,
  block,
  brave,
  createCoinbaseConnector,
  createWalletConnectConnector,
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
} from '@lifi/wallet-management';
import { useMemo, type FC, type PropsWithChildren } from 'react';
import type { Chain } from 'viem';
import { createClient } from 'viem';
import type { CreateConnectorFn } from 'wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { defaultWalletConnectProjectId } from '../../config/walletConnect.js';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { LiFiToolLogo } from '../../icons/lifi.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { formatChain } from './utils.js';

const connectors: Record<string, CreateConnectorFn | undefined> = {
  walletConnect: undefined,
  coinbase: undefined,
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
};

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig();
  const { chains } = useAvailableChains();

  const wagmiConfig = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(formatChain) as [Chain, ...Chain[]])
      : [mainnet];
    if (!connectors['walletConnect']) {
      const params = walletConfig?.walletConnect ?? {
        projectId: defaultWalletConnectProjectId,
      };
      connectors['walletConnect'] = createWalletConnectConnector(params);
    }
    if (!connectors['coinbase']) {
      const params = walletConfig?.coinbase ?? {
        appName: 'LI.FI',
        appLogoUrl: LiFiToolLogo,
      };
      connectors['coinbase'] = createCoinbaseConnector(params);
    }

    const wagmiConfig = createConfig({
      chains: _chains,
      connectors: Object.values(connectors) as CreateConnectorFn[],
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
      // transports: _chains.reduce(
      //   (transports, chain) => {
      //     transports[chain.id] = http();
      //     return transports;
      //   },
      //   {} as Record<number, Transport>,
      // ),

      // Workaround for Wagmi config re-creation after we load chains.
      // Internal Wagmi hydration logic doesn't allow the safe creation of new configs in runtime.
      ssr: !chains?.length,
    });

    return wagmiConfig;
  }, [chains, walletConfig?.coinbase, walletConfig?.walletConnect]);

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={Boolean(chains?.length)}
    >
      {children}
    </WagmiProvider>
  );
};

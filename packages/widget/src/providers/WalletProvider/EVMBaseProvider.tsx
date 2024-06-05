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
import { useEffect, useState, type FC, type PropsWithChildren } from 'react';
import type { Chain } from 'viem';
import { createClient } from 'viem';
import type { CreateConnectorFn } from 'wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { reconnect } from 'wagmi/actions';
import { mainnet } from 'wagmi/chains';
import { defaultWalletConnectProjectId } from '../../config/walletConnect.js';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { LiFiToolLogo } from '../../icons/lifi.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { formatChain } from './utils.js';

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig();
  const { chains } = useAvailableChains();
  const [connectors] = useState<CreateConnectorFn[]>(() => [
    createWalletConnectConnector(
      walletConfig?.walletConnect ?? {
        projectId: defaultWalletConnectProjectId,
      },
    ),
    createCoinbaseConnector(
      walletConfig?.coinbase ?? {
        appName: 'LI.FI',
        appLogoUrl: LiFiToolLogo,
      },
    ),
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
  ]);
  const [wagmiConfig] = useState(() => {
    const config = createConfig({
      chains: [mainnet],
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
    });
    return config;
  });

  useEffect(() => {
    if (chains?.length) {
      const _chains = chains.map(formatChain) as [Chain, ...Chain[]];
      wagmiConfig._internal.chains.setState(_chains);
      wagmiConfig._internal.connectors.setState(() =>
        [
          ...connectors,
          ...(wagmiConfig._internal.mipd
            ?.getProviders()
            .map(wagmiConfig._internal.connectors.providerDetailToConnector) ??
            []),
        ].map(wagmiConfig._internal.connectors.setup),
      );
      reconnect(wagmiConfig);
    }
  }, [chains, connectors, wagmiConfig]);

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

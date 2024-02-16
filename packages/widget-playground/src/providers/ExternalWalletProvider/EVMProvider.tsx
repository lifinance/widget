import { useMemo, type FC, type PropsWithChildren } from 'react';
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
import { formatChain, useAvailableChains } from '@lifi/widget';
import type { Chain } from 'viem';
import { createClient } from 'viem';
import { WagmiProvider, createConfig, http, CreateConnectorFn } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useEnvVariables } from '../../providers/EnvVariablesProvider';

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

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { EVMWalletConnectId } = useEnvVariables();
  const { chains } = useAvailableChains();

  const wagmiConfig = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(formatChain) as [Chain, ...Chain[]])
      : [mainnet];
    // Add ENS contracts
    const _mainnet = _chains.find((chain) => chain.id === mainnet.id);
    if (_mainnet) {
      _mainnet.contracts = mainnet.contracts;
    }

    if (!connectors['walletConnect']) {
      connectors['walletConnect'] = createWalletConnectConnector({
        projectId: EVMWalletConnectId,
      });
    }

    if (!connectors['coinbase']) {
      connectors['coinbase'] = createCoinbaseConnector({
        appName: 'LI.FI Playground',
      });
    }

    const wagmiConfig = createConfig({
      chains: _chains,
      connectors: Object.values(connectors) as CreateConnectorFn[],
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
      ssr: !chains?.length,
    });

    return wagmiConfig;
  }, [chains]);

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={Boolean(chains?.length)}
    >
      {children}
    </WagmiProvider>
  );
};

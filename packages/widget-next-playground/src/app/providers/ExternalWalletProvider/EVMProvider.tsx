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
  rabby,
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
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT) {
  console.error(
    'NEXT_PUBLIC_WALLET_CONNECT is required in the projects .env.local file',
  );
}

const connectors = [
  createWalletConnectConnector({
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT!,
  }),
  createCoinbaseConnector({ appName: 'LI.FI Playground' }),
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
  rabby,
];

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
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
    const wagmiConfig = createConfig({
      chains: _chains,
      connectors: connectors as any,
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

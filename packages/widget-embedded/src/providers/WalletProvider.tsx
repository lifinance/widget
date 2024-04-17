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
  metaMask,
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
import { useMemo, type FC, type PropsWithChildren } from 'react';
import type { Chain } from 'viem';
import { createClient } from 'viem';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const connectors = [
  metaMask,
  createWalletConnectConnector({
    projectId: import.meta.env.VITE_WALLET_CONNECT,
  }),
  createCoinbaseConnector({ appName: 'LI.FI NFT Demo' }),
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
];

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains();

  const wagmiConfig = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(formatChain) as [Chain, ...Chain[]])
      : [mainnet];
    const wagmiConfig = createConfig({
      chains: _chains,
      connectors: connectors,
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
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

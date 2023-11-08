import {
  alpha,
  binance,
  bitget,
  bitpie,
  block,
  brave,
  coinbase,
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
  walletConnect,
  xdefi,
} from '@lifi/wallet-management';
import type { FC, PropsWithChildren } from 'react';
import { createClient } from 'viem';
import type { Config } from 'wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrum, bsc, mainnet, polygon } from 'wagmi/chains';
import { useWidgetConfig } from '../WidgetProvider';

export const wagmiConfig: Config = createConfig({
  chains: [mainnet, arbitrum, bsc, polygon],
  connectors: [
    metaMask,
    walletConnect,
    coinbase,
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
  ],
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
});

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletManagement } = useWidgetConfig();
  // const { chains } = useAvailableChains();

  // const config = useMemo(() => {
  //   // const _chains: [Chain, ...Chain[]] = chains?.length
  //   //   ? (chains.map(formatChain) as [Chain, ...Chain[]])
  //   //   : [mainnet];
  //   wagmiConfig = createConfig({
  //     chains: [mainnet],
  //     connectors: [
  //       defaultWallet,
  //       metaMask,
  //       walletConnect,
  //       coinbase,
  //       bitget,
  //       gate,
  //       exodus,
  //       taho,
  //       binance,
  //       frontier,
  //       okx,
  //       trust,
  //       status,
  //       alpha,
  //       block,
  //       bitpie,
  //       brave,
  //       dcent,
  //       frame,
  //       hyperpay,
  //       imtoken,
  //       liquality,
  //       ownbit,
  //       tokenpocket,
  //       xdefi,
  //       oneinch,
  //       tokenary,
  //       safepal,
  //     ],
  //     client({ chain }) {
  //       return createClient({ chain, transport: http() });
  //     },
  //     transports: _chains.reduce(
  //       (transports, chain) => {
  //         transports[chain.id] = http();
  //         return transports;
  //       },
  //       {} as Record<number, Transport>,
  //     ),
  //   });
  //   return wagmiConfig;
  // }, []);

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

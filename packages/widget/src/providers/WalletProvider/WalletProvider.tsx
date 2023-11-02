import {
  alpha,
  binance,
  bitget,
  bitpie,
  block,
  brave,
  coinbase,
  dcent,
  defaultWallet,
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
import { useMemo } from 'react';
import type { Transport } from 'viem';
import type { Config } from 'wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { mainnet } from 'wagmi/chains';
import { useAvailableChains } from '../../hooks';
import { useWidgetConfig } from '../WidgetProvider';
import { formatChain } from './utils';

export let wagmiConfig: Config;

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletManagement } = useWidgetConfig();
  const { chains } = useAvailableChains();

  const config = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(formatChain) as [Chain, ...Chain[]])
      : [mainnet];
    wagmiConfig = createConfig({
      chains: _chains,
      connectors: [
        defaultWallet,
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
      transports: _chains.reduce(
        (transports, chain) => {
          transports[chain.id] = http();
          return transports;
        },
        {} as Record<number, Transport>,
      ),
    });
    return wagmiConfig;
  }, [chains]);

  return (
    <WagmiProvider config={config} reconnectOnMount>
      {children}
    </WagmiProvider>
  );
};

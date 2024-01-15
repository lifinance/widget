import { EVM, SDKProvider, Solana, config } from '@lifi/sdk';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useEffect } from 'react';
import { useConfig } from 'wagmi';
import { useWidgetConfig } from '../WidgetProvider';

export const SDKProviders = () => {
  const { sdkConfig } = useWidgetConfig();
  const { wallet } = useWallet();
  const wagmiConfig = useConfig();

  useEffect(() => {
    // Configure SDK Providers
    const providers: SDKProvider[] = [
      EVM({
        getWalletClient: () => getWalletClient(wagmiConfig),
        switchChain: async (chainId: number) => {
          const chain = await switchChain(wagmiConfig, { chainId });
          return getWalletClient(wagmiConfig, { chainId: chain.id });
        },
      }),
    ];
    if (wallet?.adapter) {
      providers.push(
        Solana({
          async getWalletAdapter() {
            return wallet?.adapter as WalletAdapter;
          },
        }),
      );
    }
    if (sdkConfig?.providers?.length) {
      providers.push(...sdkConfig?.providers);
    }
    config.setProviders(providers);
  }, [sdkConfig?.providers, wagmiConfig, wallet?.adapter]);

  return null;
};

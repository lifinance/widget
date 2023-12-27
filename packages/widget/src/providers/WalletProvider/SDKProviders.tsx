import { EVM, Solana, config } from '@lifi/sdk';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useEffect } from 'react';
import { useConfig } from 'wagmi';

export const SDKProviders = () => {
  const { wallet } = useWallet();
  const wagmiConfig = useConfig();

  useEffect(() => {
    // Configure SDK Providers
    config.setProviders([
      EVM({
        getWalletClient: () => getWalletClient(wagmiConfig),
        switchChain: async (chainId: number) => {
          const chain = await switchChain(wagmiConfig, { chainId });
          return getWalletClient(wagmiConfig, { chainId: chain.id });
        },
      }),
      Solana({
        async getWalletAdapter() {
          return wallet?.adapter as WalletAdapter;
        },
      }),
    ]);
  }, [wagmiConfig, wallet?.adapter]);

  return null;
};

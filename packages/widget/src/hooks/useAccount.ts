import { ChainId, ChainType } from '@lifi/sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Chain } from 'viem';
import type { Connector } from 'wagmi';
import { useDisconnect, useAccount as useWagmiAccount } from 'wagmi';

export interface Account {
  address?: string;
  addresses?: readonly string[];
  chain?: Chain;
  chainId?: number;
  chainType?: ChainType;
  connector?: Connector;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected';
}

export const useAccount = () => {
  const account = useWagmiAccount();
  const { wallet } = useWallet();

  return useMemo(() => {
    const svm: Account = wallet?.adapter.publicKey
      ? {
          address: wallet?.adapter.publicKey.toString(),
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          isConnected: Boolean(wallet?.adapter.publicKey),
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: !wallet,
          status: 'connected',
        }
      : {
          isConnected: false,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: true,
          status: 'disconnected',
        };
    const evm = { ...account, chainType: ChainType.EVM };

    return {
      account: account.isConnected ? evm : svm,
      accounts: [evm, svm],
    };
  }, [account, wallet]);
};

export const useAccountDisconnect = () => {
  const account = useWagmiAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { wallet, disconnect } = useWallet();

  return () => {
    if (account.isConnected) {
      wagmiDisconnect();
    }
    if (wallet) {
      disconnect();
    }
  };
};

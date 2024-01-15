import { ChainId, ChainType } from '@lifi/sdk';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Chain } from 'viem';
import type { Connector } from 'wagmi';
import { useAccount as useWagmiAccount } from 'wagmi';

export interface AccountBase {
  address?: string;
  addresses?: readonly string[];
  chain?: Chain;
  chainId?: number;
  chainType?: ChainType;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected';
}

export interface EVMAccount extends AccountBase {
  chainType: ChainType.EVM;
  connector?: Connector;
}

export interface SVMAccount extends AccountBase {
  chainType: ChainType.SVM;
  connector?: WalletAdapter;
}

export type Account = EVMAccount | SVMAccount;

export interface AccountResult {
  account: Account;
  /**
   * Connected accounts
   */
  accounts: Account[];
  isConnected: boolean;
}

export const useAccount = (): AccountResult => {
  const account = useWagmiAccount();
  const { wallet } = useWallet();

  return useMemo(() => {
    const svm: Account = wallet?.adapter.publicKey
      ? {
          address: wallet?.adapter.publicKey.toString(),
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connector: wallet?.adapter,
          isConnected: Boolean(wallet?.adapter.publicKey),
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: !wallet,
          status: 'connected',
        }
      : {
          chainType: ChainType.SVM,
          isConnected: false,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: true,
          status: 'disconnected',
        };
    const evm: Account = { ...account, chainType: ChainType.EVM };

    const accounts = [evm, svm].filter((account) => account.isConnected);
    return {
      account: account.isConnected ? evm : svm,
      // We need to return only connected account list
      accounts,
      isConnected: accounts.length > 0,
    };
  }, [account, wallet]);
};
